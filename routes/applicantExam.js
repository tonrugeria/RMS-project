const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// get route for applicant exam
router.get(
  '/careers/job/:job_id/technical-exam/application/:application_id',
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;

    const applicantRecord = await knex('job_application.applicant_details').where({
      job_id: jobId,
      application_id: appId,
    });

    const jobQuestion = await knex('jobs.question')
      .innerJoin(
        'question.question',
        'jobs.question.question_id',
        'question.question.question_id'
      )
      .where('job_id', jobId);

    const personalityQuestions = await knex('jobs.question')
      .innerJoin(
        'question.question',
        'jobs.question.question_id',
        'question.question.question_id'
      )
      .where({ job_id: jobId, question_type: 1 });

    const applicantExamRecord = await knex('job_application.applicant_exam_answers')
      .where({
        application_id: appId,
        job_id: jobId,
        question_type: 0,
      })
      .first();

    const applicantPersonaRecord = await knex('job_application.applicant_exam_answers')
      .where({
        application_id: appId,
        job_id: jobId,
        question_type: 1,
      })
      .first();

    res.render('applicantExam', {
      jobId,
      appId,
      jobQuestion,
      applicantRecord,
      applicantExamRecord,
      personalityQuestions,
      applicantPersonaRecord,
    });
  }
);

// post route for submitting applicant exam
router.post(
  '/careers/job/:job_id/technical-exam/application/:application_id',
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const { applicant_answer, question_id, question_type } = req.body;
    const applicantExamRecord = await knex('job_application.applicant_exam_answers')
      .where({
        application_id: appId,
        job_id: jobId,
        question_type: 0,
      })
      .first();
    if (applicantExamRecord == undefined) {
      for (let i = 0; i < applicant_answer.length; i++) {
        await knex('job_application.applicant_exam_answers').insert({
          job_id: jobId,
          application_id: appId,
          question_id: question_id[i],
          applicant_answer: applicant_answer[i],
          question_type: question_type[i],
        });
      }
    }

    // 3 joined tables: applicant_exam_answers, question.question, admin.skill
    let applicantExam_Question = await knex('job_application.applicant_exam_answers')
      .innerJoin(
        'question.question',
        'job_application.applicant_exam_answers.question_id',
        'question.question.question_id'
      )
      .innerJoin(
        'admin.skill',
        'question.question.question_category',
        'admin.skill.skill_name'
      )
      .where({ job_id: jobId, application_id: appId });

    // to keep track of the applicant's total score
    let applicantTotalScore = 0;
    // remove duplicating questions
    applicantExam_Question = applicantExam_Question.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.question_id === value.question_id)
    );

    // skills array to store score for each skill
    let skills = [];
    applicantExam_Question.forEach((question) => {
      skills.push({
        skill_id: question.skill_id,
        skill_name: question.skill_name,
        score: 0,
        skill_total: 0,
      });
    });

    // populating the skills array and recording the count of right answers
    for (let i = 0; i < applicantExam_Question.length; i++) {
      if (
        applicantExam_Question[i].applicant_answer ===
        applicantExam_Question[i].correct_answer
      ) {
        applicantTotalScore++;
      }
      for (let j = 0; j < skills.length; j++) {
        if (applicantExam_Question[i].skill_id == skills[j].skill_id) {
          if (
            applicantExam_Question[i].applicant_answer ===
            applicantExam_Question[i].correct_answer
          ) {
            skills[j].skill_id = applicantExam_Question[i].skill_id;
            skills[j].skill_name = applicantExam_Question[i].skill_name;
            skills[j].score += 1;
            skills[j].skill_total += 1;
          } else {
            skills[j].skill_total += 1;
          }
        }
      }
    }

    skills = skills.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.skill_id === value.skill_id)
    );

    // insert query to technical score
    skills.forEach(async (item) => {
      const skillAverage = (item.score / item.skill_total) * 100;
      const skillAvePrecise = +skillAverage.toFixed(2);
      await knex('job_application.technical_score').insert({
        application_id: appId,
        skill_id: item.skill_id,
        skill_score: item.score,
        skill_total: item.skill_total,
        skill_level: skillAvePrecise,
      });
    });

    // update query for the applicant's total exam score
    await knex('job_application.applicant_details')
      .update({ technical_test_score: applicantTotalScore })
      .where({ application_id: appId });

    res.redirect(`/careers/job/${jobId}/technical-exam/application/${appId}`);
  }
);

// ajax route for showing questions
router.get('/careers/job/:job_id/technical-exam', async (req, res) => {
  const jobId = req.params.job_id;
  const jobQuestion = await knex('jobs.question')
    .innerJoin(
      'question.question',
      'jobs.question.question_id',
      'question.question.question_id'
    )
    .where({ job_id: jobId, question_type: 0 });

  res.send({
    responseQuestion: jobQuestion,
  });
});
module.exports = router;
