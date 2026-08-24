const fs = require("fs-extra");
const path = "./commands/economy.json";

if (!fs.existsSync(path)) {
  fs.writeJsonSync(path, {}, { spaces: 2 });
}

module.exports = {
  config: {
    name: "economy",
    version: "1.0.0",
    author: "Sinzu Advanced",
    countDown: 3,
    role: 0,
    shortDescription: "Sistema ng pera at wallet sa bot",
    longDescription: "Tingnan ang iyong balanse o magtrabaho para kumita ng virtual credits sa bot.",
    category: "Economy",
    guide: "{pn}economy [bal / work]"
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const db = fs.readJsonSync(path);

    const action = args[0] ? args[0].toLowerCase() : "bal";

    if (!db[senderID]) {
      db[senderID] = { wallet: 100, bank: 0 };
    }

    if (action === "bal" || action === "balance") {
      const userWallet = db[senderID].wallet;
      const userBank = db[senderID].bank;
      
      let msg = `💰 === [ SINZU WALLET ] === 💰\n\n`;
      msg += `👤 **ID:** ${senderID}\n`;
      msg += `💵 **Wallet:** ${userWallet.toLocaleString()} Credits\n`;
      msg += `🏦 **Bank:** ${userBank.toLocaleString()} Credits\n\n`;
      msg += `💡 *Gamitin ang \`.economy work\` para kumita ng pera!*`;

      return api.sendMessage(msg, threadID, messageID);
    } 
    
    else if (action === "work") {
      const earned = Math.floor(Math.random() * 250) + 50;
      db[senderID].wallet += earned;
      fs.writeJsonSync(path, db, { spaces: 2 });

      return api.sendMessage(
        `💼 | Nagtrabaho ka nang masipag at kumita ka ng **${earned} Credits**! 🎉\nI-type ang \`.economy bal\` para makita ang iyong total na pera.`,
        threadID,
        messageID
      );
    } 
    
    else {
      return api.sendMessage(
        "⚠️ | Maling gamit ng economy command!\n\n📌 **Mga Pwede mong i-type:**\n- `.economy bal` (Para makita ang balanse)\n- `.economy work` (Para magtrabaho at kumita)",
        threadID,
        messageID
      );
    }
  }
};
