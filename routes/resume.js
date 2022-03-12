const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get('/resume', (req, res) => {
  res.render('resume')
})

module.exports = router