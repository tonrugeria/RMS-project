const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

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
});

// job-requirement update post route
router.post("/job-requirement/:job_id", async (req, res) => {
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
    skill_id_1,
    skill_level_1,
    skill_id_2,
    skill_level_2,
    skill_id_3,
    skill_level_3,
    skill_id_4,
    skill_level_4,
    skill_id_5,
    skill_level_5,
    skill_id_6,
    skill_level_6,
    skill_id_7,
    skill_level_7,
    skill_id_8,
    skill_level_8,
    skill_id_9,
    skill_level_9,
    skill_id_10,
    skill_level_10,
    skill_id_11,
    skill_level_11,
    skill_id_12,
    skill_level_12,
    skill_id_13,
    skill_level_13,
    skill_id_14,
    skill_level_14,
    skill_id_15,
    skill_level_15,
    skill_id_16,
    skill_level_16,
    skill_id_17,
    skill_level_17,
    skill_id_18,
    skill_level_18,
    skill_id_19,
    skill_level_19,
    skill_id_20,
    skill_level_20,
  } = req.body;
  knex("jobs.job_opening")
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
    .where("job_id", jobId)
    .then(() => {
      knex("jobs.skill")
        .update({
          skill_id_1,
          skill_level_1,
          skill_id_2,
          skill_level_2,
          skill_id_3,
          skill_level_3,
          skill_id_4,
          skill_level_4,
          skill_id_5,
          skill_level_5,
          skill_id_6,
          skill_level_6,
          skill_id_7,
          skill_level_7,
          skill_id_8,
          skill_level_8,
          skill_id_9,
          skill_level_9,
          skill_id_10,
          skill_level_10,
          skill_id_11,
          skill_level_11,
          skill_id_12,
          skill_level_12,
          skill_id_13,
          skill_level_13,
          skill_id_14,
          skill_level_14,
          skill_id_15,
          skill_level_15,
          skill_id_16,
          skill_level_16,
          skill_id_17,
          skill_level_17,
          skill_id_18,
          skill_level_18,
          skill_id_19,
          skill_level_19,
          skill_id_20,
          skill_level_20,
        })
        .where("job_id", jobId)
        .then(() => {
          res.redirect(`/job-requirement/${jobId}`);
        });
    });
});

module.exports = router;
