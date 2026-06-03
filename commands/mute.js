async function muteCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const clientData = thisConnector.getClient(userId);
        if (!clientData) return;
        const sock = clientData.sock;

        await sock.groupSettingUpdate(from, 'announcement');
        const durationInMinutes = parseInt(args[0]);

        if (durationInMinutes && durationInMinutes > 0) {
            await thisConnector.sendMessage(userId, from, { 
                text: `🔒 *𝐅𝐄𝐑𝐌𝐄𝐓𝐔𝐑𝐄 𝐒𝐇𝐀𝐃𝐎𝐖*\n\nLe groupe a été fermé pour *${durationInMinutes} minutes*.\n\n— *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇*` 
            });
            
            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(from, 'not_announcement');
                    await thisConnector.sendMessage(userId, from, { 
                        text: '🔓 *𝐎𝐔𝐕𝐄𝐑𝐓𝐔𝐑𝐄 𝐒𝐇𝐀𝐃𝐎𝐖*\n\nLe groupe est à nouveau ouvert.\n\n— *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇*' 
                    });
                } catch (err) {
                    console.error(err);
                }
            }, durationInMinutes * 60 * 1000);
        } else {
            await thisConnector.sendMessage(userId, from, { 
                text: '🔒 *𝐅𝐄𝐑𝐌𝐄𝐓𝐔𝐑𝐄 𝐒𝐇𝐀𝐃𝐎𝐖*\n\nLe groupe a été fermé aux messages.\n\n— *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇*' 
            });
        }
    } catch (error) {
        console.error(error);
        await thisConnector.sendMessage(userId, from, { text: '❌ *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* • Erreur de fermeture.' });
    }
}

module.exports = { execute: muteCommand };
