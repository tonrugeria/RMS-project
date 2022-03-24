const express = require("express");
const knex = require("../dbconnection");
const router = express.Router();

// careers page
router.get("/careers/job/:job_id", async (req, res) => {
  const jobId = req.params.job_id
  const jobDetail = await knex("jobs.job_details")
    .where('job_id', jobId)
  const job_opening = await knex('jobs.job_opening');
  const jobOpening = await knex('jobs.job_opening')
    .where('job_id', jobId)
  const responsibility = await knex('jobs.responsibility')
  .where('job_id', jobId)
  const qualification = await knex('jobs.qualification')
  .where('job_id', jobId)
  const admin_department = await knex('admin.department');
  const jobSkill = await knex('jobs.job_opening')
        .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
        .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  res.render("careerDetails", {jobId, jobDetail, job_opening, jobOpening, responsibility, qualification, admin_department, jobSkill });
});

module.exports = router;
