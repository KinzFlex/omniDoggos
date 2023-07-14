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
  getScoreboard() {
    return new Promise((resolve, reject) => {
      client
        .query(
          'SELECT "addr", "score", "rankChange" FROM "SCORE_TABLE" ORDER BY "score" desc'
        )
        .then(
          (results) => {
            resolve(results.rows);
          },
          (error) => {
            reject({ msg: error, code: 500 });
          }
        );
    });
  },

  getMyScoreAndCalculateRank(addr) {
    return new Promise((resolve, reject) => {
      this.getScoreboard().then(
        (scores) => {
          try {
            const index = scores.findIndex((score) => score.addr === addr);
            if (index === -1) {
              reject({ msg: "Address not found", code: 404 });
              return;
            }
            const myScore = scores[index];
            myScore.rank = index + 1;
            resolve(myScore);
          } catch (error) {
            reject({ msg: error, code: 500 });
          }
        },
        (error) => {
          reject({ msg: error, code: 500 });
        }
      );
    });
  },

  /**
   * Fetch score of current holder from db and add new score and save it
   */
  /*   addScoreToHolder(sAddressOfHolder, iNewScoreToAdd) {
    client.query('UPDATE "SCOREBOARD_TABLE" SET "active"=FALSE').then(() => {
      client
        .query('SELECT * FROM "SCOREBOARD_TABLE" WHERE "address" = $1', [
          sAddressOfHolder,
        ])
        .then((results) => {
          switch (results.rows.length) {
            case 0: // Insert
              client.query(
                'INSERT INTO "SCOREBOARD_TABLE"("address","score") VALUES($1,$2)',
                [sAddressOfHolder, iNewScoreToAdd]
              );
              break;

            case 1: // Update
              const iOldScore = results.rows[0].score;
              iNewScoreToAdd += iOldScore;
              client.query(
                'UPDATE "SCOREBOARD_TABLE" SET "score"=$2,"active"=TRUE WHERE "address"=$1',
                [sAddressOfHolder, iNewScoreToAdd]
              );
              break;
          }
        });
    });
  }, */
};
