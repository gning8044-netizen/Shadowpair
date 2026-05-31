        else if (mtype === 'extendedTextMessage') body = msg.message.extendedTextMessage?.text || '';
        else if (mtype === 'imageMessage') body = msg.message.imageMessage?.caption || '';
        else if (mtype === 'videoMessage') body = msg.message.videoMessage?.caption || '';

        // Détection des liens internet et WhatsApp
        const hasLink = /(https?:\/\/[^\s]+|www\.[^\s]+|wa\.me\/[^\s]+)/gi.test(body);

        if (hasLink) {
          const groupMetadata = await sock.groupMetadata(chatJid);
          const participants = groupMetadata.participants;
          const sender = msg.key.participant || chatJid;
          const senderNum = sender.split('@')[0];

          // Si l'auteur du lien est admin, on ne fait rien
          const isAdmin = participants.some(p => p.id === sender && p.admin !== null);
          if (isAdmin) return;

          // Action de punition automatique :
          // 1. Supprime le message
          await sock.sendMessage(chatJid, { delete: msg.key });

          // 2. Envoie l'alerte
          await sock.sendMessage(chatJid, { 
            text: `*ALERTE ANTILINK*\n\n@${senderNum} a envoyé un lien interdit. Le message a été supprimé et l'utilisateur a été banni.`,
            mentions: [sender]
          });

          // 3. Expulse le membre
          await sock.groupParticipantsUpdate(chatJid, [sender], 'remove');
        }
      } catch (err) {
        // Erreur silencieuse si le bot perd les droits admin par exemple
        console.error('[ANTILINK BACKGROUND ERROR]:', err);
      }
    });
  }
};
