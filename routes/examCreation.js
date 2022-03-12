const express = require("express");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// route for examcreation
router.get("/examcreation", async (req, res) => {
  const question = await knex("question.question").select();
  const skill = await knex("admin.skill").select();
  res.render("examcreation", { question, skill });
});

// exam creation post
router.post("/examcreation", async (req, res) => {
  const {
    questioncategory,
    questionlevel,
    questiontimer,
    questiondetail,
    correctAnswer,
    choice_1,
    choice_2,
    choice_3,
    choice_4,
  } = req.body;
  knex("question.question")
    .insert({
      question_category: questioncategory,
      question_level: questionlevel,
      question_time_limit: questiontimer,
      question_detail: questiondetail,
      choice_1,
      choice_2,
      choice_3,
      choice_4,
      correct_answer: correctAnswer,
    })
    .then(() => {
      res.redirect("/examcreation");
    });
});

// delete exam
router.get("/deleteExam/:question_id", (req, res) => {
  knex("question.question")
    .where("question_id", req.params.question_id)
    .del()
    .then((results) => {
      res.redirect("/examcreation");
    });
});

module.exports = router;
