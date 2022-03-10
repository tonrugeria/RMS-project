const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get("/system-variables", (req, res) => {
  res.render("systemVariables");
});

module.exports = router;
