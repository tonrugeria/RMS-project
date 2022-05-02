const express = require('express');
const knex = require('../dbconnection');

const router = express.Router();
const moment = require('moment');
// careers page
router.get('/careers/job/:job_id', async (req, res) => {
  const active_job_opening = await knex('jobs.job_opening')
    .leftJoin('admin.department', 'jobs.job_opening.job_dept', 'admin.department.dept_id')
    .orderBy('job_id')
    .where({
      dept_status: 'active',
      status: '0',
    });
  const jobId = req.params.job_id;
  const jobOpening = await knex('jobs.job_opening')
    .leftJoin('admin.department', 'jobs.job_opening.job_dept', 'admin.department.dept_id')
    .where({
      dept_status: 'active',
      status: '0',
      job_id: jobId,
    });
  const jobDetail = await knex('jobs.job_details').where('job_id', jobId);
  const { date_opened } = jobOpening[0] || {};
  const date = moment(date_opened).format('DD MMMM YYYY');
  const responsibility = await knex('jobs.responsibility').where('job_id', jobId);
  const qualification = await knex('jobs.qualification').where('job_id', jobId);
  const category = await knex('jobs.category').where('job_id', jobId);
  const item = await knex('jobs.item').where('job_id', jobId);
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');

  const { status } = jobOpening[0] || {};

  if (status == 0) {
    res.render('careerDetails', {
      jobId,
      jobDetail,
      jobOpening,
      responsibility,
      qualification,
      jobSkill,
      category,
      item,
      active_job_opening,
      date,
      status,
    });
  } else {
    res
      .status(404)
      .send(
        '<p>Job is closed. Click <a href="/careers">here</a> to see the active jobs.</p>'
      );
  }
});

module.exports = router;
