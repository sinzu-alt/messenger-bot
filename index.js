const fs = require("fs");
const login = require("fca-unstable");

global.client = {
  commands: new Map()
};

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.config && command.config.name) {
    global.client.commands.set(command.config.name, command);
    console.log(`[LOADED] Command: ${command.config.name}`);
  }
}

if (!fs.existsSync("appstate.json")) {
  console.error("❌ Error: Walang nakitang 'appstate.json'. Ilagay ang iyong Facebook appstate cookies sa root folder.");
  process.exit(1);
}

login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
  if (err) {
    console.error("❌ Login Failed:", err);
    return;
  }

  console.log("🚀 Sinzu Messenger Bot is successfully logged in and running!");
  api.setOptions({ listenEvents: true, selfListen: false });

  const listener = api.listenMqtt((err, event) => {
    if (err) return console.error("Listen Error:", err);

    if (event.type === "message" || event.type === "message_reply") {
      const messageBody = event.body ? event.body.trim() : "";
      const prefix = ".";

      if (!messageBody.startsWith(prefix)) return;

      const args = messageBody.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = global.client.commands.get(commandName);
      if (!command) return;

      try {
        command.run({ api, event, args });
      } catch (error) {
        console.error(`Error executing ${commandName}:`, error);
        api.sendMessage("⚠️ Nagkaroon ng error habang pinapatakbo ang command na ito.", event.threadID, event.messageID);
      }
    }
  });
});
