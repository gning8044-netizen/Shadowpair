require('dotenv').config();

module.exports = {
  name: "𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇",
  version: "2.0.0",
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    ownerId: process.env.BOT_ID || "7537529476"
  }
};