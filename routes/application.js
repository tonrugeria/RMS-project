const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get('/application', async (req, res) => {
  const applicants = await knex('job_application.applicant_details')
  const job_opening = await knex('jobs.job_opening');
  const jobPosition = await knex('admin.job_position')
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const applicantSkill = await knex('admin.skill')
    .innerJoin('job_application.applicant_rating', 'job_application.applicant_rating.skill_id', 'admin.skill.skill_id')
    console.log(applicantSkill);
  res.render('application', { job_opening, jobPosition, jobSkill, applicants, applicantSkill })
})

module.exports = router;