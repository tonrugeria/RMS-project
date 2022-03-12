const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// display
router.get("/system-variables", async (req, res) => {
  const position = await knex("admin.job_position");
  const technologies = await knex("admin.skill");
  const remarks = await knex("admin.remarks");
  const jobType = await knex("admin.job_type");
  const department = await knex("admin.department");
  res.render("systemVariables", {
    position, 
    technologies, 
    remarks, 
    jobType, 
    department
  });
});

// POSITION
router.post("/addPosition", (req, res) => {
  const { jobPosition } = req.body;
  knex("admin.job_position")
    .insert({
      position_name: jobPosition
    })
    .then((result) => {
      res.redirect("/system-variables");
    });
});

router.post("/delete/position/:position_id", (req, res) => {
  const positionId = req.params.position_id;
  knex("admin.job_position")
    .where("position_id", positionId)
    .del()
    .then((result) => {
      res.redirect("/system-variables");
    });
});

// TECHNOLOGIES
router.post("/addTechnologies", (req, res) => {
  const { adminSkill } = req.body;
  knex("admin.skill")
    .insert({
      skill_name: adminSkill
    })
    .then((result) => {
      res.redirect("/system-variables");
    });
});

router.post("/delete/skill/:skill_id", (req, res) => {
  const skillId = req.params.skill_id;
  const skills = knex("admin.skill")
    .where("skill_id", skillId)
    .del()
    .then((result) => {
      console.log("RESULT", result);
      res.redirect("/system-variables");
    });
    console.log("SKILL", skills);
});

// REMARKS
router.post("/addRemarks", (req, res) => {
  const { remark } = req.body;
  knex("admin.remarks")
    .insert({
      remark_name: remark
    })
    .then((result) => {
      res.redirect("/system-variables");
    });
});

router.post("/delete/remark/:remark_id", (req, res) => {
  const remarkId = req.params.remark_id;
  knex("admin.remarks")
    .where("remark_id", remarkId)
    .del()
    .then((result) => {
      res.redirect("/system-variables");
    });
});

// JOB TYPE
router.post("/addTypes", (req, res) => {
  const { jobType } = req.body;
  knex("admin.job_type")
    .insert({
      job_type_name: jobType
    })
    .then((result) => {
      res.redirect("/system-variables");
    });
});

router.post("/delete/type/:job_type_id", (req, res) => {
  const jobTypeId = req.params.job_type_id;
  knex("admin.job_type")
    .where("job_type_id", jobTypeId)
    .del()
    .then((result) => {
      res.redirect("/system-variables");
    });
});

// DEPARTMENT
router.post("/addDepartment", (req, res) => {
  const { department } = req.body;
  knex("admin.department")
    .insert({
      dept_name: department
    })
    .then((result) => {
      res.redirect("/system-variables");
    });
});

router.post("/delete/department/:dept_id", (req, res) => {
  const departmentId = req.params.dept_id;
  knex("admin.department")
    .where("dept_id", departmentId)
    .del()
    .then((result) => {
      res.redirect("/system-variables");
    });
});

module.exports = router;
