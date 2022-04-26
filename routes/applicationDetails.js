const express = require('express');
const moment = require('moment');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

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
    const remarks = await knex('admin.remarks');

    // jobs Schema
    const jobOpening = await knex('jobs.job_opening');

    // job_application Schema
    // applicant_details Table
    const applicants = await knex('job_application.applicant_details').where({
      job_id: jobId,
    });
    const applicantInfo = await knex('job_application.applicant_details').where({
      job_id: jobId,
      application_id: appId,
    });
    const applicantDetails = await knex('job_application.applicant_details')
      .leftJoin(
        'job_application.technical_score',
        'job_application.technical_score.application_id',
        'job_application.applicant_details.application_id'
      )
      .where({ job_id: jobId });
    const jobApplications = await knex('job_application.applicant_details').innerJoin(
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

    const applicantJob = await knex('job_application.applicant_rating').innerJoin(
      'admin.skill',
      'job_application.applicant_rating.skill_id',
      'admin.skill.skill_id'
    );

    // technical_score Table
    const technicalScore = await knex('job_application.technical_score');
    const applicantExam = await knex('job_application.technical_score').where({
      application_id: appId,
    });
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
    const applicantScore = await knex('job_application.technical_score')
      .innerJoin(
        'admin.skill',
        'job_application.technical_score.skill_id',
        'admin.skill.skill_id'
      )
      .where({
        application_id: appId,
      });

    const expertise = await knex('job_application.technical_score')
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

    const expert = await knex('job_application.technical_score')
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
      })
      .whereBetween('skill_level', [75, 100]);

    const intermediate = await knex('job_application.technical_score')
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
      })
      .whereBetween('skill_level', [50, 74]);

    const beginner = await knex('job_application.technical_score')
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
      })
      .whereBetween('skill_level', [0, 49]);
    for (let i = 0; i < expertise.length; i++) {
      if (expertise[i].skill_level >= 75) {
        for (let j = 0; j < expert.length; j++) {}
      }
    }

    const scoreArr = [];
    for (let i = 0; i < applicantExam.length; i++) {
      if (applicantExam[i].application_id == appId) {
        // let highestScore = applicantDetails[i].skill_level
        scoreArr.push(applicantExam[i].skill_level);
      }
    }
    const highestScore = Math.max(...scoreArr);
    // capabilities Table
    const applicantCapability = await knex('job_application.capabilities').where(
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
    for (let i = 0; i < applicantScore.length; i++) {
      sum += parseInt(applicantScore[i].skill_level);
    }
    const total = (sum / (applicantScore.length * 100)) * 100;

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

    res.send({
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
      remarks,
      applicantJob,
      highestScore,
      expertise,
      beginner,
      intermediate,
      expert,
      jobApplicants,
    });
  }
);

router.post('/application/job/:job_id/applicant/:application_id', async (req, res) => {
  const jobId = req.params.job_id;
  const appId = req.params.application_id;
  const { remark } = req.body;
  if (remark != null) {
    knex('job_application.applicant_details')
      .update({
        status: remark,
      })
      .where({
        job_id: jobId,
        application_id: appId,
      })
      .then((result) => result);
  }
  res.redirect(`/application`);
});

module.exports = router;
