async function unmuteCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const clientData = thisConnector.getClient(userId);
        if (!clientData) return;
        const sock = clientData.sock;

        await sock.groupSettingUpdate(from, 'not_announcement'); 
        await thisConnector.sendMessage(userId, from, { 
            text: '🔓 *𝐺𝑅𝑂𝑈𝑃𝐸 𝑂𝑈𝑉𝐸𝑅𝑇..*\n\n𝑉𝐸𝑁𝐸𝑍 𝐿𝐸 𝐺𝑅𝑂𝑈𝑃 𝐸𝑆𝑇 𝑂𝑈𝑉𝐸𝑅𝑇.\n\n— *𝐵𝑌 𝑆𝐻𝐴𝐷𝑂𝑊221*' 
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { execute: unmuteCommand };
