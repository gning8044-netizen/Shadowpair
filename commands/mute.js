async function muteCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const clientData = thisConnector.getClient(userId);
        if (!clientData) return;
        const sock = clientData.sock;

        await sock.groupSettingUpdate(from, 'announcement');
        const durationInMinutes = parseInt(args[0]);

        if (durationInMinutes && durationInMinutes > 0) {
            await thisConnector.sendMessage(userId, from, { 
                text: `🔒 *𝐴𝐿𝐿𝐸𝑍 𝐿𝐸 𝐺𝑅𝑂𝑈𝑃 𝐷𝑂𝐼𝑇 𝐶𝐸 𝑅𝐸𝑃𝑂𝑆𝐸́*\n\n𝐿𝐸 𝐺𝑅𝑂𝑈𝑃𝐸 𝐷𝑂𝐼𝑇 𝑅𝐸𝑃𝑂𝑆𝐸́ 𝐷𝐴𝑁𝑆 *${durationInMinutes} minutes*.\n\n— *𝑃𝑂𝑊𝑅𝐸𝐷 𝐵𝑌: 𝐷𝐸𝑉 𝑆𝐻𝐴𝐷𝑂𝑊 𝑇𝐸𝐶𝐻*` 
            });
            
            setTimeout(async () => {
                try {
                    await sock.groupSettingUpdate(from, 'not_announcement');
                    await thisConnector.sendMessage(userId, from, { 
                        text: '🔓 *𝐿𝐸 𝐺𝑅𝑂𝑈𝑃𝐸 𝐸𝑆𝑇 𝑂𝑈𝑉𝐸𝑅𝑇 𝑉𝑂𝑈𝑆 𝑃𝑂𝑈𝑉𝐸𝑍 𝐵𝐴𝑉𝐴𝑅𝐷𝐸𝑅..*\n\n𝑘𝑎𝑦𝑒 𝑙𝑒𝑛𝑒 𝑛𝑖𝑜𝑢 𝑐𝑎𝑠..\n\n— *𝑃𝑂𝑊𝑅𝐸𝐷 𝐵𝑌: 𝐷𝐸𝑉 𝑆𝐻𝐴𝐷𝑂𝑊 𝑇𝐸𝐶𝐻*' 
                    });
                } catch (err) {
                    console.error(err);
                }
            }, durationInMinutes * 60 * 1000);
        } else {
            await thisConnector.sendMessage(userId, from, { 
                text: '🔒 *𝐹𝐸𝑅𝑀𝐸́ 𝐵𝑌 𝐷𝐸𝑉 𝑆𝐻𝐴𝐷𝑂𝑊*\n\n𝐿𝐸 𝐺𝑅𝑂𝑈𝑃𝐸 𝐸𝑆𝑇 𝐸𝑁 𝑃𝐴𝑈𝑆𝐸 𝐷𝐸́𝐺𝐴𝐺𝐸𝑅.\n\n— *𝑃𝑂𝑊𝑅𝐸𝐷 𝐵𝑌: 𝐷𝐸𝑉 𝑆𝐻𝐴𝐷𝑂𝑊 𝑇𝐸𝐶𝐻*' 
            });
        }
    } catch (error) {
        console.error(error);
        await thisConnector.sendMessage(userId, from, { text: '❌ *𝑆𝐸𝑈𝐿𝑀𝐸𝑁𝑇 𝐿𝐸 𝑃𝑅𝑂𝑃𝑅𝐼𝐸́𝑇𝐸́ 𝐷𝑈 𝐵𝑂𝑇 𝑃𝐸𝑈𝑉𝐸𝑁𝑇 𝑈𝑆𝐸 𝐶𝐸𝑇𝑇𝐸 𝐶𝑂𝑀𝑀𝐴𝑁𝐷𝐸 * • 𝑒𝑟𝑟𝑒𝑢𝑟 𝑑𝑒 𝑓𝑒𝑟𝑚𝑖𝑒̀𝑟𝑒.' });
    }
}

module.exports = { execute: muteCommand };
