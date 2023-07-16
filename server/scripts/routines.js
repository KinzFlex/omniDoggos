require("dotenv").config();
var dbConnector = require("../db/db-connector");

module.exports = {
  async calculateScoreChange() {
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
};
