const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const clients = new Map();

class WhatsAppConnector {
  async start(userId, phoneNumber) {
    if (!userId) return { success: false, message: 'userId requis' };
    const sessionDir = path.join(__dirname, `../sessions/user_${userId}`);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    try {
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
      const { version } = await fetchLatestBaileysVersion();
      const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: ['Android', 'Chrome', '120.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: false
      });

      return new Promise((resolve, reject) => {
        sock.ev.on('connection.update', async (update) => {
          const { connection, lastDisconnect } = update;
          if (connection === 'open') {
            const botNumber = sock.user.id.split(':')[0];
            clients.set(userId, { sock, isConnected: true, botNumber });
            console.log(chalk.green(`[WA] ✅ Utilisateur ${userId} connecté`));
            resolve({ success: true, alreadyConnected: true });
          }
          if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason === DisconnectReason.loggedOut) {
              console.log(chalk.red(`[WA] Session expirée pour ${userId}`));
              clients.delete(userId);
              reject({ success: false, message: 'Session expirée' });
            } else {
              setTimeout(() => this.start(userId, phoneNumber), 5000);
            }
          }
        });
        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
          const msg = messages[0];
          if (!msg.message) return;

          const from = msg.key.remoteJid;
          const isGroup = from.endsWith('@g.us');
          const sender = isGroup ? (msg.key.participant || from) : from;
          const senderNum = sender.split('@')[0];

          const clientData = clients.get(userId);
          if (clientData && senderNum === clientData.botNumber) return;

          let body = '';
          const mtype = Object.keys(msg.message)[0];
          if (mtype === 'conversation') body = msg.message.conversation;
          else if (mtype === 'extendedTextMessage') body = msg.message.extendedTextMessage?.text || '';

          if (!body || !body.startsWith('.')) return;

          const args = body.slice(1).trim().split(/\s+/);
          const cmdName = args[0].toLowerCase();
          const cmdArgs = args.slice(1);
          const command = global.whatsappCommands?.get(cmdName);
          if (command) {
            try {
              await command.execute(this, from, cmdArgs, require('../config'), userId);
            } catch (err) {
              console.error(`[WA] Erreur commande ${cmdName}:`, err);
              await this.sendMessage(userId, from, { text: '❌ Erreur lors de l’exécution.' });
            }
          }
        });

        if (!state.creds.registered) {
          setTimeout(async () => {
            try {
              const code = await sock.requestPairingCode(phoneNumber);
              resolve({ success: true, code });
            } catch (err) {
              reject({ success: false, message: err.message });
            }
          }, 2000);
        } else {
          resolve({ success: true, alreadyConnected: true });
        }
      });
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  async sendMessage(userId, jid, content) {
    const client = clients.get(userId);
    if (!client || !client.isConnected) return null;
    try {
      return await client.sock.sendMessage(jid, content);
    } catch (e) {
      return null;
    }
  }

  isConnected(userId) {
    const client = clients.get(userId);
    return client ? client.isConnected : false;
  }

  getBotNumber(userId) {
    const client = clients.get(userId);
    return client ? client.botNumber : null;
  }

  getClient(userId) {
    return clients.get(userId);
  }
}

module.exports = new WhatsAppConnector();