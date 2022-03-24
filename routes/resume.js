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

router.get('/careers/job/:job_id/resume', async (req, res) => {
  const jobId = req.params.job_id
  const applicantDetails = await knex('job_application.applicant_details')
  const unique = uniqueId(applicantDetails)
  const jobs = await knex("jobs.job_opening").where("job_id",jobId);
  const skill = await knex('admin.skill')
    .innerJoin('jobs.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id')
    .where('job_id', jobId)

  res.render('resume', { jobId, jobs, skill, unique, })
})

router.post('/careers/job/:job_id/resume', async (req, res) => {
  const jobId = req.params.job_id
  let {
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
    capability_1,
    capability_2,
    capability_3,
    capability_4,
    capability_5,
    year_experience,
    history_start_date_1,
    history_end_date_1,
    position_1,
    company_1,
    history_start_date_2,
    history_end_date_2,
    position_2,
    company_2,
    history_start_date_3,
    history_end_date_3,
    position_3,
    company_3,
    history_start_date_4,
    history_end_date_4,
    position_4,
    company_4,
    history_start_date_5,
    history_end_date_5,
    position_5,
    company_5,
    school_1,
    course_1,
    date_graduated_1,
    school_2,
    course_2,
    date_graduated_2,
    school_3,
    course_3,
    date_graduated_3,
    school_4,
    course_4,
    date_graduated_4,
    school_5,
    course_5,
    date_graduated_5,
  } = req.body
  
  const startDate1 = moment(history_start_date_1, 'MM/DD/YYYY')
  const endDate1 = moment(history_end_date_1, 'MM/DD/YYYY')
  const startDate2 = moment(history_start_date_2, 'MM/DD/YYYY')
  const endDate2 = moment(history_end_date_2, 'MM/DD/YYYY')
  const startDate3 = moment(history_start_date_3, 'MM/DD/YYYY')
  const endDate3 = moment(history_end_date_3, 'MM/DD/YYYY')
  const startDate4 = moment(history_start_date_4, 'MM/DD/YYYY')
  const endDate4 = moment(history_end_date_4, 'MM/DD/YYYY')
  const startDate5 = moment(history_start_date_5, 'MM/DD/YYYY')
  const endDate5 = moment(history_end_date_5, 'MM/DD/YYYY')

  let yearDiff1 = endDate1.diff(startDate1, 'years');
  let yearDiff2 = endDate2.diff(startDate2, 'years');
  let yearDiff3 = endDate3.diff(startDate3, 'years');
  let yearDiff4 = endDate4.diff(startDate4, 'years');
  let yearDiff5 = endDate5.diff(startDate5, 'years');

  if(isNaN(yearDiff1)){
    yearDiff1 = 0
  } 
  if(isNaN(yearDiff2)) {
    yearDiff2 = 0
  } 
  if (isNaN(yearDiff3)){
    yearDiff3 = 0
  }
  if(isNaN(yearDiff4)) {
    yearDiff4 = 0
  } 
  if (isNaN(yearDiff5)){
    yearDiff5 = 0
  }
  const totalYears = yearDiff1 + yearDiff2 + yearDiff3 + yearDiff4 + yearDiff5

  const today = new Date()
  const thisDay = moment(today, 'MM/DD/YYYY')
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
      year_experience: totalYears,
      date_applied: thisDay,
      date_last_updated: thisDay 
    })
    .then(() => {
        knex('job_application.capabilities')
          .insert({
            application_id: appId,
            capability_1,
            capability_2,
            capability_3,
            capability_4,
            capability_5,
          })
          .then( async ()=> {
            if(
              history_start_date_1 == "" && history_end_date_1 == "" &&
              history_start_date_2 == "" && history_end_date_2 == "" &&
              history_start_date_3 == "" && history_end_date_3 == "" &&
              history_start_date_4 == "" && history_end_date_4 == "" &&
              history_start_date_5 == "" && history_end_date_5 == ""
            ) {
              history_start_date_1 = null
              history_end_date_1 = null
              history_start_date_2 = null
              history_end_date_2 = null
              history_start_date_3 = null
              history_end_date_3 = null
              history_start_date_4 = null
              history_end_date_4 = null
              history_start_date_5 = null
              history_end_date_5 = null
            } else if (
              history_start_date_2 == "" && history_end_date_2 == "" &&
              history_start_date_3 == "" && history_end_date_3 == "" &&
              history_start_date_4 == "" && history_end_date_4 == "" &&
              history_start_date_5 == "" && history_end_date_5 == "" 
            ) {
              history_start_date_1 = startDate1
              history_end_date_1 = endDate1
              history_start_date_2 = null
              history_end_date_2 = null
              history_start_date_3 = null
              history_end_date_3 = null
              history_start_date_4 = null
              history_end_date_4 = null
              history_start_date_5 = null
              history_end_date_5 = null
            } else if (
              history_start_date_3 == "" && history_end_date_3 == ""
            ) {
              history_start_date_1 = startDate1
              history_end_date_1 = endDate1
              history_start_date_2 = startDate2
              history_end_date_2 = endDate2
              history_start_date_3 = null
              history_end_date_3 = null
            } else {
                history_start_date_1 = startDate1
                history_end_date_1 = endDate1
                history_start_date_1 = startDate2
                history_end_date_1 = endDate2
                history_start_date_1 = startDate3
                history_end_date_1 = endDate3
            }
            knex('job_application.employment_history')
              .insert({
                application_id: appId,
                history_start_date_1,
                history_end_date_1,
                position_1,
                company_1,
                history_start_date_2,
                history_end_date_2,
                position_2,
                company_2,
                history_start_date_3,
                history_end_date_3,
                position_3,
                company_3,
              })
              .then(async () => {
                const skill = await knex('jobs.skill')
                    .where('job_id', jobId)
                  if(skill != 0){
                    for ( let i = 0; i < skill_id.length; i++) {
                    if(skill_years[i] == '' && skill_self_rating[i] == ''){
                      skill_years[i] = 0
                      skill_self_rating[i] = 0
                        knex('job_application.applicant_rating')
                          .insert({
                            application_id: appId,
                            skill_id: skill_id[i],
                            skill_years: skill_years[i],
                            skill_self_rating: skill_self_rating[i]
                          })
                          .then(result => result)
                      }
                    }
                  }
                res.redirect(`/careers/job/${jobId}/resume/application/${appId}`)
              })

                  
          })
          
    })
    
})
module.exports = router