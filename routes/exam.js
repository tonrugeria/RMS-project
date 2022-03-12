const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// exam get route
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
        const jobQuestion = await knex('jobs.question');
        const {
                question_id_1,
                question_id_2,
                question_id_3,
                question_id_4,
                question_id_5,
                question_id_6,
                question_id_7,
                question_id_8,
                question_id_9,
                question_id_10,
                question_id_11,
                question_id_12,
                question_id_13,
                question_id_14,
                question_id_15,
                question_id_16,
                question_id_17,
                question_id_18,
                question_id_19,
                question_id_20,
        } = req.body;
        if (jobQuestion != 0) {
                knex('jobs.question')
                        .update({
                                question_id_1,
                                question_id_2,
                                question_id_3,
                                question_id_4,
                                question_id_5,
                                question_id_6,
                                question_id_7,
                                question_id_8,
                                question_id_9,
                                question_id_10,
                                question_id_11,
                                question_id_12,
                                question_id_13,
                                question_id_14,
                                question_id_15,
                                question_id_16,
                                question_id_17,
                                question_id_18,
                                question_id_19,
                                question_id_20,
                        })
                        .then(() => {
                                res.redirect(`/exam/${jobId}`);
                        });
        } else {
                knex('jobs.question')
                        .insert({
                                job_id: jobId,
                                question_id_1,
                                question_id_2,
                                question_id_3,
                                question_id_4,
                                question_id_5,
                                question_id_6,
                                question_id_7,
                                question_id_8,
                                question_id_9,
                                question_id_10,
                                question_id_11,
                                question_id_12,
                                question_id_13,
                                question_id_14,
                                question_id_15,
                                question_id_16,
                                question_id_17,
                                question_id_18,
                                question_id_19,
                                question_id_20,
                        })
                        .then(() => {
                                res.redirect(`/exam/${jobId}`);
                        });
        }
});

module.exports = router;
