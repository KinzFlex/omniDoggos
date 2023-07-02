var express = require("express");
var router = express.Router();
var dbConnector = require("../db/db-connector");

// Returns scoreboard
router.get("/all", (req, res) => {
  dbConnector.getAll().then((response) => {
    res.json(response);
  });
});

module.exports = router;
