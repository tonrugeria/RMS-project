const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// careers main page
router.get("/careers", async (req, res) => {
  const job_opening = await knex("jobs.job_opening");
  const admin_department = await knex('admin.department');
  const skill = await knex("jobs.skill");
  const jobSkill = await knex('jobs.job_opening')
        .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
        .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const date = job_opening[0].date_opened;
 const date_opened = moment(date).format("DD MMMM YYYY")
console.log(date_opened);

  res.render("careers", { job_opening, skill,admin_department, date_opened,jobSkill});
});

module.exports = router;
