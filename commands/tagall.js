async function tagAllCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const clientData = thisConnector.getClient(userId);
        if (!clientData) return;
        const sock = clientData.sock;

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants || [];

        let messageText = '📢 *𝐀𝐏𝐏𝐄𝐋 𝐆𝐋𝐎𝐁𝐀𝐋 𝐒𝐇𝐀𝐃𝐎𝐖*\n\n';
        participants.forEach(participant => {
            messageText += `@${participant.id.split('@')[0]}\n`;
        });
        messageText += '\n— _Propulsé par le système SHADOW PRIME_';

        await sock.sendMessage(from, {
            text: messageText,
            mentions: participants.map(p => p.id)
        });
    } catch (error) {
        console.error(error);
        await thisConnector.sendMessage(userId, from, { text: '❌ *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* • Échec du tagall.' });
    }
}

module.exports = { execute: tagAllCommand };
