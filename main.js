const wa = require('./libs/wa');
const config = require('./config');
const fs = require('fs');

const mainKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '📱 Pairing Code', callback_data: 'pair_code' }, { text: '📷 QR Code', callback_data: 'pair_qr' }],
      [{ text: '📊 Status', callback_data: 'status' }, { text: 'ℹ️ Info', callback_data: 'info' }]
    ]
  }
};

async function handleMessage(bot, msg) {
  const chatId = msg.chat?.id || msg.message?.chat?.id;
  const userId = msg.from?.id;
  const text = msg.text || '';

  if (text?.startsWith('/')) {
    const args = text.slice(1).split(' ');
    const cmd = args[0].toLowerCase();
    const params = args.slice(1);

    switch (cmd) {
      case 'start':
        await bot.sendMessage(chatId, 
          `🕸️━━ 𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐁𝐎𝐓 ━━🕸️\n\n╭─ C O N T R O L  P A N E L ─╮\n│ 🕷️ Status   : Online\n│ 🕷️ Version  : V2\n│ 🕷️ Capacity : Multi‑Session\n│ 🕷️ Dev      : Shadow221🇸🇳\n╰────────────────\n\n╭─ C O M M A N D S ─╮\n│ ✨ /start   → Show menu\n│ 🧑‍💻 /pair    → Connect WhatsApp\n╰─────────────────\n\n''𝙲𝚁𝙴𝙴 𝙿𝙰𝚁: ᴅᴇᴠ sʜᴀᴅᴏᴡ ᴛᴇᴄʜ.'' ‼️`, 
          { parse_mode: 'Markdown', reply_markup: mainKeyboard.reply_markup });
        break;

      case 'pair':
      case 'pairing':
        if (!params[0]) return bot.sendMessage(chatId, '❌ /pair 628xxxxxxxx');
        const phone = params[0].replace(/\D/g, '');
        await bot.sendMessage(chatId, '⏳ *Génération du code...*', { parse_mode: 'Markdown' });
        try {
          const r = await wa.start(userId, phone);
          if (r.success && r.code) {
            const cf = r.code.match(/.{1,4}/g)?.join('-') || r.code;
            await bot.sendMessage(chatId, 
              `🔑 𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐃 – Pairing Code 🕷️\n\n📱 Phone  : +${phone}\n🔢 Code   : \`${cf}\`\n\n1️⃣  Open WhatsApp\n2️⃣  Linked Devices → Link a device\n3️⃣  Link with phone number\n4️⃣  Enter the code above\n\n⏳ Expires in 5 minutes ‼️`,
              { parse_mode: 'Markdown' });
          } else if (r.alreadyConnected) {
            await bot.sendMessage(chatId, '✅ WhatsApp déjà lié à ce compte Telegram !');
          } else {
            await bot.sendMessage(chatId, `❌ ${r.message}`);
          }
        } catch (e) {
          await bot.sendMessage(chatId, `❌ ${e.message}`);
        }
        break;

      case 'status':
        const connected = wa.isConnected(userId);
        const number = wa.getBotNumber(userId) || 'N/A';
        await bot.sendMessage(chatId, `📱 WhatsApp : ${connected ? '🟢 Connecté' : '🔴 Déconnecté'}\n📞 Numéro : +${number}`);
        break;

      case 'info':
        const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        await bot.sendMessage(chatId, `🤖 ${config.name} v${config.version}\n👤 Owner : ${config.telegram.ownerId}\n💾 RAM : ${mem} MB\n⏱ Uptime : ${Math.floor(process.uptime())}s`);
        break;

      case 'logout':
        const sessionDir = `./sessions/user_${userId}`;
        if (fs.existsSync(sessionDir)) {
          fs.rmSync(sessionDir, { recursive: true, force: true });
          await bot.sendMessage(chatId, '🔓 Session WhatsApp supprimée. Utilisez /pair pour reconnecter.');
        } else {
          await bot.sendMessage(chatId, 'ℹ️ Aucune session trouvée.');
        }
        break;

      default:
        await bot.sendMessage(chatId, '❓ Commande inconnue. /start');
    }
  }

  if (msg.callback_query) {
    const d = msg.callback_query.data;
    const cid = msg.callback_query.message.chat.id;
    const uid = msg.callback_query.from.id;
    switch (d) {
      case 'pair_code': await bot.sendMessage(cid, '/pair 628xxx'); break;
      case 'pair_qr': await bot.sendMessage(cid, '/qr 628xxx'); break;
      case 'status': await bot.sendMessage(cid, `État : ${wa.isConnected(uid) ? 'ON' : 'OFF'}`); break;
      case 'info': await bot.sendMessage(cid, `${config.name} v${config.version}`); break;
    }
    await bot.answerCallbackQuery(msg.callback_query.id);
  }
}

module.exports = { handleMessage };