const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// exam get all question category route
router.get('/exam/:job_id', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users');
  const userRole = await knex('admin.user_role');
  const jobId = req.params.job_id;
  const jobSkill = await knex('jobs.skill');
  const adminSkill = await knex('admin.skill');
  const adminJobSkill = await knex('admin.skill')
    .leftJoin('jobs.skill', 'admin.skill.skill_id', 'jobs.skill.skill_id')
    .where('job_id', jobId);
  const jobQuestion = await knex('jobs.question').where('job_id', jobId);
  const question = await knex('question.question');
  const question_jobQuestion = await knex('question.question')
    .leftJoin(
      'jobs.question',
      'question.question.question_id',
      'jobs.question.question_id'
    )
    .where('job_id', jobId);
  res.render('exam', {
    jobId,
    adminSkill,
    jobSkill,
    adminJobSkill,
    question,
    jobQuestion,
    question_jobQuestion,
    currentUser,
    currentUserId,
    userRole,
  });
});

// exam post route
router.post('/exam/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const { question_id } = req.body;
  // checks if a checkbox is selected
  if (question_id != null) {
    // checks if req.body.question_id is not an array
    if (typeof question_id != typeof []) {
      knex('jobs.question')
        .where('job_id', jobId)
        .del()
        .then(() =>
          knex('jobs.question')
            .insert({
              job_id: jobId,
              question_id,
            })
            .then(() => res.redirect(`/exam/${jobId}`))
        );
    } else {
      // forEach loop when the req.body is an array
      knex('jobs.question')
        .where('job_id', jobId)
        .del()
        .then((results) => results);
      question_id.forEach(async (question) => {
        knex('jobs.question')
          .insert({
            job_id: jobId,
            question_id: question,
          })
          .then((results) => results);
      });
      res.redirect(`/exam/${jobId}`);
    }
  } else {
    await knex('jobs.question')
      .where('job_id', jobId)
      .del()
      .then(() => {
        res.redirect(`/exam/${jobId}`);
      });
  }
});

module.exports = router;
