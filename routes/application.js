const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get('/application/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id
  const applicants = await knex('job_application.applicant_details')
    .where('job_id', jobId)
  const jobOpening = await knex('jobs.job_opening');
  const jobOpeningId = await knex('jobs.job_opening')
    .innerJoin('job_application.applicant_details', 'job_application.applicant_details.job_id', 'jobs.job_opening.job_id')
  const jobPosition = await knex('admin.job_position')
  const adminSkill = await knex('admin.skill')
  const skillScore = await knex('job_application.technical_score')
    .innerJoin('job_application.applicant_details', 'job_application.applicant_details.application_id', 'job_application.technical_score.application_id')
    .where('job_id', jobId)
    console.log("skill-score",skillScore);
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const applicantSkill = await knex('admin.skill')
    .innerJoin('job_application.applicant_rating', 'job_application.applicant_rating.skill_id', 'admin.skill.skill_id')
  res.render('application', { jobOpening, jobPosition, jobSkill, applicants, applicantSkill, adminSkill, jobId, jobOpeningId, skillScore })
})

router.get('/')
module.exports = router;