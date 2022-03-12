const express = require("express");
const knex = require("../dbconnection");
const router = express.Router();

// careers page
router.get("/careers", (req, res) => {
  knex("jobs.job_details")
    .select()
    .then((results) => {
      res.render("careers", { job_details: results });
    });
});

module.exports = router;
