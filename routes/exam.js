const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// exam get all question category route
router.get('/exam/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const adminSkill = await knex('admin.skill');
        const jobQuestion = await knex('jobs.question').where('job_id', jobId);
        const question = await knex('question.question');
        const question_jobQuestion = await knex('question.question')
                .leftJoin('jobs.question', 'question.question.question_id', 'jobs.question.question_id')
                .where('job_id', jobId);
        res.render('exam', { jobId, adminSkill, question, jobQuestion, question_jobQuestion });
});

// exam post route
router.post('/exam/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const { question_id } = req.body;
        // checks if a checkbox is selected
        if (question_id != null) {
                // checks if req.body.question_id is not an array
                if (typeof question_id != typeof []) {
                        const questionRow = await knex('jobs.question')
                                .where('job_id', jobId)
                                .andWhere('question_id', question_id);
                        // checks if the question already exists
                        if (questionRow != 0) {
                                res.redirect(`/exam/${jobId}`);
                        } else {
                                knex('jobs.question')
                                        .insert({
                                                job_id: jobId,
                                                question_id,
                                        })
                                        .then(() => res.redirect(`/exam/${jobId}`));
                        }
                } else {
                        // forEach loop when the req.body is an array
                        question_id.forEach(async (question) => {
                                const questionRowClient = await knex('jobs.question')
                                        .where('job_id', jobId)
                                        .andWhere('question_id', question);
                                // checks if the question already exists
                                if (questionRowClient == 0) {
                                        knex('jobs.question')
                                                .insert({
                                                        job_id: jobId,
                                                        question_id: question,
                                                })
                                                .then((results) => results);
                                }
                        });
                        res.redirect(`/exam/${jobId}`);
                }
        } else {
                knex('jobs.question')
                        .where('job_id', jobId)
                        .del()
                        .then(() => {
                                res.redirect(`/exam/${jobId}`);
                        });
        }
});

module.exports = router;
