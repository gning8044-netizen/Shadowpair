const os = require('os');

function formatTime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

async function pingCommand(thisConnector, from, args, config, userId, senderNum) {
    try {
        const start = Date.now();
        const uptime = formatTime(process.uptime());
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const speed = Date.now() - start;

        const response = `
╔════════════════════╗
║     *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* ║
╚════════════════════╝

📡 *𝘚𝘗𝘌𝘌𝘋* : \`${speed} ms\`
⏳ *𝘜𝘗𝘛𝘐𝘔𝘌* : \`${uptime}\`
🧠 *𝘙𝘈𝘔* : \`${freeMem}MB / ${totalMem}MB\`
💻 *𝘗𝘓𝘈𝘛𝘍𝘖𝘙𝘔𝘌* : \`${os.platform()}\`

— _Propulsé par le système SHADOW PRIME_
`.trim();

        await thisConnector.sendMessage(userId, from, { text: response });
    } catch (err) {
        console.error(err);
        await thisConnector.sendMessage(userId, from, { text: '❌ *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* • Erreur lors du ping.' });
    }
}

module.exports = { execute: pingCommand };
