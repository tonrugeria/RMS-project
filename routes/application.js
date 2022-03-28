const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get('/application', async (req, res) => {
  const job_opening = await knex('jobs.job_opening');
  const jobPosition = await knex('admin.job_position')
  const jobSkill = await knex('jobs.job_opening')
        .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
        .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  res.render('application', { job_opening, jobPosition, jobSkill })
})

module.exports = router;