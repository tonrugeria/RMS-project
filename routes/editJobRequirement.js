const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

<<<<<<< HEAD
// delete route
router.post('/delete/:question_id', async (req, res) => {
  const jobId = req.params.job_id;
  knex('question.question_test')
          .where('question_id', req.params.question_id)
          .del()
          .then((result) => {
                  console.log(result);
                  res.redirect(`/job-requirement/${jobId}`);
          });
});

// job-requirement update get route
router.get('/job-requirement/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const adminSkill = await knex('admin.skill');
  const dept = await knex('admin.department');
  const jobType = await knex('admin.job_type');
  const hrRemarks = await knex('admin.remarks');
  const jobSkill = await knex('jobs.skill').where('job_id', jobId);
  const job = await knex('jobs.job_opening').where('job_id', jobId);
  const unique = jobId;
  const testingQuestion = await knex('question.question')
          .innerJoin(
                  'question.question_test',
                  'question.question.question_id',
                  'question.question_test.question_id'
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
          testingQuestion,
  });
=======
// job-requirement update get route
router.get('/job-requirement/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const adminSkill = await knex('admin.skill');
        const dept = await knex('admin.department');
        const jobType = await knex('admin.job_type');
        const hrRemarks = await knex('admin.remarks');
        const jobSkill = await knex('jobs.skill').where('job_id', jobId);
        const job = await knex('jobs.job_opening').where('job_id', jobId);
        const unique = jobId;
        const jobQuestion = await knex('jobs.question')
                .innerJoin('question.question', 'jobs.question.question_id', 'question.question.question_id')
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
        });
>>>>>>> 2ae4375ee883aac31ff41b2e171ac5e301637fe2
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
                examScore,
                hrAssessment,
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
                        exam_score: examScore,
                        hr_rating: hrAssessment,
                })
                .where('job_id', jobId)
                .then(async () => {
                        if (typeof skill_id != typeof []) {
                                const skillColumn = await knex('jobs.skill')
                                        .where('job_id', jobId)
                                        .andWhere('skill_id', skill_id);
                                if (skillColumn != 0) {
                                        knex('jobs.skill')
                                                .update({
                                                        skill_id,
                                                        skill_level,
                                                })
                                                .where('job_id', jobId)
                                                .andWhere('skill_id', skill_id)
                                                .then(() => {
                                                        res.redirect(`/job-requirement/${jobId}`);
                                                });
                                } else {
                                        knex('jobs.skill')
                                                .insert({
                                                        job_id: jobId,
                                                        skill_id,
                                                        skill_level,
                                                })
                                                .then(() => {
                                                        res.redirect(`/job-requirement/${jobId}`);
                                                });
                                }
                        } else {
                                skill_id.forEach(async (skill) => {
                                        const skillColumn = await knex('jobs.skill')
                                                .where('job_id', jobId)
                                                .andWhere('skill_id', skill);
                                        if (skillColumn != 0) {
                                                knex('jobs.skill')
                                                        .update({
                                                                job_id: jobId,
                                                                skill_id: skill,
                                                        })
                                                        .where('job_id', jobId)
                                                        .andWhere('skill_id', skill)
                                                        .then((results) => results);
                                        } else {
                                                knex('jobs.skill')
                                                        .insert({
                                                                job_id: jobId,
                                                                skill_id: skill,
                                                        })
                                                        .then((results) => results);
                                        }
                                });
                                res.redirect(`/job-requirement/${jobId}`);
                        }
                });
});

// delete exam route
router.post('/delete/:job_id/:question_id', (req, res) => {
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
