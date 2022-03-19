const express = require("express");
const knex = require("../dbconnection");
const moment = require("moment");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// careers main page
router.get("/careers", async (req, res) => {
  const job_opening = await knex("jobs.job_opening");
  const admin_department = await knex('admin.department');
  const skill = await knex("jobs.skill");
  const date = job_opening[0].date_opened;
 const date_opened = moment(date).format("Do MMMM YYYY")
console.log(date_opened);

  res.render("careers", { job_opening, skill,admin_department, date_opened});
});

module.exports = router;
