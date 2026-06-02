module.exports = {
  execute: async (wa, from, args, config, userId) => {
    try {
      // ----- PERSONNALISATION : identité de l'exécutant -----
      const EXECUTANT = "𝐕𝐎𝐓𝐑𝐄 𝐏𝐒𝐄𝐔𝐃𝐎";  // ← À remplacer
      // -----------------------------------------------------

      // 1. Récupération de la session WhatsApp
      const sock = wa.getClient(userId).sock;
      
      // 2. Récupération des infos du groupe
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants;
      const groupName = metadata.subject || "ce groupe";
      const total = participants.length;

      // Récupération de la liste des admins (leurs ID)
      const adminIds = participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);

      // Notre propre ID (bot)
      const botId = sock.user.id.split(':')[0];

      // Message de départ personnalisé
      await wa.sendMessage(userId, from, { 
        text: `⚡ *KICKALL - Mode : expulsion des non-admins* ⚡\n` +
              `👑 Exécuté par : ${EXECUTANT}\n` +
              `📛 Groupe : ${groupName}\n` +
              `👥 Participants totaux : ${total}\n` +
              `🛡️ Admins protégés : ${adminIds.length}\n` +
              `⏳ Lancement de l’expulsion…\n\n` +
              `_Seuls les membres non-admins seront virés._`
      });

      let kickedCount = 0;

      // 3. Boucle d'expulsion
      for (const participant of participants) {
        const participantId = participant.id;
        
        // Ne pas expulser :
        // - le bot lui-même
        // - les administrateurs
        if (participantId.includes(botId)) continue;
        if (adminIds.includes(participantId)) continue;

        try {
          await sock.groupParticipantsUpdate(from, [participantId], 'remove');
          kickedCount++;
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          continue;
        }
      }

      // 4. Message de fin personnalisé
      await wa.sendMessage(userId, from, { 
        text: `✅ *Opération KICKALL terminée* ✅\n` +
              `👢 Expulsions réussies : ${kickedCount}\n` +
              `🛡️ Admins conservés : ${adminIds.length}\n` +
              `💀 Groupe nettoyé (seuls les admins et le bot restent).\n\n` +
              `— *${EXECUTANT}* —`
      });

    } catch (error) {
      await wa.sendMessage(userId, from, { 
        text: `❌ *ERREUR CRITIQUE* ❌\n` +
              `Impossible d’exécuter KICKALL.\n` +
              `Raison : ${error.message || "inconnue"}\n\n` +
              `— *${EXECUTANT}* —`
      });
    }
  }
};