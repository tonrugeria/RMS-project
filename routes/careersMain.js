const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// careers main page
router.get("/careersmain", async (req, res) => {
  const job_opening = await knex("jobs.job_opening");
  const job_description = await knex("jobs.job_description");
  const skill = await knex("jobs.skill");


  res.render("careersmain", { job_opening, job_description, skill});
});

module.exports = router;
