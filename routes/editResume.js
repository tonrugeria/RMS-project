const express = require('express');
const moment = require('moment');
const fs = require('fs');
const knex = require('../dbconnection');
const upload = require('../middlewares/upload');
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
} = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/careers/job/:job_id/resume/application/:application_id',
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const jobs = await knex('jobs.job_opening').where('job_id', jobId);
    const applicants = await knex('job_application.applicant_details').where({
      application_id: appId,
      job_id: jobId,
    });
    const admin = await knex('admin.skill')
      .innerJoin('jobs.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id')
      .where('job_id', jobId);
    const rating = await knex('job_application.applicant_rating').where(
      'application_id',
      appId
    );
    const capabilities = await knex('job_application.capabilities').where(
      'application_id',
      appId
    );
    const history = await knex('job_application.employment_history').where(
      'application_id',
      appId
    );
    const education = await knex('job_application.education').where(
      'application_id',
      appId
    );

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

    if (applicants != 0) {
      const {
        date_of_birth,
        start_date,
        preferred_interview_date_1,
        preferred_interview_date_2,
        preferred_interview_date_3,
      } = applicants[0] || {};

      const getStartDates = history.map((element) =>
        moment(element.history_start_date, 'MM/DD/YYYY')
      );

      const getEndDates = history.map((element) =>
        moment(element.history_end_date, 'MM/DD/YYYY')
      );

      let yearDiff1 = getEndDates[0].diff(getStartDates[0], 'years');
      let yearDiff2 = getEndDates[1].diff(getStartDates[1], 'years');
      let yearDiff3 = getEndDates[2].diff(getStartDates[2], 'years');
      let yearDiff4 = getEndDates[3].diff(getStartDates[3], 'years');
      let yearDiff5 = getEndDates[4].diff(getStartDates[4], 'years');
      if (isNaN(yearDiff1)) yearDiff1 = 0;
      if (isNaN(yearDiff2)) yearDiff2 = 0;
      if (isNaN(yearDiff3)) yearDiff3 = 0;
      if (isNaN(yearDiff4)) yearDiff4 = 0;
      if (isNaN(yearDiff5)) yearDiff5 = 0;
      const totalYears = yearDiff1 + yearDiff2 + yearDiff3 + yearDiff4 + yearDiff5;

      const dob = moment(date_of_birth).format('L');
      const startDate = moment(start_date).format('L');
      const preferredDate1 = moment(preferred_interview_date_1).format('L');
      const preferredDate2 = moment(preferred_interview_date_2).format('L');
      const preferredDate3 = moment(preferred_interview_date_3).format('L');
      const historyStartDates = history.map((element) =>
        moment(element.history_start_date).format('L')
      );
      const historyEndDates = history.map((element) =>
        moment(element.history_end_date).format('L')
      );
      const gradDates = education.map((element) =>
        moment(element.date_graduated).format('L')
      );

      res.render('editResume', {
        jobId,
        appId,
        jobs,
        applicants,
        dob,
        startDate,
        preferredDate1,
        preferredDate2,
        preferredDate3,
        rating,
        admin,
        capabilities,
        history,
        historyStartDates,
        historyEndDates,
        totalYears,
        gradDates,
        education,
        applicantExamRecord,
        applicantPersonaRecord,
      });
    } else {
      res.render('editResume', {
        jobId,
        appId,
        jobs,
        applicants,
        rating,
        admin,
        capabilities,
        history,
        education,
        applicantExamRecord,
      });
    }
  }
);

router.post(
  '/careers/job/:job_id/resume/application/:application_id',
  upload,
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const link = `http://localhost:3000/careers/job/${jobId}/resume/application/${appId}`;
    let {
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
      history_start_date,
      history_end_date,
      position,
      company,
      school,
      course,
      date_graduated,
    } = req.body;
    console.log('STARTDATE', start_date);
    const getStartDates = history_start_date.map((element) =>
      moment(element).format('L')
    );

    const getEndDates = history_end_date.map((element) => moment(element, 'MM/DD/YYYY'));

    let yearDiff1 = getEndDates[0].diff(getStartDates[0], 'years');
    let yearDiff2 = getEndDates[1].diff(getStartDates[1], 'years');
    let yearDiff3 = getEndDates[2].diff(getStartDates[2], 'years');
    let yearDiff4 = getEndDates[3].diff(getStartDates[3], 'years');
    let yearDiff5 = getEndDates[4].diff(getStartDates[4], 'years');
    if (isNaN(yearDiff1)) yearDiff1 = 0;
    if (isNaN(yearDiff2)) yearDiff2 = 0;
    if (isNaN(yearDiff3)) yearDiff3 = 0;
    if (isNaN(yearDiff4)) yearDiff4 = 0;
    if (isNaN(yearDiff5)) yearDiff5 = 0;
    const totalYears = yearDiff1 + yearDiff2 + yearDiff3 + yearDiff4 + yearDiff5;
    const today = new Date();
    const thisDay = moment(today, 'MM/DD/YYYY');

    let new_image = '';

    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync(`./photo/${req.body.old_image}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }
    knex('job_application.applicant_details')
      .update({
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
        photo: new_image,
        application_link: link,
        year_experience: totalYears,
        date_last_updated: thisDay,
      })
      .where({ job_id: jobId, application_id: appId })
      .then(() => {
        knex('job_application.capabilities')
          .update({
            application_id: appId,
            capability_1,
            capability_2,
            capability_3,
            capability_4,
            capability_5,
          })
          .where('application_id', appId)
          .then(async () => {
            const historyId = await knex('job_application.employment_history').where({
              application_id: appId,
            });
            for (let i = 0; i < history_start_date.length; i++) {
              if (history_start_date[i] == '' || history_end_date[i] == '') {
                history_start_date[i] = null;
                history_end_date[i] = null;
              } else {
                history_start_date[i] = moment(history_start_date[i]).format('L');
                history_end_date[i] = moment(history_end_date[i]).format('L');
              }
              if (historyId[i] == undefined) {
                knex('job_application.employment_history')
                  .insert({
                    application_id: appId,
                    history_start_date: history_start_date[i],
                    history_end_date: history_end_date[i],
                    position: position[i],
                    company: company[i],
                  })
                  .then((results) => results);
              } else {
                knex('job_application.employment_history')
                  .update({
                    history_start_date: history_start_date[i],
                    history_end_date: history_end_date[i],
                    position: position[i],
                    company: company[i],
                  })
                  .where({ application_id: appId, history_id: historyId[i].history_id })
                  .then((results) => results);
              }
            }

            const educationId = await knex('job_application.education').where({
              application_id: appId,
            });
            for (let i = 0; i < date_graduated.length; i++) {
              if (date_graduated[i] == '') {
                date_graduated[i] = null;
              } else {
                date_graduated[i] = moment(date_graduated[i]).format('L');
              }
              if (educationId[i] == undefined) {
                knex('job_application.education')
                  .insert({
                    application_id: appId,
                    school: school[i],
                    course: course[i],
                    date_graduated: date_graduated[i],
                  })
                  .then((result) => result);
              } else {
                knex('job_application.education')
                  .update({
                    application_id: appId,
                    school: school[i],
                    course: course[i],
                    date_graduated: date_graduated[i],
                  })
                  .where({
                    application_id: appId,
                    education_id: educationId[i].education_id,
                  })
                  .then((result) => result);
              }
            }

            // applicant_rating data entry
            if (typeof skill_id != typeof []) {
              knex('job_application.applicant_rating')
                .where('application_id', appId)
                .del()
                .then(() => {
                  if (skill_years == '' && skill_self_rating == '') {
                    skill_years = 0;
                    skill_self_rating = 0;
                  }
                  knex('job_application.applicant_rating')
                    .insert({
                      application_id: appId,
                      skill_id,
                      skill_years,
                      skill_self_rating,
                    })
                    .then((result) => result);
                });
            } else {
              for (let i = 0; i < skill_id.length; i++) {
                if (skill_years[i] == '' && skill_self_rating[i] == '') {
                  skill_years[i] = 0;
                  skill_self_rating[i] = 0;
                }
                knex('job_application.applicant_rating')
                  .where('application_id', appId)
                  .del()
                  .then(() => {
                    knex('job_application.applicant_rating')
                      .insert({
                        application_id: appId,
                        skill_id: skill_id[i],
                        skill_years: skill_years[i],
                        skill_self_rating: skill_self_rating[i],
                      })
                      .then((result) => result);
                  });
              }
            }

            res.redirect(`/careers/job/${jobId}/resume/application/${appId}`);
          });
      });
  }
);

module.exports = router;
