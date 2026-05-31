*┏━━〔 ⚙️ 𝐎𝐖𝐍𝐄𝐑 〕*
┃ ❍ .ᴀɴᴛɪʟɪɴᴋ (via .group antilink)
┃ ❍ .ʀᴇsᴇᴛᴡᴀʀɴs
┃ ❍ .ᴄʜᴇᴄᴋᴡᴀʀɴs
┗━━━━━━━━━━━━┛

> *Généré par 𝐃𝐄𝐕 𝐒𝐇𝐀𝐃𝐎𝐖 𝐓𝐄𝐂𝐇* ✨
`;

    // Utilisation de l'image depuis l'URL fournie
    const imageUrl = 'https://files.catbox.moe/81cwte.jpeg';
    try {
      await wa.sendMessage(userId, from, {
        image: { url: imageUrl },
        caption: helpMessage
      });
    } catch (err) {
      console.error('Erreur envoi image menu:', err);
      await wa.sendMessage(userId, from, { text: helpMessage });
    }
  }
};