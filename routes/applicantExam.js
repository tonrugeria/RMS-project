const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.get('/careers/job/:job_id/exam/application/:application_id', async (req, res) => {
  const jobId = req.params.job_id;
  const appId = req.params.application_id;
  const jobQuestion = await knex('jobs.question')
    .innerJoin(
      'question.question',
      'jobs.question.question_id',
      'question.question.question_id'
    )
    .where({ job_id: jobId });
  res.render('applicantExam', { jobId, appId, jobQuestion });
});

router.post('/careers/job/:job_id/resume', async (req, res) => {
  const jobId = req.params.job_id;
});

module.exports = router;
