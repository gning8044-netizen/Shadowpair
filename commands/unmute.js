async function unmuteCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const clientData = thisConnector.getClient(userId);
        if (!clientData) return;
        const sock = clientData.sock;

        await sock.groupSettingUpdate(from, 'not_announcement'); 
        await thisConnector.sendMessage(userId, from, { 
            text: '🔓 *𝐎𝐔𝐕𝐄𝐑𝐓𝐔𝐑𝐄 𝐒𝐇𝐀𝐃𝐎𝐖*\n\nLe groupe est à nouveau ouvert aux membres.\n\n— *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇*' 
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { execute: unmuteCommand };
