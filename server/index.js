const express = require("express");
const cron = require("node-cron");
const app = express();
const PORT = 3001;
const CONTRACT = require("./scripts/contract-connector");
const routines = require("./scripts/routines");

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

// TEST

routines.calculateNewBonusScore();

cron.schedule("0 4 * * *", () => {
  console.log(
    `Executing calculateNewBonusScore() at ${new Date().toLocaleTimeString()}`
  );
  try {
    routines.calculateNewBonusScore();
  } catch (error) {
    console.error(error);
  }
  //TODO check and update new Scores before further execution
  console.log(
    `Executing calculateRankChange() at ${new Date().toLocaleTimeString()}`
  );
  try {
    routines.calculateRankChange();
  } catch (error) {
    console.error(error);
  }
});
