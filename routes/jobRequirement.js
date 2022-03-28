const express = require('express');
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
router.get('/job-requirement', async (req, res) => {
  const adminSkill = await knex('admin.skill');
  const dept = await knex('admin.department');
  const jobType = await knex('admin.job_type');
  const job = await knex('jobs.job_opening');
  const hrAssessment = await knex('admin.remarks');
  const jobQuestion = await knex('jobs.question');
  const question = await knex('question.question');
  const jobPosition = await knex('admin.job_position');
  const positionLevel = await knex('admin.position_level');
  const unique = uniqueId(job);
  res.render('jobRequirement', {
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
  });
});

// job-requirement post route
router.post('/job-requirement', async (req, res) => {
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
  } = req.body;
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
    })
    .then(() => {
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
      }
      res.redirect(`/job-requirement/${jobId}`);
    });
});

module.exports = router;
