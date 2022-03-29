const express = require("express");
const knex = require("../dbconnection");
const router = express.Router();
const moment = require("moment");
// careers page
router.get("/careers/job/:job_id", async (req, res) => {
  const active_job_opening = await knex("jobs.job_opening")
  .where('status','0');
  const jobId = req.params.job_id
  const jobDetail = await knex("jobs.job_details")
    .where('job_id', jobId)
    const {date_opened} = active_job_opening[0]|| {};
    const date = moment(date_opened).format("DD MMMM YYYY")
  const job_opening = await knex('jobs.job_opening');
  const jobOpening = await knex('jobs.job_opening')
    .where('job_id', jobId)
  const responsibility = await knex('jobs.responsibility')
  .where('job_id', jobId)
  const qualification = await knex('jobs.qualification')
  .where('job_id', jobId)
  const category = await knex ('jobs.category')
  .where('job_id', jobId)
  const item = await knex ('jobs.item')
  .where('job_id', jobId)
  const admin_department = await knex('admin.department');
  const jobSkill = await knex('jobs.job_opening')
        .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
        .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
      
  res.render("careerDetails", {jobId, jobDetail, job_opening, jobOpening, responsibility, qualification, admin_department, jobSkill,category,item,active_job_opening, date });
});

module.exports = router;
