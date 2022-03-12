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
  const role = await knex
            .select('')
            .insert({
              skill_1,
              skill_2,
              skill_3,
              skill_4,
              skill_5,
              skill_6,
              skill_7,
              skill_8,
              skill_9,
              skill_10

         
            .innerJoin('admin.skill.skill_id', 'jobs.job_opening.job_id');

  res.render("careersmain", { job_opening, job_description, admin.skill });
});

module.exports = router;
