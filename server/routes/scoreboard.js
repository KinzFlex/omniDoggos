var express = require("express");
var router = express.Router();
var dbConnector = require("../db/db-connector");

// Returns scoreboard
router.get("/all", (req, res) => {
  dbConnector.getScoreboard().then((response) => {
    res.json(response);
  });
});

router.get("/myRank/:addr", (req, res) => {
  const addr = req.params.addr;
  dbConnector.getMyScoreAndCalculateRank(addr).then(
    (response) => {
      res.json(response);
    },
    (error) => {
      console.error(error);
      res.status(404).send(error);
    }
  );
});

module.exports = router;
