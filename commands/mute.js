// commands/mute.js
module.exports = {
  name: 'mute',
  description: 'Ferme le groupe.',
  async execute(connector, from, args, config, userId) {
    // Vérifie si c'est bien un groupe
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) return;

    try {
      // On récupère l'instance de connexion 'sock' cachée dans ton connector
      const client = connector.getClient(userId);
      if (!client || !client.sock) return;

      // Action de fermeture du groupe
      await client.sock.groupSettingUpdate(from, 'announcement');
      
      // Envoi du message de confirmation
      await connector.sendMessage(userId, from, { 
        text: '*MESSAGE DU SYSTEME*\n\nLe groupe est desormais ferme. Seuls les administrateurs peuvent envoyer des messages.' 
      });

    } catch (error) {
      console.error(error);
      await connector.sendMessage(userId, from, { 
        text: 'Impossible de fermer le groupe. Verifiez que le bot est bien administrateur.' 
      });
    }
  }
};
