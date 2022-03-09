const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// job-requirement get route
router.get("/job-requirement", async (req, res) => {
  const adminSkill = await knex("admin.skill");
  const dept = await knex("admin.department");
  const jobType = await knex("admin.job_type");
  const job = await knex("jobs.job_opening");
  const hrAssessment = await knex("admin.remarks");
  const jobQuestion = await knex("jobs.question");
  const question = await knex("question.question");
  const unique = uniqueId(job);
  res.render("jobRequirement", {
    adminSkill,
    dept,
    jobType,
    job,
    unique,
    hrAssessment,
    question,
    jobQuestion,
  });
});

// job-requirement post route
router.post("/job-requirement", async (req, res) => {
  const {
    jobId,
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
  } = req.body;
  knex("jobs.job_opening")
    .insert({
      job_id: jobId,
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
    .then(() => {
      knex("jobs.skill")
        .insert({
          job_id: jobId,
          skill_id_1,
          skill_level_1,
          skill_id_2,
          skill_level_2,
        })
        .then(() => {
          res.redirect(`/job-requirement/${jobId}`);
        });
    });
});

module.exports = router;
