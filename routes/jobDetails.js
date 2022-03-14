const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// job-details get route
router.get("/job-details/:job_id", async (req, res) => {
  const job = await knex
    .select()
    .from("jobs.job_opening")
    .where("job_id", req.params.job_id);
  const jobDetail = await knex("jobs.job_details").where(
    "job_id",
    req.params.job_id
  );
  const jobId = req.params.job_id;
  res.render("jobDetails", { job, jobDetail, jobId });
});

// job-details post route
router.post("/job-details/:job_id", async (req, res) => {
  const {
    button,
    role,
    responsibility_1,
    responsibility_2,
    responsibility_3,
    responsibility_4,
    responsibility_5,
    responsibility_6,
    responsibility_7,
    responsibility_8,
    responsibility_9,
    responsibility_10,
    responsibility_11,
    responsibility_12,
    responsibility_13,
    responsibility_14,
    responsibility_15,
    responsibility_16,
    responsibility_17,
    responsibility_18,
    responsibility_19,
    responsibility_20,
    qualification_1,
    qualification_2,
    qualification_3,
    qualification_4,
    qualification_5,
    qualification_6,
    qualification_7,
    qualification_8,
    qualification_9,
    qualification_10,
    qualification_11,
    qualification_12,
    qualification_13,
    qualification_14,
    qualification_15,
    qualification_16,
    qualification_17,
    qualification_18,
    qualification_19,
    qualification_20,
  } = req.body;
  const jobId = req.params.job_id;
  if (button === "add_responsibility_btn") {
    // add btn
  } else if (button === "qualificationBtn") {
    // btn
  } else if (button === "saveBtn") {
    // save category description function
    const found = await knex("jobs.job_details").where("job_id", jobId);
    if (found != 0) {
      knex("jobs.job_details")
        .update({
          role,
          responsibility_1,
          responsibility_2,
          responsibility_3,
          responsibility_4,
          responsibility_5,
          responsibility_6,
          responsibility_7,
          responsibility_8,
          responsibility_9,
          responsibility_10,
          responsibility_11,
          responsibility_12,
          responsibility_13,
          responsibility_14,
          responsibility_15,
          responsibility_16,
          responsibility_17,
          responsibility_18,
          responsibility_19,
          responsibility_20,
          qualification_1,
          qualification_2,
          qualification_3,
          qualification_4,
          qualification_5,
          qualification_6,
          qualification_7,
          qualification_8,
          qualification_9,
          qualification_10,
          qualification_11,
          qualification_12,
          qualification_13,
          qualification_14,
          qualification_15,
          qualification_16,
          qualification_17,
          qualification_18,
          qualification_19,
          qualification_20,
        })
        .where("job_id", jobId)
        .then(() => {
          res.redirect(`/job-details/${jobId}`);
        });
    } else {
      knex("jobs.job_details")
        .insert({
          job_id: jobId,
          role,
          responsibility_1,
          responsibility_2,
          responsibility_3,
          responsibility_4,
          responsibility_5,
          responsibility_6,
          responsibility_7,
          responsibility_8,
          responsibility_9,
          responsibility_10,
          responsibility_11,
          responsibility_12,
          responsibility_13,
          responsibility_14,
          responsibility_15,
          responsibility_16,
          responsibility_17,
          responsibility_18,
          responsibility_19,
          responsibility_20,
          qualification_1,
          qualification_2,
          qualification_3,
          qualification_4,
          qualification_5,
          qualification_6,
          qualification_7,
          qualification_8,
          qualification_9,
          qualification_10,
          qualification_11,
          qualification_12,
          qualification_13,
          qualification_14,
          qualification_15,
          qualification_16,
          qualification_17,
          qualification_18,
          qualification_19,
          qualification_20,
        })
        .where("job_id", jobId)
        .then(() => {
          res.redirect(`/job-details/${jobId}`);
        });
    }
  } else if (button === "deleteBtn") {
    // delete category description function
    // to be continue on wednesday
    knex("jobs.job_details").where("job_id", req.params.job_id).del();
  }
});

module.exports = router;
