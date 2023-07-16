require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: "localhost",
  database: process.env.DB_NAME || "DOGGOS_DB",
  password: process.env.DB_PW,
  port: 5432,
});
client.connect();

module.exports = {
  /**
   * Retrieves the scoreboard from the database.
   *
   * @return {Promise<Array>} An array of objects representing the scoreboard
   * with properties "addr" (address), "score", and "rankChange".
   */
  async getScoreboard(sortBy) {
    try {
      const results = await client.query(
        `SELECT "addr", "score", "rankChange" FROM "SCORE_TABLE" ORDER BY "${sortBy}" desc`
      );
      return results.rows;
    } catch (error) {
      throw { msg: error, code: 500 };
    }
  },

  /**
   * Retrieves the score of a player at a given address and calculates their rank.
   *
   * @param {string} addr - The address of the player.
   * @return {Promise} A promise that resolves with an object containing the player's score and rank.
   */
  async getMyScoreAndCalculateRank(addr) {
    try {
      const scores = await this.getScoreboard();
      const index = scores.findIndex((score) => score.addr === addr);
      if (index === -1) {
        throw { message: "Address not found", code: 404 };
      }
      const myScore = scores[index];
      myScore.rank = index + 1;
      return myScore;
    } catch (error) {
      throw {
        msg: error.message,
        code: error.code ? error.code : 500,
      };
    }
  },
};
