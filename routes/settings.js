const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// settings
router.get("/settings", (req, res) => {
  res.render("settings");
});

module.exports = router;
