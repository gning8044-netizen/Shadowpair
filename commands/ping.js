module.exports = {
  execute: async (wa, from, args, config, userId) => {
    try {
      const start = Date.now();
      
      // Premier message d'attente stylisé
      await wa.sendMessage(userId, from, { 
        text: "⚡ *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* • _Analyse de la connexion..._" 
      });

      // Calcul du temps de réponse
      const latency = Date.now() - start;

      // Construction de la réponse personnalisée
      const responseText = 
        `╔════════════════════╗\n` +
        `║     *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* ║\n` +
        `╚════════════════════╝\n\n` +
        `📡 *ÉTIQUETTE* : PONG !\n` +
        `⏳ *LATENCE* : \`${latency} ms\`\n` +
        `🟢 *STATUT* : En ligne & Opérationnel\n` +
        `👤 *SESSION* : ID \`${userId}\`\n\n` +
        `— _Propulsé par le système SHADOW PRIME_`;

      // Envoi du rapport final
      await wa.sendMessage(userId, from, { text: responseText });

    } catch (error) {
      // Gestion des erreurs simple en cas de problème de connexion
      await wa.sendMessage(userId, from, { 
        text: "❌ Impossible de mesurer la latence actuelle.\n\n— *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇*" 
      });
    }
  }
};
