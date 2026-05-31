});

// ========== CHARGEUR AUTOMATIQUE DES COMMANDES (dossier commands/) ==========
global.whatsappCommands = new Map();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const cmdName = file.replace('.js', '');
    const cmd = require(path.join(commandsPath, file));
    if (typeof cmd.execute === 'function') {
      global.whatsappCommands.set(cmdName, cmd);
      logger.info(`📁 Commande chargée : .${cmdName}`);
    } else {
      logger.warn(`⚠️ ${file} n'exporte pas de fonction execute().`);
    }
  }
} else {
  logger.warn('Dossier commands/ non trouvé. Créez-le pour ajouter des commandes WhatsApp.');
}

// Bannière
console.log(chalk.cyan('\n╔══════════════════════╗'));
console.log(chalk.cyan('║  ') + chalk.white.bold('𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇') + chalk.cyan('    ║'));
console.log(chalk.cyan('║  ') + chalk.gray(`v${config.version}`) + chalk.cyan('              ║'));
console.log(chalk.cyan('╚══════════════════════╝\n'));

const bot = new TelegramBot(config.telegram.token, { polling: true });
logger.success('Bot Telegram actif');

bot.on('message', (msg) => handleMessage(bot, msg));
bot.on('callback_query', (query) => handleMessage(bot, query));
bot.on('polling_error', (err) => logger.error(`Polling error: ${err.message}`));

process.on('SIGINT', () => { logger.warn('Arrêt du bot'); process.exit(0); });
process.on('uncaughtException', (err) => logger.error(`Uncaught: ${err.message}`));

logger.info('✅ Bot prêt ! Utilisez /start sur Telegram');