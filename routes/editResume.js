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
    // const applicantById = await knex('job_application.applicant_details').where('application_id', appId)
    const {
      date_of_birth,
      start_date,
      preferred_interview_date_1,
      preferred_interview_date_2,
      preferred_interview_date_3,
    } = applicants[0];
    const { skill_id } = req.body;
    const dob = moment(date_of_birth).format("L");
    const startDate = moment(start_date).format("L");
    const preferredDate1 = moment(preferred_interview_date_1).format("L");
    const preferredDate2 = moment(preferred_interview_date_2).format("L");
    const preferredDate3 = moment(preferred_interview_date_3).format("L");
    const admin = await knex("admin.skill");
    const rating = await knex("job_application.applicant_rating").where(
      "application_id",
      appId
    );
    // console.log(rating);
    // const rating = await knex('admin.skill').innerJoin('job_application.applicant_rating', 'admin.skill.skill_id', 'job_application.applicant_rating.skill_id').where('application_id', appId)
    // console.log("RATING", rating);
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
    } = req.body;
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
      })
      .where("job_id", jobId)
      .then(async () => {
        for (let i = 0; i < skill_id.length; i++) {
          const skill = await knex("job_application.applicant_rating")
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
                  .then(result => result);
            } else {
                knex("job_application.applicant_rating")
                  .insert({
                    application_id: appId,
                    skill_id: skill_id[i],
                    skill_years: skill_years[i],
                    skill_self_rating: skill_self_rating[i],
                  })
                  .where("application_id", appId)
                  .then((result) => {
                    result;
                  });
            }
          }
          res.redirect(`/resume/job/${jobId}/application/${appId}`);
      });
  }
);

module.exports = router;
