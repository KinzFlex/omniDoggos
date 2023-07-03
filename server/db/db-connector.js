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
  getAll() {
    return new Promise((resolve, reject) => {
      client
        .query('SELECT * FROM "SCOREBOARD_TABLE" ORDER BY "score" desc')
        .then((results) => {
          resolve(results.rows);
        });
    });
  },
  /**
   * Fetch score of current holder from db and add new score and save it
   */
  addScoreToHolder(sAddressOfHolder, iNewScoreToAdd) {
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
  },
};
