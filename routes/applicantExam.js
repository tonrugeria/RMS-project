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

    const applicantExamRecord = await knex('job_application.applicant_exam_answers')
      .where({
        application_id: appId,
        job_id: jobId,
        question_type: 0,
      })
      .first();

    res.render('applicantExam', {
      jobId,
      appId,
      jobQuestion,
      applicantRecord,
      applicantExamRecord,
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
        knex('job_application.applicant_exam_answers')
          .insert({
            job_id: jobId,
            application_id: appId,
            question_id: question_id[i],
            applicant_answer: applicant_answer[i],
            question_type: question_type[i],
          })
          .then((results) => results);
      }
    }
    res.redirect(`/careers/job/${jobId}/technical-exam/application/${appId}`);

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

    // to keep track of total exam score and the applicant's score
    let applicantTotalScore = 0;
    let examTotalPoints = 0;

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

    applicantExam_Question = applicantExam_Question.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.question_id === value.question_id)
    );

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
      examTotalPoints++;
    }

    // remove duplicates from the skills array
    skills = skills.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            (t.skill_id === value.skill_id && t.score === value.score) ||
            (t.skill_name === value.skill_name && t.score === value.score)
        )
    );

    // insert query to technical score
    skills.forEach((item) => {
      const skillAverage = (item.score / item.skill_total) * 100;
      const skillAvePrecise = +skillAverage.toFixed(2);
      knex('job_application.technical_score')
        .insert({
          application_id: appId,
          skill_id: item.skill_id,
          skill_score: item.score,
          skill_total: item.skill_total,
          skill_level: skillAvePrecise,
        })
        .then((results) => results);
    });

    // update query for the applicant's total exam score
    knex('job_application.applicant_details')
      .update({ technical_test_score: applicantTotalScore })
      .where({ application_id: appId })
      .then((results) => results);
  }
);

// ajax route for showing questions
router.post('/careers/job/:job_id/technical-exam', async (req, res) => {
  const jobId = req.params.job_id;
  const jobQuestion = await knex('jobs.question')
    .innerJoin(
      'question.question',
      'jobs.question.question_id',
      'question.question.question_id'
    )
    .where({ job_id: jobId });

  res.send({
    responseQuestion: jobQuestion,
  });
});
module.exports = router;
