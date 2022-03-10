const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// exam route
router.get("/exam/:job_id", (req, res) => {
  const jobId = req.params.job_id;
  res.render("exam", { jobId });
});

module.exports = router;
