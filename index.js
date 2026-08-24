const fs = require("fs");
const login = require("ws3-fca");

// Siguraduhing mayroon kang appstate.json file para sa login credentials mo
if (!fs.existsSync("appstate.json")) {
  console.error("Error: Walang makitang appstate.json file!");
  process.exit(1);
}

login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
  if (err) {
    console.error("Login Error:", err);
    return;
  }

  console.log("Tagumpay na naka-login ang bot gamit ang ws3-fca!");

  // Itakda ang bot options kung kinakailangan
  api.setOptions({
    listenEvents: true,
    selfListen: false,
    updatePresence: true,
    forceLogin: true
  });

  // Makinig sa mga mensahe at pangyayari sa chat
  const listener = api.listenListener((err, event) => {
    if (err) return console.error("Listener Error:", err);

    switch (event.type) {
      case "message":
        console.log(`May natanggap na mensahe mula kay ${event.senderID}: ${event.body}`);
        
        // Halimbawa ng simpleng reply command
        if (event.body === "!ping") {
          api.sendMessage("Pong! Aktibo ang bot.", event.threadID, event.messageID);
        }
        break;

      default:
        break;
    }
  });
});
