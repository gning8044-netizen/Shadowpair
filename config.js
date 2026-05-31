const fs = require('fs');

const config = {
  name: '𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇',
  version: '1.0.0',
  telegram: {
    token: '8897352527:AAFsL8WIQ0yfYvf-kZ7HG-TrSYSdlk3xdBw', // ⚠️ À RÉVOQUER !
    ownerId: 7537529476,
  },
  whatsapp: { ready: false },
  paths: { sessions: './sessions', database: './database' }
};

['./sessions', './database'].forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

module.exports = config;