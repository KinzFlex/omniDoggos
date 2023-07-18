require("dotenv").config();
var dbConnector = require("../db/db-connector");
const ARBITRUM_WORKER = require("./contract-connector");
ARBITRUM_WORKER.initContract(
  process.env.ARBITRUM_URL,
  process.env.ARBITRUM_ADDRESS
);

module.exports = {
  async calculateRankChange() {
    const newScores = await dbConnector.getScoreboard("score");
    const oldScores = await dbConnector.getScoreboard("oldScore");

    for (let i = 0; i < newScores.length; i++) {
      const newScore = newScores[i];
      const oldScoreIndex = oldScores.findIndex(
        (oldScore) => oldScore.addr === newScore.addr
      );
      const rankChange = oldScoreIndex - i;
      try {
        await dbConnector.updateRankChangeByAddr(
          newScore.addr,
          rankChange,
          newScore.score
        );
      } catch (error) {
        console.error(error);
      }
    }
  },

  async calculateNewScore() {
    // fetch allAddrAndNFTIDs from contract
    // check new chain -> rise bonus
    //save new score of addr locally
    // update scoreboard
  },
};
