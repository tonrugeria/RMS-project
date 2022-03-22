const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

function uniqueId(questionIdColumn) {
        const arrayOfIds = questionIdColumn.map((question) => question.question_id);
        if (questionIdColumn != 0) {
          return Math.max(...arrayOfIds) + 1;
        }
        return 1;
      }

// get route for examcreation
router.get('/examcreation', async (req, res) => {

        
        const question = await knex('question.question').select();
        const questionId = uniqueId(question);
        const skill = await knex('admin.skill').select();   
        const qSkill = await knex('admin.skill').innerJoin(
                'question.question',
                'admin.skill.skill_name',
                'question.question.question_category'
        );
        res.render('examcreation', { question, skill, qSkill, questionId});
});

// post route examcreation
router.post('/examcreation', async (req, res) => {
        const {
                question_id,
                questiontype,
                questioncategory,
                questionlevel,
                questiontimer,
                questiondetail,
                correctAnswer,
                choice_1,
                choice_2,
                choice_3,
                choice_4,
                value_1,
                value_2,
                value_3,
                value_4
        } = req.body;
        knex('question.question')
                .insert({
                        question_id:question_id,
                        question_type:questiontype,
                        question_category: questioncategory,
                        question_level: questionlevel,
                        question_time_limit: questiontimer,
                        question_detail: questiondetail,
                        choice_1,
                        choice_2,
                        choice_3,
                        choice_4,
                        correct_answer: correctAnswer,
                        choice_1_value: value_1,
                        choice_2_value: value_2,
                        choice_3_value: value_3,
                        choice_4_value: value_4
                })
                .then(() => {
                        res.redirect(`/examcreation/${questioncategory}/${question_id}`);
                });
});


// edit get route for examcreation
router.get('/examcreation/:question_category/:question_id', async (req, res) => {
        const questionId = req.params.question_id;
        const questionCategory = req.params.question_category;
        const allQuestions = await knex('question.question');
        const allCategoryQuestion = await knex('question.question').where('question_category', questionCategory);
        const question = await knex('question.question').where('question_id', questionId);
        const skill = await knex('admin.skill');
        const qSkill = await knex('admin.skill').innerJoin(
                'question.question',
                'admin.skill.skill_name',
                'question.question.question_category'
        
        );
        if (allCategoryQuestion == 0){
                res.redirect('/examcreation')
        }
        else{
                res.render('editExamCreation', { question, skill, questionId, qSkill, questionCategory, allQuestions, allCategoryQuestion});
        }
        

});

// edit post route
router.post('/examcreation/:question_id', async (req, res) => {
        const questionId = req.params.question_id;
        const {
                questiontype,
                questioncategory,
                questionlevel,
                questiontimer,
                questiondetail,
                correctAnswer,
                choice_1,
                choice_2,
                choice_3,
                choice_4,
                value_1,
                value_2,
                value_3,
                value_4
        } = req.body;
        knex('question.question')
                .update({
                        question_type: questiontype,
                        question_category: questioncategory,
                        question_level: questionlevel,
                        question_time_limit: questiontimer,
                        question_detail: questiondetail,
                        choice_1,
                        choice_2,
                        choice_3,
                        choice_4,
                        correct_answer: correctAnswer,
                        choice_1_value: value_1,
                        choice_2_value: value_2,
                        choice_3_value: value_3,
                        choice_4_value: value_4
                })
                .where('question_id', questionId)
                .then(() => {
                        res.redirect(`/examcreation/${questioncategory}/${questionId}`);
                });
});

// delete exam
router.get('/deleteExam/:question_category/:question_id',  (req, res) => {
        const questionCategory = req.params.question_category;
        const questionId = req.params.question_id;
        knex('question.question')
                .where('question_category', questionCategory)
                .andWhere('question_id', questionId)
                .del()
                .then ( async(results) => {
                        const nextQuestionId = await knex('question.question').where('question_category', questionCategory).first().then((question) => question.question_id);
                
                        if(question_id = undefined ){
                                nextQuestionId=0;
                        }
                        else{
                                
                        }
                        if (nextQuestionId == 0){
                                
                                res.redirect('/examcreation')
                        }
                        else{
                                
                                
                                res.redirect(`/examcreation/${questionCategory}/${nextQuestionId}`);
                        }
                        console.log(nextQuestionId);
                });
});

module.exports = router;
