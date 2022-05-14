const express = require('express');
const moment = require('moment');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.get('/application', checkAuthenticated, async (req, res) => {
  const jobId = '';
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );

  // admin Schema
  let adminSkill = await knex('admin.skill');
  adminSkill = adminSkill.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.skill_name === value.skill_name)
  );
  const remarks = await knex('admin.remarks');

  // job_application Schema
  // applicant_details Table
  const applicants = await knex('job_application.applicant_details');
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );

  // applicant_rating
  const applicantJob = await knex('job_application.applicant_rating').innerJoin(
    'admin.skill',
    'job_application.applicant_rating.skill_id',
    'admin.skill.skill_id'
  );

  // jobs Schema
  const jobOpening = await knex('jobs.job_opening');
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');

  // technical_score Table
  const technicalScore = await knex('job_application.technical_score');
  const jobApplicants = await knex('job_application.technical_score')
    .innerJoin(
      'job_application.applicant_details',
      'job_application.applicant_details.application_id',
      'job_application.technical_score.application_id'
    )
    .innerJoin(
      'admin.skill',
      'admin.skill.skill_id',
      'job_application.technical_score.skill_id'
    );
      
  const branding = await knex('admin.branding');
  res.render('application', {
    branding,
    jobOpening,
    adminSkill,
    applicants,
    technicalScore,
    jobApplications,
    currentUser,
    currentUserId,
    currentUserRole,
    applicantJob,
    remarks,
    jobId,
    jobApplicants,
    jobSkill
  });
});

router.get('/application/job/:job_id', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const jobId = req.params.job_id;

  // admin Schema
  const jobPosition = await knex('admin.job_position');
  let adminSkill = await knex('admin.skill');
  adminSkill = adminSkill.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.skill_name === value.skill_name)
  );
  const remarks = await knex('admin.remarks');
  const applicantSkill = await knex('admin.skill').innerJoin(
    'job_application.applicant_rating',
    'job_application.applicant_rating.skill_id',
    'admin.skill.skill_id'
  );

  // job_application Schema
  // applicant_details Table
  const applicants = await knex('job_application.applicant_details').where({
    job_id: jobId,
  });
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  // const applicantInfo = await knex('job_application.applicant_details')
  //   .where({
  //     job_id: jobId,
  //   });

  // applicant_rating Table
  const applicantJob = await knex('job_application.applicant_rating').innerJoin(
    'admin.skill',
    'job_application.applicant_rating.skill_id',
    'admin.skill.skill_id'
  );

  // technical_score Table
  const technicalScore = await knex('job_application.technical_score');
  const skillScore = await knex('job_application.technical_score')
    .innerJoin(
      'job_application.applicant_details',
      'job_application.applicant_details.application_id',
      'job_application.technical_score.application_id'
    )
    .where('job_id', jobId);
  const jobApplicants = await knex('job_application.technical_score')
    .innerJoin(
      'job_application.applicant_details',
      'job_application.applicant_details.application_id',
      'job_application.technical_score.application_id'
    )
    .innerJoin(
      'admin.skill',
      'admin.skill.skill_id',
      'job_application.technical_score.skill_id'
    )
    .where({
      job_id: jobId,
    });

  // jobs Schema
  const jobOpening = await knex('jobs.job_opening');
  const jobOpeningId = await knex('jobs.job_opening').innerJoin(
    'job_application.applicant_details',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const jobSkill = await knex('jobs.skill')
  .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id')
  .where({job_id: jobId})

  // Format
  const { date_of_birth } = applicants[0] || {};

  const dob = moment(date_of_birth, 'MM/DD/YYYY');
  const age = moment().diff(dob, 'years', false);
  const branding = await knex('admin.branding');

  res.render('application', {
    jobOpening,
    jobPosition,
    jobSkill,
    applicants,
    applicantSkill,
    adminSkill,
    jobId,
    jobOpeningId,
    skillScore,
    technicalScore,
    age,
    jobApplications,
    currentUser,
    currentUserId,
    currentUserRole,
    applicantJob,
    remarks,
    jobApplicants,
    branding
  });
});

module.exports = router;
