const express = require("express");
const knex = require("../dbconnection");
const moment = require('moment')
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get('/resume/:job_id', async (req, res) => {
  const jobId = req.params.job_id
  const applicants = await knex('job_application.applicant_details')
  console.log(applicants[0].date_of_birth);
  const dob = applicants[0].date_of_birth;
  const date = moment(dob).format('L')
    console.log("GET",date);
  const jobs = await knex
    .select()
    .from("jobs.job_opening")
    .where("job_id", req.params.job_id);
    res.render("resume", { jobs, jobId, applicants, date });
})

router.post('/resume/:job_id', async (req, res) => {
  const jobId = req.params.job_id
  const { 
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
    preferred_interview_date_1,
    preferred_interview_date_2,
    preferred_interview_date_3
  } = req.body;
  const found = await knex("job_application.applicant_details").where("job_id", jobId);
  if(found != 0){
    const date = moment(date_of_birth).format('MM DD YYYY')
      console.log("POSTING",date);
    knex("job_application.applicant_details")
    .update({
      first_name,
      middle_name,
      last_name,
      gender,
      date_of_birth: date,
      email,
      skype,
      mobile,
      preferred_contact,
      address,
      city,
      province,
      preferred_interview_date_1,
      preferred_interview_date_2,
      preferred_interview_date_3 
    })
    .where('job_id', jobId)
    .then(() => {
      res.redirect(`/resume/${jobId}`)
    })
  } else {
    knex("job_application.applicant_details")
      .insert({
        job_id: jobId,
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
        preferred_interview_date_1,
        preferred_interview_date_2,
        preferred_interview_date_3 
      })
      .where('job_id', jobId)
      .then((result) => {
        res.redirect(`/resume/${jobId}`)
      });
  }
})

module.exports = router