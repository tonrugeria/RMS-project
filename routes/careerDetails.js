const express = require("express");
const knex = require("../dbconnection");
const router = express.Router();

// careers page
router.get("/careers/job/:job_id", (req, res) => {
  const jobId = req.params.job_id
  knex("jobs.job_details")
    .select()
    .where('job_id', jobId)
    .then((results) => {
      res.render("careerDetails", { job_details: results, jobId });
    });
});

module.exports = router;
