module.exports = {
  execute: async (wa, from, args, config, userId) => {
    const text = `*DEV SHADOW*\n\n> 𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇 – Bot actif ✅`;
    await wa.sendMessage(userId, from, { text });
  }
};