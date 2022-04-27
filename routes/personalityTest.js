const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// get route for applicant exam
router.get(
  '/careers/job/:job_id/personality-test/application/:application_id',
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;

    const applicantRecord = await knex('job_application.applicant_details').where({
      job_id: jobId,
      application_id: appId,
    });

    const personalityRecord = await knex('job_application.applicant_exam_answers')
      .where({
        application_id: appId,
        job_id: jobId,
        question_type: 1,
      })
      .first();

    const personalityQuestions = await knex('question.question').where({
      question_type: 1,
    });

    const applicantExamRecord = await knex('job_application.applicant_exam_answers')
      .where({
        application_id: appId,
        job_id: jobId,
        question_type: 0,
      })
      .first();

    res.render('personalityTest', {
      jobId,
      appId,
      personalityQuestions,
      applicantRecord,
      applicantExamRecord,
      personalityRecord,
    });
  }
);

// post route for submitting applicant exam
router.post(
  '/careers/job/:job_id/personality-test/application/:application_id',
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const { applicant_answer, question_id, question_type } = req.body;

    for (let i = 0; i < applicant_answer.length; i++) {
      await knex('job_application.applicant_exam_answers').insert({
        job_id: jobId,
        application_id: appId,
        question_id: question_id[i],
        applicant_answer: applicant_answer[i],
        question_type: question_type[i],
      });
    }

    const personalityAnswers = await knex('job_application.applicant_exam_answers')
      .innerJoin(
        'question.question',
        'job_application.applicant_exam_answers.question_id',
        'question.question.question_id'
      )
      .where({ job_id: jobId, application_id: appId })
      .andWhere('question.question.question_type', 1);

    let applicantPersonalityTotal = 0;
    for (let i = 0; i < personalityAnswers.length; i++) {
      if (applicant_answer[i] == 1) {
        applicantPersonalityTotal += personalityAnswers[i].choice_1_value;
      } else if (applicant_answer[i] == 2) {
        applicantPersonalityTotal += personalityAnswers[i].choice_2_value;
      } else if (applicant_answer[i] == 3) {
        applicantPersonalityTotal += personalityAnswers[i].choice_3_value;
      } else {
        applicantPersonalityTotal += personalityAnswers[i].choice_4_value;
      }
    }

    await knex('job_application.applicant_details')
      .where({ application_id: appId })
      .update({ personality_test_score: applicantPersonalityTotal });

    await knex('job_application.personality_score').insert({
      application_id: appId,
      score: applicantPersonalityTotal,
    });

    res.redirect(`/careers/job/${jobId}/personality-test/application/${appId}`);
  }
);

module.exports = router;
