var express = require("express");
var router = express.Router();

// Define the home page route
router.get("/", function (req, res) {
  //res.send("home page");
  router.use();
});

// Define the about route
router.get("/about", function (req, res) {
  res.send("About us");
});

module.exports = router;
