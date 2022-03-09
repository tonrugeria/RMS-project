const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// careers main page
router.get("/careersmain", async (req, res) => {
  const job_opening = await knex("jobs.job_opening").select();
  const job_description = await knex("jobs.job_description").select();
  res.render("careersmain", { job_opening, job_description });
});

module.exports = router;
