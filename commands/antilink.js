// commands/antilink.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/antilink.json');

// Fonctions pour gérer la base de données JSON (Statut + Avertissements)
function readDB() {
  if (!fs.existsSync(dbPath)) return { status: {}, warns: {} };
  try { 
    const content = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return {
      status: content.status || {},
      warns: content.warns || {}
    };
  } catch (e) { 
    return { status: {}, warns: {} }; 
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

let isListenerAttached = false;

module.exports = {
  name: 'antilink',
  description: 'Gère l\'Antilink avec un système de 3 avertissements avant bannissement.',

  // --- 1. CONFIGURATION (.antilink on / off) ---
  async execute(connector, from, args, config, userId) {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) return;

    const action = args[0]?.toLowerCase();
    if (action !== 'on' && action !== 'off') {
      return await connector.sendMessage(userId, from, { text: 'Utilisation : .antilink on ou .antilink off' });
    }

    try {
      const db = readDB();
      db.status[from] = (action === 'on');
      
      if (action === 'off') {
        delete db.warns[from];
      }
      
      writeDB(db);

      const statusText = action === 'on' 
        ? '*SYSTEME ANTILINK ACTIVÉ*\n\nChaque membre a droit à 3 avertissements pour envoi de lien avant d\'être banni définitivement.'
        : '*SYSTEME ANTILINK DÉSACTIVÉ*';

      await connector.sendMessage(userId, from, { text: statusText });

      this.listen(connector, userId);

    } catch (error) {
      console.error(error);
      await connector.sendMessage(userId, from, { text: 'Erreur de configuration.' });
    }
  },

  // --- 2. LE SCANNER AVEC COMPTEUR D'AVERTISSEMENTS ---
  listen(connector, userId) {
    if (isListenerAttached) return;
    isListenerAttached = true;

    const client = connector.getClient(userId);
    if (!client || !client.sock) return;
    const sock = client.sock;

    sock.ev.on('messages.upsert', async ({ messages }) => {
      try {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const chatJid = msg.key.remoteJid;
        if (!chatJid.endsWith('@g.us')) return;

        const db = readDB();
        if (!db.status[chatJid]) return; 

        // Extraction du texte
        let body = '';
        const mtype = Object.keys(msg.message)[0];
        if (mtype === 'conversation') body = msg.message.conversation;
        else if (mtype === 'extendedTextMessage') body = msg.message.extendedTextMessage?.text || '';
        else if (mtype === 'imageMessage') body = msg.message.imageMessage?.caption || '';
        else if (mtype === 'videoMessage') body = msg.message.videoMessage?.caption || '';

        // Détection des liens
        const hasLink = /(https?:\/\/[^\s]+|www\.[^\s]+|wa\.me\/[^\s]+)/gi.test(body);

        if (hasLink) {
          const groupMetadata = await sock.groupMetadata(chatJid);
          const participants = groupMetadata.participants;
          
          // Récupération ultra-sécurisée du JID complet de l'expéditeur
          const sender = msg.key.participant || msg.key.remoteJid;
          if (!sender || sender.includes('@g.us')) return; // Sécurité

          const senderNum = sender.split('@')[0];

          // Ignorer les admins du groupe
          const isAdmin = participants.some(p => p.id === sender && p.admin !== null);
          if (isAdmin) return;

          // 1. Suppression immédiate du message contenant le lien
          await sock.sendMessage(chatJid, { delete: msg.key });

          // 2. Gestion des avertissements
          if (!db.warns[chatJid]) db.warns[chatJid] = {};
          if (!db.warns[chatJid][sender]) db.warns[chatJid][sender] = 0;

          db.warns[chatJid][sender] += 1;
          const currentWarns = db.warns[chatJid][sender];

          if (currentWarns < 3) {
            // Sauvegarde et avertissement (1/3 ou 2/3)
            writeDB(db);
            await sock.sendMessage(chatJid, {
              text: `⚠️ *AVERTISSEMENT ANTILINK* ⚠️\n\n@${senderNum}, les liens sont interdits ici !\n\nNiveau d'alerte : *${currentWarns}/3*\n_À 3 avertissements, vous serez banni._`,
              mentions: [sender]
            });
          } else {
            // Seuil des 3 avertissements atteint -> ACTION DE BANNISEMENT IMMÉDIATE
            await sock.sendMessage(chatJid, {
              text: `🚨 *EXCLUSION ANTILINK (3/3)* 🚨\n\n@${senderNum} a ignoré tous les avertissements. Expulsion définitive du groupe en cours...`,
              mentions: [sender]
            });

            // 1. On vire le membre de WhatsApp d'abord
            await sock.groupParticipantsUpdate(chatJid, [sender], 'remove');

            // 2. On nettoie son compteur dans le fichier JSON après l'expulsion
            const freshDb = readDB();
            if (freshDb.warns[chatJid] && freshDb.warns[chatJid][sender]) {
              delete freshDb.warns[chatJid][sender];
              writeDB(freshDb);
            }
          }
        }
      } catch (err) {
        console.error('[ANTILINK WARN ERROR]:', err);
      }
    });
  }
};
