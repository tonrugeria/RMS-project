const express = require("express");
const knex = require("../dbconnection");
const moment = require('moment')
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

function uniqueId(appIdColumn) {
  const arrayOfIds = appIdColumn.map( app => app.application_id);
  if (appIdColumn != 0) {
          return Math.max(...arrayOfIds) + 1;
  }
  return 1;
}

router.get('/resume/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id
  const applicantDetails = await knex('job_application.applicant_details')
  const unique = uniqueId(applicantDetails)
  const jobs = await knex
    .select()
    .from("jobs.job_opening")
    .where("job_id",jobId);
  const admin = await knex('admin.skill')
  res.render('resume', { jobId, jobs, admin, unique })
})

router.post('/resume/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id
  const {
    appId,
    first_name, 
    middle_name, 
    last_name, 
    gender,
    date_of_birth,
    email,
    skype,
    mobile,
    preferred_contact,
    address,
    city,
    province,
    expected_salary,
    start_date,
    preferred_interview_date_1,
    preferred_interview_date_2,
    preferred_interview_date_3,
    skill_id,
    skill_years,
    skill_self_rating,
  } = req.body
  console.log(skill_id, skill_years, skill_self_rating);
  knex('job_application.applicant_details')
    .insert({
      job_id: jobId,
      application_id: appId,
      first_name,
      middle_name, 
      last_name, 
      gender,
      date_of_birth,
      email,
      skype,
      mobile,
      preferred_contact,
      address,
      city,
      province,
      expected_salary,
      start_date,
      preferred_interview_date_1,
      preferred_interview_date_2,
      preferred_interview_date_3, 
    })
    .where('job_id', jobId)
    .then(() => {
      for ( let i = 0; i < skill_id.length; i++) {
        knex('job_application.applicant_rating')
          .insert({
            application_id: appId,
            skill_id: skill_id[i],
            skill_years: skill_years[i],
            skill_self_rating: skill_self_rating[i]
          })
          .where('application_id', appId)
          .then(result => {console.log(result);})
      }
          res.redirect(`/resume/job/${jobId}/application/${appId}`)
    })
})

module.exports = router