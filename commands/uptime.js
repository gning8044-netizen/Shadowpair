module.exports = {
  execute: async (wa, from, args, config, userId) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const text = `┌─🤖 DEV SHADOW XMD ─┐
│
│ ⏱️ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
│ 💾 RAM: ${ram} MB
│
│ "✅ DEV SHADOW XMD"
│     - 🫅 Créé par Dev Shadow Tech -
└────────────────────┘`;
    await wa.sendMessage(userId, from, { text });
  }
