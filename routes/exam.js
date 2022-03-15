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
        res.render('exam', { jobId, adminSkill, question, jobQuestion });
});

// exam post route
router.post('/exam/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const { question_id } = req.body;
        if (typeof question_id != typeof []) {
                knex('jobs.question')
                        .insert({
                                job_id: jobId,
                                question_id,
                        })
                        .then(() => res.redirect(`/exam/${jobId}`));
        } else {
                question_id.forEach((element) => {
                        knex('jobs.question')
                                .insert({
                                        job_id: jobId,
                                        question_id: element,
                                })
                                .then((results) => results);
                });
                res.redirect(`/exam/${jobId}`);
        }
});

module.exports = router;
