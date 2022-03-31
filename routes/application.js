const express = require('express');
const moment = require('moment');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.get('/application', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const jobOpening = await knex('jobs.job_opening');
  const adminSkill = await knex('admin.skill');
  const applicants = await knex('job_application.applicant_details');
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const technicalScore = await knex('job_application.technical_score');
  res.render('application', {
    jobOpening,
    adminSkill,
    applicants,
    technicalScore,
    jobApplications,
    currentUser,
    currentUserId,
    currentUserRole,
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
  const applicants = await knex('job_application.applicant_details').where(
    'job_id',
    jobId
  );
  const jobOpening = await knex('jobs.job_opening');
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const jobOpeningId = await knex('jobs.job_opening').innerJoin(
    'job_application.applicant_details',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  const jobPosition = await knex('admin.job_position');
  const adminSkill = await knex('admin.skill');
  const technicalScore = await knex('job_application.technical_score');
  const skillScore = await knex('job_application.technical_score')
    .innerJoin(
      'job_application.applicant_details',
      'job_application.applicant_details.application_id',
      'job_application.technical_score.application_id'
    )
    .where('job_id', jobId);
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const applicantSkill = await knex('admin.skill')
    .innerJoin(
    'job_application.applicant_rating',
    'job_application.applicant_rating.skill_id',
    'admin.skill.skill_id'
  );
  
  const applicantInfo = await knex('job_application.applicant_details').where({
    job_id: jobId,
  });

  const { date_of_birth } = applicantInfo[0] || {};

  const dob = moment(date_of_birth, 'MM/DD/YYYY');
  const age = moment().diff(dob, 'years', false);

  res.render('application', {
    applicantInfo,
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
  });
});

router.get(
  '/application/job/:job_id/applicant/:application_id',
  checkAuthenticated,
  async (req, res) => {
    const currentUserId = req.user.user_id;
    const currentUser = await knex('admin.users').where('user_id', currentUserId);
    const currentUserRole = await knex('admin.user_role').where(
      'role_id',
      req.user.role_id
    );
    const jobId = req.params.job_id;
    const appId = req.params.application_id;

    // admin Schema
    let adminSkill = await knex('admin.skill');
      adminSkill = adminSkill.filter(
        (value, index, self) =>
        index === self.findIndex((t) => t.skill_name === value.skill_name)
        );
    const remarks = await knex('admin.remarks')

    // jobs Schema
    const jobOpening = await knex('jobs.job_opening');

    // job_application Schema
    // applicant_details Table
    const applicants = await knex('job_application.applicant_details')
      .where({
        job_id: jobId
      });
    const applicantInfo = await knex('job_application.applicant_details')
      .where({
        job_id: jobId,
        application_id: appId,
      });
      console.log(applicantInfo);
    const applicantDetails = await knex('job_application.applicant_details')
      .leftJoin(
        'job_application.technical_score',
        'job_application.technical_score.application_id',
        'job_application.applicant_details.application_id'
      )
      .where({ job_id: jobId });
    const jobApplications = await knex('job_application.applicant_details')
    .innerJoin(
      'jobs.job_opening',
      'job_application.applicant_details.job_id',
      'jobs.job_opening.job_id'
    );
    const applicantExamResults = await knex('job_application.applicant_exam_answers')
      .innerJoin(
        'question.question',
        'job_application.applicant_exam_answers.question_id',
        'question.question.question_id'
      )
      .where({
        application_id: appId,
      })
      .andWhere('question.question.question_type', 0);
    const personalityTestResults = await knex('job_application.applicant_exam_answers')
    .innerJoin(
      'question.question',
      'job_application.applicant_exam_answers.question_id',
      'question.question.question_id'
    )
    .where({
      application_id: appId,
    })
    .andWhere('question.question.question_type', 1);

    // applicant_rating Table
    const applicantSkill = await knex('job_application.applicant_rating')
      .innerJoin(
        'admin.skill',
        'job_application.applicant_rating.skill_id',
        'admin.skill.skill_id'
      )
      .where('application_id', appId);

    // technical_score Table
    const technicalScore = await knex('job_application.technical_score');
    const applicantExam = await knex('job_application.technical_score')
      .where({
        application_id: appId,
      });
    const applicantScore = await knex('job_application.technical_score')
      .innerJoin(
        'admin.skill',
        'job_application.technical_score.skill_id',
        'admin.skill.skill_id'
      )
      .where({ application_id: appId });
    
    // capabilities Table
    const applicantCapability = await knex('job_application.capabilities')
      .where(
        'application_id',
        appId
      );

    // employment_history Table
    const applicantHistory = await knex('job_application.employment_history').where(
      'application_id',
      appId
    );

    // get total percentage of skill_level
    let sum = 0;
    for (let i = 0; i < applicantExam.length; i++) {
      sum += applicantExam[i].skill_level;
    }
    const total = (sum / (applicantExam.length * 100)) * 100;

    // format date type
    const { date_of_birth } = applicantInfo[0] || {};
    const dob = moment(date_of_birth, 'MM/DD/YYYY');
    const age = moment().diff(dob, 'years', false);

    const { history_start_date, history_end_date } = applicantHistory[0] || {};
    const startDate = moment(history_start_date).format('L');
    const endDate = moment(history_end_date).format('L');

    const getStartDates = applicantHistory.map((element) =>
      moment(element.history_start_date).format('MMMM YYYY')
    );
    const getEndDates = applicantHistory.map((element) =>
      moment(element.history_end_date).format('MMMM YYYY')
    );

    res.render('applicationDetails', {
      jobId,
      appId,
      adminSkill,
      age,
      applicants,
      applicantInfo,
      applicantScore,
      jobOpening,
      technicalScore,
      applicantSkill,
      applicantCapability,
      applicantHistory,
      startDate,
      endDate,
      getStartDates,
      getEndDates,
      jobApplications,
      total,
      applicantExam,
      applicantExamResults,
      personalityTestResults,
      applicantDetails,
      currentUser,
      currentUserId,
      currentUserRole,
      remarks
    });
    // res.redirect(`/application/job/${jobId}/applicant/${appId}`)
  }
);

router.post('/application/job/:job_id/applicant/:application_id', async (req, res) => {
  const jobId = req.params.job_id
  const appId = req.params.application_id
  const status = await knex('job_application.applicant_details')
    .where({
      job_id: jobId,
      application_id: appId
    })
  const {
    remarks
  } = req.body

  if (status[0].status != null) {
    knex('job_application.applicant_details')
      .update({
        status: remarks
      })
      .where({
        job_id: jobId,
        application_id: appId
      })
  } else {
    knex('job_application.applicant_details')
      .insert({
        status: remarks
      })
  }
})


module.exports = router;
