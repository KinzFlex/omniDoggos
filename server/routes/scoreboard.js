var express = require("express");
var router = express.Router();
var dbConnector = require("../db/db-connector");

// Returns scoreboard
router.get("/all", (req, res) => {
  const sSortBy = req.query.sortBy ? req.query.sortBy : "score";
  dbConnector.getScoreboard(sSortBy).then(
    (response) => {
      res.json(response);
    },
    (error) => {
      console.error(error);
      res.status(error.code).send(error.msg);
    }
  );
});

router.get("/myRank/:addr", (req, res) => {
  const addr = req.params.addr;
  dbConnector.getMyScoreAndCalculateRank(addr).then(
    (response) => {
      res.json(response);
    },
    (error) => {
      console.error(error);
      res.status(error.code).send(error.msg);
    }
  );
});

module.exports = router;
