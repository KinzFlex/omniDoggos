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
      const scores = await this.getScoreboard("score");
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

  async updateRankChangeByAddr(addr, rankChange, newScore) {
    try {
      await client.query(
        'UPDATE "SCORE_TABLE" SET "rankChange" = $1, "oldScore" = $3 WHERE "addr" = $2',
        [rankChange, addr, newScore]
      );
    } catch (error) {
      throw { msg: error, code: 500 };
    }
  },

  async updateScoreByAddr(addr, newScore) {
    try {
      await client.query(
        'UPDATE "SCORE_TABLE" SET "score" = $1 WHERE "addr" = $2',
        [newScore, addr]
      );
    } catch (error) {
      throw { msg: error, code: 500 };
    }
  },
  async updateChainCheckByNFT_ID(id, chainName) {
    try {
      await client.query(
        `UPDATE "NFT_TABLE" SET "${chainName}" = TRUE WHERE "id" = $2`,
        [chainName, id]
      );
    } catch (error) {
      throw { msg: error, code: 500 };
    }
  },

  async getScoreAndBonusOfNFTByID(id) {
    try {
      const results = await client.query(
        `SELECT "baseScore","bonus" FROM "NFT_TABLE" WHERE "id" = $2`,
        [id]
      );
      return results.rows[0];
    } catch (error) {
      throw { msg: error, code: 500 };
    }
  },

  async calculateBonusOfNftById(id) {
    try {
      // Retrieve data from the database
      const query = `
      SELECT "chainBSC", "chainETH", "chainARB", "chainOPT", "roundsCompleted"
      FROM "NFT_TABLE"
      WHERE "id" = $1
    `;
      const results = await client.query(query, [id]);

      let { chainBSC, chainETH, chainARB, chainOPT, roundsCompleted } =
        results.rows[0];

      // Calculate the number of checked chains
      let countCheckedChains = [chainBSC, chainETH, chainARB, chainOPT].filter(
        (val) => val === true
      ).length;

      if (chainBSC && chainETH && chainARB && chainOPT) {
        // Increment rounds completed and reset count of checked chains
        roundsCompleted += 1;
        countCheckedChains = 0;

        // Update the database with the new values
        const updateQuery = `
        UPDATE "NFT_TABLE"
        SET "roundsCompleted" = $1,
            "chainBSC" = FALSE,
            "chainETH" = FALSE,
            "chainARB" = FALSE,
            "chainOPT" = FALSE
        WHERE "id" = $2
      `;
        await client.query(updateQuery, [roundsCompleted, id]);
      }

      // Calculate the bonus
      const bonusResults = this.calculateBonus(roundsCompleted);
      let totalBonus =
        bonusResults.totalBonus +
        bonusResults.bonusMultiplier * countCheckedChains;

      // Update the database with the calculated bonus
      await client.query(
        `
        UPDATE "NFT_TABLE"
        SET "bonus" = $1
        WHERE "id" = $2
      `,
        [totalBonus, id]
      );
    } catch (error) {
      // Handle error here
    }
  },

  calculateBonus(roundsCompleted) {
    let totalBonus = 0;
    let bonusMultiplier = 1;

    for (let round = 1; round <= roundsCompleted; round++) {
      bonusMultiplier /= 2;
      totalBonus += bonusMultiplier;
    }

    bonusMultiplier /= 2;
    bonusMultiplier /= 5;

    return { totalBonus, bonusMultiplier };
  },
};
