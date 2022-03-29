const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get('/application', async (req, res) => {
  const jobOpening = await knex('jobs.job_opening')
  const adminSkill = await knex('admin.skill')
  const applicants = await knex('job_application.applicant_details')
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const technicalScore = await knex('job_application.technical_score')
  res.render('application', {
    jobOpening, adminSkill, applicants, technicalScore, jobApplications
  })
})

router.get('/application/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id
  const applicants = await knex('job_application.applicant_details')
    .where('job_id', jobId)
  const jobOpening = await knex('jobs.job_opening');
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const jobOpeningId = await knex('jobs.job_opening')
    .innerJoin('job_application.applicant_details', 'job_application.applicant_details.job_id', 'jobs.job_opening.job_id')
  const jobPosition = await knex('admin.job_position')
  const adminSkill = await knex('admin.skill')
  const technicalScore = await knex('job_application.technical_score')
  const skillScore = await knex('job_application.technical_score')
    .innerJoin('job_application.applicant_details', 'job_application.applicant_details.application_id', 'job_application.technical_score.application_id')
    .where('job_id', jobId)
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const applicantSkill = await knex('admin.skill')
    .innerJoin('job_application.applicant_rating', 'job_application.applicant_rating.skill_id', 'admin.skill.skill_id')
  const applicantInfo = await knex('job_application.applicant_details')
  .where({
    job_id: jobId,
  })

  const {
    date_of_birth
  } = applicantInfo[0] || {}

  const dob = moment(date_of_birth, 'MM/DD/YYYY')
  const age = moment().diff(dob, 'years',false);

  res.render('application', { applicantInfo, jobOpening, jobPosition, jobSkill, applicants, applicantSkill, adminSkill, jobId, jobOpeningId, skillScore, technicalScore, age, jobApplications })
})

router.get('/application/job/:job_id/applicant/:application_id', async (req, res) => {
  const jobId = req.params.job_id
  const appId = req.params.application_id
  let adminSkill = await knex('admin.skill')
  const applicants = await knex('job_application.applicant_details')
    .where('job_id', jobId)
  const applicantDetails = await knex('job_application.applicant_details')
    .leftJoin('job_application.technical_score', 'job_application.technical_score.application_id', 'job_application.applicant_details.application_id')
    .where({job_id: jobId})
    console.log("DETAILS", applicantDetails);
  const applicantInfo = await knex('job_application.applicant_details')
    .where({
      job_id: jobId,
      application_id: appId
    })
  const jobOpening = await knex('jobs.job_opening');
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const technicalScore = await knex('job_application.technical_score')
  const applicantScore = await knex('job_application.technical_score')
    .innerJoin('admin.skill', 'job_application.technical_score.skill_id', 'admin.skill.skill_id')
    .where({application_id: appId})
  const applicantSkill = await knex('job_application.applicant_rating')
    .innerJoin('admin.skill', 'job_application.applicant_rating.skill_id', 'admin.skill.skill_id')
    .where('application_id', appId)
    
  const applicantCapability = await knex('job_application.capabilities')
    .where('application_id', appId)
  const applicantHistory = await knex('job_application.employment_history')
    .where('application_id', appId)
  adminSkill = adminSkill.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.skill_name === value.skill_name)
  );

  const applicantExam = await knex('job_application.technical_score')
    .where({
      application_id: appId
    })
  
  let sum = 0
  for(let i = 0; i < applicantExam.length; i++) {
    sum += applicantExam[i].skill_level
  }
  const total = (sum / (applicantExam.length * 100)) * 100


  const {
    date_of_birth
  } = applicantInfo[0] || {}
  const dob = moment(date_of_birth, 'MM/DD/YYYY')
  const age = moment().diff(dob, 'years',false);

  const {
    history_start_date,
    history_end_date
  } = applicantHistory[0] || {}
  const startDate = moment(history_start_date).format('L')
  const endDate = moment(history_end_date).format('L')

  const getStartDates = applicantHistory.map((element) => moment(element.history_start_date).format('MMMM YYYY'));
  const getEndDates = applicantHistory.map((element) => moment(element.history_end_date).format('MMMM YYYY'));

  res.render('applicationDetails', {jobId, appId, adminSkill, age, applicants, applicantInfo, applicantScore, jobOpening, technicalScore, applicantSkill, applicantCapability, applicantHistory, startDate, endDate, getStartDates, getEndDates, jobApplications, total, applicantExam, applicantDetails})
  // res.redirect(`/application/job/${jobId}/applicant/${appId}`)
})

module.exports = router;