        const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        await bot.sendMessage(chatId, fmt(`${config.name} v${config.version}\nOwner : ${config.telegram.ownerId}\nRAM : ${mem} MB`, 'INFO'), { parse_mode: 'Markdown' });
        break;

      // ========== NOUVELLE COMMANDE /logout ==========
      case 'logout':
        const sessionDir = path.join(__dirname, `sessions/user_${userId}`);
        if (fs.existsSync(sessionDir)) {
          fs.rmSync(sessionDir, { recursive: true, force: true });
          await bot.sendMessage(chatId, '🔓 Ta session WhatsApp a été supprimée. Utilise `/pair` pour te reconnecter.', { parse_mode: 'Markdown' });
        } else {
          await bot.sendMessage(chatId, 'ℹ️ Aucune session WhatsApp trouvée pour ce compte.', { parse_mode: 'Markdown' });
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

module.exports = { handleMessage, mainKeyboard };