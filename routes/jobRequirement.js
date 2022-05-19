const express = require('express');
const moment = require('moment');
const knex = require('../dbconnection');

const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

function uniqueId(jobIdColumn) {
  const arrayOfIds = jobIdColumn.map((job) => job.job_id);
  if (jobIdColumn != 0) {
    return Math.max(...arrayOfIds) + 1;
  }
  return 1;
}

// job-requirement get route
router.get('/job-requirement', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const adminSkill = await knex('admin.skill').where({ skill_status: 'active' });
  const dept = await knex('admin.department').where({ dept_status: 'active' });
  const jobType = await knex('admin.job_type').where({ job_type_status: 'active' });
  const job = await knex('jobs.job_opening');
  const hrAssessment = await knex('admin.remarks');
  const jobQuestion = await knex('jobs.question');
  const question = await knex('question.question');
  const jobPosition = await knex('admin.job_position');
  const positionLevel = await knex('admin.position_level').where({
    position_level_status: 'active',
  });

  const unique = uniqueId(job);
  const branding = await knex('admin.branding');
  res.render('jobRequirement', {
    branding,
    adminSkill,
    dept,
    jobType,
    job,
    unique,
    hrAssessment,
    question,
    jobQuestion,
    jobPosition,
    positionLevel,
    currentUser,
    currentUserId,
    currentUserRole,
  });
});

// job-requirement post route
router.post('/job-requirement', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const {
    jobId,
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
    status,
  } = req.body;

  const today = new Date();
  const thisDay = moment(today, 'MM/DD/YYYY');
  knex('jobs.job_opening')
    .insert({
      job_id: jobId,
      job_title: jobTitle,
      job_dept: department,
      max_salary: salaryRange,
      position_level: careerLevel,
      job_type: workType,
      job_description: jobDesc,
      min_years_experience: yearsOfExp,
      skill_score: skillScore,
      personality_score: personalityScore,
      status,
      created_by: currentUserId,
      last_updated_by: currentUserId,
      last_date_updated: thisDay,
    })
    .then(async () => {
      if (skill_id != null) {
        if (typeof skill_id != typeof []) {
          skill_level.forEach((skill) => {
            knex('jobs.skill')
              .insert({
                job_id: jobId,
                skill_id,
                skill_level: skill,
              })
              .then((results) => results);
          });
        } else {
          for (let i = 0; i < skill_id.length; i++) {
            knex('jobs.skill')
              .insert({
                job_id: jobId,
                skill_id: skill_id[i],
                skill_level: skill_level[i],
              })
              .then((results) => results);
          }
        }
        if (status == 0) {
          await knex('jobs.job_opening')
            .where({ job_id: jobId })
            .update({ date_opened: thisDay });
        }
        res.redirect(`/job-requirement/${jobId}`);
      }
    });
});
module.exports = router;
