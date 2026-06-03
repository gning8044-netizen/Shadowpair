async function tagAllCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const clientData = thisConnector.getClient(userId);
        if (!clientData) return;
        const sock = clientData.sock;

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants || [];

        let messageText = '📢 *𝑆𝐴𝐿𝑈𝑇𝐴𝑇𝐼𝑂𝑁 𝐿𝐸𝑆 𝐴𝑀𝐼𝑆 𝐸𝑇 𝐿𝐸𝑆 𝐸𝑁𝐸𝑀𝐼𝑆 𝐷𝐸 𝐷𝐸𝑉 𝑆𝐻𝐴𝐷𝑂𝑊*\n\n';
        participants.forEach(participant => {
            messageText += `@${participant.id.split('@')[0]}\n`;
        });
        messageText += '\n— _𝑃𝑂𝑊𝑅𝐸𝐷 𝐵𝑌: 𝐷𝐸𝑉 𝑆𝐻𝐴𝐷𝑂𝑊221_';

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
