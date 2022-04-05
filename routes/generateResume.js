const express = require('express');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const moment = require('moment');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// generate PDF
router.get(
  '/generateResume/job/:job_id/application/:application_id',
  checkAuthenticated,
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const currentUserId = req.user.user_id;
    const currentUser = await knex('admin.users').where('user_id', currentUserId);
    const currentUserRole = await knex('admin.user_role').where(
      'role_id',
      req.user.role_id
    );
    const applicantInfo = await knex('job_application.applicant_details').where({
      job_id: jobId,
      application_id: appId,
    });
    const applicantSkill = await knex('admin.skill')
      .innerJoin(
        'job_application.applicant_rating',
        'job_application.applicant_rating.skill_id',
        'admin.skill.skill_id'
      )
      .where({ application_id: appId });
    const applicantCapability = await knex('job_application.capabilities').where(
      'application_id',
      appId
    );
    const applicantHistory = await knex('job_application.employment_history').where(
      'application_id',
      appId
    );
    const getStartDates = applicantHistory.map((element) =>
      moment(element.history_start_date).format('MMMM YYYY')
    );
    const getEndDates = applicantHistory.map((element) =>
      moment(element.history_end_date).format('MMMM YYYY')
    );
    const { date_of_birth } = applicantInfo[0] || {};

    const dob = moment(date_of_birth, 'MM/DD/YYYY');
    const age = moment().diff(dob, 'years', false);

    const applicantExam = await knex('job_application.technical_score').where({
      application_id: appId,
    });

    let sum = 0;
    for (let i = 0; i < applicantExam.length; i++) {
      sum += applicantExam[i].skill_level;
    }
    const total = (sum / (applicantExam.length * 100)) * 100;

    const applicantScore = await knex('job_application.technical_score')
      .innerJoin(
        'admin.skill',
        'job_application.technical_score.skill_id',
        'admin.skill.skill_id'
      )
      .where({ application_id: appId });
    ejs.renderFile(
      path.join(__dirname, '../views/', 'generateResume.ejs'),
      {
        currentUser,
        currentUserId,
        currentUserRole,
        applicantInfo,
        applicantSkill,
        applicantCapability,
        applicantHistory,
        applicantExam,
        applicantScore,
        getStartDates,
        getEndDates,
        age,
        total,
      },
      (err, data) => {
        if (err) {
          console.log('here');
          res.send(err);
        } else {
          const options = {
            height: '11.25in',
            width: '8.5in',
            header: {
              height: '20mm',
            },
            footer: {
              height: '20mm',
            },
          };
          pdf.create(data, options).toFile('report.pdf', (err, data) => {
            if (err) {
              res.send(err);
            } else {
              console.log('PDF CREATED');
              res.redirect(`/application/job/${jobId}/applicant/${appId}`);
            }
          });
        }
      }
    );
//     res.render('generateResume', {
//       currentUser,
//       currentUserId,
//       currentUserRole,
//       applicantInfo,
//       applicantSkill,
//       applicantCapability,
//       applicantHistory,
//       applicantExam,
//       applicantScore,
//       getStartDates,
//       getEndDates,
//       age,
//       total,
//     });
  }
);

module.exports = router;
