const TelegramBot = require('node-telegram-bot-api');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { handleMessage } = require('./main');
const wa = require('./libs/wa');

const logger = {
  info: (m) => console.log(chalk.blue('[INFO]'), m),
  success: (m) => console.log(chalk.green('[SUCCESS]'), m),
  error: (m) => console.log(chalk.red('[ERROR]'), m),
  warn: (m) => console.log(chalk.yellow('[WARN]'), m)
};

if (!config.telegram.token) {
  logger.error('❌ Token Telegram manquant dans .env');
  process.exit(1);
}

['./sessions', './database', './commands'].forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

// Chargeur automatique des commandes WhatsApp
global.whatsappCommands = new Map();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const cmdName = file.replace('.js', '');
    try {
      const cmd = require(path.join(commandsPath, file));
      if (typeof cmd.execute === 'function') {
        global.whatsappCommands.set(cmdName, cmd);
        logger.info(`📁 Commande WhatsApp chargée : .${cmdName}`);
      } else {
        logger.warn(`⚠️ ${file} : pas de fonction execute()`);
      }
    } catch (err) {
      logger.error(`❌ Erreur chargement ${file} : ${err.message}`);
    }
  }
} else {
  logger.warn('Dossier commands/ introuvable – créez‑le pour ajouter des commandes WhatsApp');
}

console.log(chalk.cyan('\n╔══════════════════════╗'));
console.log(chalk.cyan('║  ') + chalk.white.bold('𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇') + chalk.cyan('    ║'));
console.log(chalk.cyan('║  ') + chalk.gray(`v${config.version}`) + chalk.cyan('              ║'));
console.log(chalk.cyan('╚══════════════════════╝\n'));

const bot = new TelegramBot(config.telegram.token, { polling: true });
logger.success('Bot Telegram actif');

bot.on('message', (msg) => handleMessage(bot, msg));
bot.on('callback_query', (query) => handleMessage(bot, query));
bot.on('polling_error', (err) => logger.error(`Polling error: ${err.message}`));

process.on('SIGINT', () => {
  logger.warn('Arrêt du bot');
  process.exit(0);
});
process.on('uncaughtException', (err) => {
  logger.error(`Exception non capturée : ${err.message}`);
});

logger.info('✅ Bot prêt ! Utilisez /start sur Telegram');