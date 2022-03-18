const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

router.get(
  "/resume/job/:job_id/application/:application_id",
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const jobs = await knex("jobs.job_opening").where("job_id", jobId);
    const applicants = await knex("job_application.applicant_details").where(
      "application_id",
      appId
    );
    const admin = await knex("admin.skill");
    const rating = await knex("job_application.applicant_rating").where(
      "application_id",
      appId
    );
    const capabilities = await knex("job_application.capabilities").where(
      "application_id",
      appId
    );
    const history = await knex("job_application.employment_history").where(
      "application_id",
      appId
    );
    const {
      date_of_birth,
      start_date,
      preferred_interview_date_1,
      preferred_interview_date_2,
      preferred_interview_date_3,
    } = applicants[0] || {};
    const {
      history_start_date_1,
      history_end_date_1,
      history_start_date_2,
      history_end_date_2,
      history_start_date_3,
      history_end_date_3,
    } = history[0];

    const getStartDate1 = moment(history_start_date_1, "MM/DD/YYYY")
    const getEndDate1 = moment(history_end_date_1, "MM/DD/YYYY")
    const getStartDate2 = moment(history_start_date_2, "MM/DD/YYYY")
    const getEndDate2 = moment(history_end_date_2, "MM/DD/YYYY")
    const getStartDate3 = moment(history_start_date_3, "MM/DD/YYYY")
    const getEndDate3 = moment(history_end_date_3, "MM/DD/YYYY")

    const yearDiff1 = getEndDate1.diff(getStartDate1, "years");
    const yearDiff2 = getEndDate2.diff(getStartDate2, "years");
    const yearDiff3 = getEndDate3.diff(getStartDate3, "years");

    const totalYears = yearDiff1 + yearDiff2 + yearDiff3;

    const dob = moment(date_of_birth).format("L");
    const startDate = moment(start_date).format("L");
    const preferredDate1 = moment(preferred_interview_date_1).format("L");
    const preferredDate2 = moment(preferred_interview_date_2).format("L");
    const preferredDate3 = moment(preferred_interview_date_3).format("L");
    const startDate1 = moment(history_start_date_1).format("L");
    const endDate1 = moment(history_end_date_1).format("L");
    const startDate2 = moment(history_start_date_2).format("L");
    const endDate2 = moment(history_end_date_2).format("L");
    const startDate3 = moment(history_start_date_3).format("L");
    const endDate3 = moment(history_end_date_3).format("L");

    res.render("editResume", {
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
      startDate1,
      endDate1,
      startDate2,
      endDate2,
      startDate3,
      endDate3,
      totalYears,
    });
  }
);

router.post(
  "/resume/job/:job_id/application/:application_id",
  async (req, res) => {
    const jobId = req.params.job_id;
    const appId = req.params.application_id;
    const {
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
    } = req.body;

    const startDate1 = moment(history_start_date_1, 'MM/DD/YYYY')
    const endDate1 = moment(history_end_date_1, 'MM/DD/YYYY')
    const startDate2 = moment(history_start_date_2, 'MM/DD/YYYY')
    const endDate2 = moment(history_end_date_2, 'MM/DD/YYYY')
    const startDate3 = moment(history_start_date_3, 'MM/DD/YYYY')
    const endDate3 = moment(history_end_date_3, 'MM/DD/YYYY')

    const yearDiff1 = endDate1.diff(startDate1, "years");
    const yearDiff2 = endDate2.diff(startDate2, "years");
    const yearDiff3 = endDate3.diff(startDate3, "years");

    const totalYears = yearDiff1 + yearDiff2 + yearDiff3;

    const today = new Date()
    const thisDay = moment(today, 'MM/DD/YYYY')
    knex("job_application.applicant_details")
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
        year_experience: totalYears,
        date_last_updated: thisDay
      })
      .where("job_id", jobId)
      .then(() => {
        knex("job_application.capabilities")
          .update({
            application_id: appId,
            capability_1,
            capability_2,
            capability_3,
          })
          .where("application_id", appId)
          .then(() => {
            knex("job_application.employment_history")
              .update({
                application_id: appId,
                history_start_date_1: startDate1,
                history_end_date_1: endDate1,
                position_1,
                company_1,
                history_start_date_2: startDate2,
                history_end_date_2: endDate2,
                position_2,
                company_2,
                history_start_date_3: startDate3,
                history_end_date_3: endDate3,
                position_3,
                company_3,
              })
              .where("application_id", appId)
              .then(() => {
                for (let i = 0; i < skill_id.length; i++) {
                  const skill = knex("job_application.applicant_rating")
                    .where("application_id", appId)
                    .andWhere("skill_id", skill_id[i]);

                  if (skill != 0) {
                    knex("job_application.applicant_rating")
                      .update({
                        application_id: appId,
                        skill_id: skill_id[i],
                        skill_years: skill_years[i],
                        skill_self_rating: skill_self_rating[i],
                      })
                      .where("application_id", appId)
                      .andWhere("skill_id", skill_id[i])
                      .then();
                  } else {
                    knex("job_application.applicant_rating")
                      .insert({
                        application_id: appId,
                        skill_id: skill_id[i],
                        skill_years: skill_years[i],
                        skill_self_rating: skill_self_rating[i],
                      })
                      .where("application_id", appId)
                      .then();
                  }
                }
                res.redirect(`/resume/job/${jobId}/application/${appId}`);
              });
          });
      });
  }
);

module.exports = router;
