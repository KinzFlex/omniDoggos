const express = require("express");
const cron = require("node-cron");
const app = express();
const PORT = 3000;
const CONTRACT = require("./scripts/contract-connector");

app.use(function timeLog(req, res, next) {
  console.log(
    `${req.method}: '${req.url}' @ ${new Date().toLocaleString()} (${
      new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]
    })`
  );
  next();
});

app.use(express.static("public"));

app.use("/api/scoreboard", require("./routes/scoreboard"));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
//cron.schedule("* * * * *", () => {
// For quicker testing
cron.schedule("0 4 * * *", () => {
  // 4 uhr nachts
  console.log(
    `Fetching new scoreboard data at ${new Date().toLocaleTimeString()}`
  );
  CONTRACT.fetchHoldersFromContract();
});
