const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// job-requirement update get route
router.get('/job-requirement/:job_id', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const jobId = req.params.job_id;
  const adminSkill = await knex('admin.skill');
  const dept = await knex('admin.department');
  const jobType = await knex('admin.job_type');
  const hrRemarks = await knex('admin.remarks');
  const jobSkill = await knex('jobs.skill').where('job_id', jobId);
  const job = await knex('jobs.job_opening').where('job_id', jobId);
  const jobPosition = await knex('admin.job_position');
  const positionLevel = await knex('admin.position_level');
  const unique = jobId;
  const jobQuestion = await knex('jobs.question')
    .innerJoin(
      'question.question',
      'jobs.question.question_id',
      'question.question.question_id'
    )
    .where('job_id', req.params.job_id);
  res.render('editJobRequirement', {
    adminSkill,
    dept,
    jobType,
    job,
    unique,
    jobId,
    hrRemarks,
    jobSkill,
    jobQuestion,
    jobPosition,
    positionLevel,
    currentUser,
    currentUserId,
    currentUserRole,
  });
});

// job-requirement update post route
router.post('/job-requirement/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const {
    jobTitle,
    department,
    salaryRange,
    careerLevel,
    workType,
    jobDesc,
    yearsOfExp,
    skillScore,
    personalityScore,
    skill_id,
    skill_level,
  } = req.body;
  knex('jobs.job_opening')
    .update({
      job_title: jobTitle,
      job_dept: department,
      max_salary: salaryRange,
      position_level: careerLevel,
      job_type: workType,
      job_description: jobDesc,
      min_years_experience: yearsOfExp,
      skill_score: skillScore,
      personality_score: personalityScore,
    })
    .where('job_id', jobId)
    .then(async () => {
      if (skill_id != null) {
        if (typeof skill_id != typeof []) {
          knex('jobs.skill')
            .where({
              job_id: jobId,
            })
            .del()
            .then(() => {
              skill_level.forEach((skill) => {
                knex('jobs.skill')
                  .insert({
                    job_id: jobId,
                    skill_id,
                    skill_level: skill,
                  })
                  .then((results) => results);
              });
              res.redirect(`/job-requirement/${jobId}`);
            });
        } else {
          knex('jobs.skill')
            .where({
              job_id: jobId,
            })
            .del()
            .then((results) => results);
          for (let i = 0; i < skill_id.length; i++) {
            knex('jobs.skill')
              .insert({
                job_id: jobId,
                skill_id: skill_id[i],
                skill_level: skill_level[i],
              })
              .then((results) => results);
          }
          res.redirect(`/job-requirement/${jobId}`);
        }
      } else {
        knex('jobs.skill')
          .where({
            job_id: jobId,
          })
          .del()
          .then(() => {
            knex('jobs.question')
              .where({
                job_id: jobId,
              })
              .del()
              .then(() => {
                res.redirect(`/job-requirement/${jobId}`);
              });
          });
      }
    });
});

// delete exam route
router.post('/delete/job/:job_id/:question_id', (req, res) => {
  const jobId = req.params.job_id;
  knex('jobs.question')
    .where('question_id', req.params.question_id)
    .andWhere('job_id', jobId)
    .del()
    .then((result) => {
      res.redirect(`/job-requirement/${jobId}`);
    });
});

module.exports = router;
