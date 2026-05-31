module.exports = {
  execute: async (wa, from, args, config, userId) => {
    const start = Date.now();
    await wa.sendMessage(userId, from, { text: '⏳ Calcul de la latence...' });
    const latency = Date.now() - start;
    await wa.sendMessage(userId, from, { text: `🏓 Pong!\n⚡ Latence : ${latency} ms\n\n— *𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇*` });
  }
};