const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// home route
router.get('/', checkAuthenticated, async (req, res) => {
        const job_opening = await knex('jobs.job_opening').select();
        const skill = await knex('admin.skill').select();
        res.render('index', { job_opening, skill });
});

// register get route
router.get('/register', checkNotAuthenticated, (req, res) => {
        res.render('register');
});

// login get route
router.get('/login', checkNotAuthenticated, (req, res) => {
        knex('admin.users').then((results) => {
                if (results != 0) {
                        res.render('login', {
                                title: 'Log In',
                        });
                } else {
                        res.redirect('/register');
                }
        });
});

// login post route
router.post(
        '/login',
        checkNotAuthenticated,
        passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true,
        })
);
// register post route
router.post('/register', checkNotAuthenticated, async (req, res) => {
        const { username, password } = req.body;
        const userFound = await knex('admin.users')
                .where({ user_name: username })
                .first()
                .then((row) => {
                        if (row) {
                                return row.user_name;
                        }
                        return row;
                });
        if (userFound === username) {
                req.flash('error', 'User with that username already exists');
                res.redirect('/register');
        } else {
                try {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        knex('admin.users')
                                .insert({
                                        user_name: username,
                                        password: hashedPassword,
                                })
                                .then(() => {
                                        res.redirect('/login');
                                });
                } catch (error) {
                        console.log(error);
                        req.flash('error', 'Cant insert');
                        res.redirect('/register');
                }
        }
});

function uniqueId(jobIdColumn) {
        const len = jobIdColumn.length;
        if (jobIdColumn != 0) {
                return jobIdColumn[len - 1].job_id + 1;
        }
        return 1;
}

// job-requirement get route

router.get('/job-requirement', async (req, res) => {
        const adminSkill = await knex('admin.skill');
        const dept = await knex('admin.department');
        const jobType = await knex('admin.job_type');
        const job = await knex('jobs.job_opening');
        const hrAssessment = await knex('admin.remarks');
        const jobQuestion = await knex('jobs.question');
        const question = await knex('question.question');
        const unique = uniqueId(job);
        res.render('jobRequirement', { adminSkill, dept, jobType, job, unique, hrAssessment, question, jobQuestion });
});

// job-requirement post route
router.post('/job-requirement', async (req, res) => {
        const {
                jobId,
                jobTitle,
                department,
                salaryRange,
                careerLevel,
                workType,
                jobDesc,
                yearsOfExp,
                examScore,
                hrAssessment,
                skill_id_1,
                skill_level_1,
                skill_id_2,
                skill_level_2,
        } = req.body;
        knex('jobs.job_opening')
                .insert({
                        job_id: jobId,
                        job_title: jobTitle,
                        job_dept: department,
                        max_salary: salaryRange,
                        position_level: careerLevel,
                        job_type: workType,
                        job_description: jobDesc,
                        min_years_experience: yearsOfExp,
                        exam_score: examScore,
                        hr_rating: hrAssessment,
                })
                .then(() => {
                        knex('jobs.skill')
                                .insert({
                                        job_id: jobId,
                                        skill_id_1,
                                        skill_level_1,
                                        skill_id_2,
                                        skill_level_2,
                                })
                                .then(() => {
                                        res.redirect(`/job-requirement/${jobId}`);
                                });
                });
});

// job-requirement update get route
router.get('/job-requirement/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const adminSkill = await knex('admin.skill');
        const dept = await knex('admin.department');
        const jobType = await knex('admin.job_type');
        const hrRemarks = await knex('admin.remarks');
        const jobSkill = await knex('jobs.skill').where('job_id', jobId);
        const job = await knex('jobs.job_opening').where('job_id', jobId);
        const unique = jobId;
        res.render('editJobRequirement', { adminSkill, dept, jobType, job, unique, jobId, hrRemarks, jobSkill });
});

// job-requirement update post route
router.post('/job-requirement/:job_id', async (req, res) => {
        const jobId = req.params.job_id;
        const {
                jobTitle,
                department,
                salaryRange,
                careerLevel,
                workType,
                jobDesc,
                yearsOfExp,
                examScore,
                hrAssessment,
                skill_id_1,
                skill_level_1,
                skill_id_2,
                skill_level_2,
                skill_id_3,
                skill_level_3,
                skill_id_4,
                skill_level_4,
                skill_id_5,
                skill_level_5,
                skill_id_6,
                skill_level_6,
                skill_id_7,
                skill_level_7,
                skill_id_8,
                skill_level_8,
                skill_id_9,
                skill_level_9,
                skill_id_10,
                skill_level_10,
                skill_id_11,
                skill_level_11,
                skill_id_12,
                skill_level_12,
                skill_id_13,
                skill_level_13,
                skill_id_14,
                skill_level_14,
                skill_id_15,
                skill_level_15,
                skill_id_16,
                skill_level_16,
                skill_id_17,
                skill_level_17,
                skill_id_18,
                skill_level_18,
                skill_id_19,
                skill_level_19,
                skill_id_20,
                skill_level_20,
        } = req.body;
        knex('jobs.job_opening')
                .update({
                        job_title: jobTitle,
                        job_dept: department,
                        max_salary: salaryRange,
                        position_level: careerLevel,
                        job_type: workType,
                        job_description: jobDesc,
                        min_years_experience: yearsOfExp,
                        exam_score: examScore,
                        hr_rating: hrAssessment,
                })
                .where('job_id', jobId)
                .then(() => {
                        knex('jobs.skill')
                                .update({
                                        skill_id_1,
                                        skill_level_1,
                                        skill_id_2,
                                        skill_level_2,
                                        skill_id_3,
                                        skill_level_3,
                                        skill_id_4,
                                        skill_level_4,
                                        skill_id_5,
                                        skill_level_5,
                                        skill_id_6,
                                        skill_level_6,
                                        skill_id_7,
                                        skill_level_7,
                                        skill_id_8,
                                        skill_level_8,
                                        skill_id_9,
                                        skill_level_9,
                                        skill_id_10,
                                        skill_level_10,
                                        skill_id_11,
                                        skill_level_11,
                                        skill_id_12,
                                        skill_level_12,
                                        skill_id_13,
                                        skill_level_13,
                                        skill_id_14,
                                        skill_level_14,
                                        skill_id_15,
                                        skill_level_15,
                                        skill_id_16,
                                        skill_level_16,
                                        skill_id_17,
                                        skill_level_17,
                                        skill_id_18,
                                        skill_level_18,
                                        skill_id_19,
                                        skill_level_19,
                                        skill_id_20,
                                        skill_level_20,
                                })
                                .where('job_id', jobId)
                                .then(() => {
                                        res.redirect(`/job-requirement/${jobId}`);
                                });
                });
});

// job-details get route
router.get('/job-details/:job_id', async (req, res) => {
        const job = await knex.select().from('jobs.job_opening').where('job_id', req.params.job_id);
        const jobDetail = await knex('jobs.job_details').where('job_id', req.params.job_id);
        const jobId = req.params.job_id;
        res.render('jobDetails', { job, jobDetail, jobId });
});

// job-details post route
router.post('/job-details/:job_id', async (req, res) => {
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
        if (button === 'add_responsibility_btn') {
                // add btn
        } else if (button === 'qualificationBtn') {
                // btn
        } else if (button === 'saveBtn') {
                // save category description function
                const found = await knex('jobs.job_details').where('job_id', jobId);
                if (found != 0) {
                        knex('jobs.job_details')
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
                                .where('job_id', jobId)
                                .then(() => {
                                        res.redirect(`/job-details/${jobId}`);
                                });
                } else {
                        knex('jobs.job_details')
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
                                .where('job_id', jobId)
                                .then(() => {
                                        res.redirect(`/job-details/${jobId}`);
                                });
                }
        } else if (button === 'deleteBtn') {
                // delete category description function
                // to be continue on wednesday
                knex('jobs.job_details').where('job_id', req.params.job_id).del();
        }
});

// exam route
router.get('/exam/:job_id', (req, res) => {
        const jobId = req.params.job_id;
        res.render('exam', { jobId });
});

// settings
router.get('/settings', (req, res) => {
        res.render('settings');
});

// users
router.get('/users', async (req, res) => {
        const users = await knex('admin.users');
        const userRole = await knex('admin.user_role');
        const role = await knex
                .select('')
                .from('admin.user_role')
                .innerJoin('admin.users', 'admin.users.role_id', 'admin.user_role.role_id');

        res.render('users', { users, role, userRole });
        //        knex('admin.users', )
        //                 .select()
        //                 .then((results) => {
        //                         res.render('users', { users: results });
        //                         console.log('Select users',results);
        //                 });
});
// delete user
router.get('/delete/:user_id', (req, res) => {
        knex('admin.users')
                .where('user_id', req.params.user_id)
                .del()
                .then((results) => {
                        res.redirect('/users');
                });
});

// add user
router.post('/users', async (req, res) => {
        const name = req.body.user_name;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = req.body.role_name;
        const { email } = req.body;
        knex('admin.users')
                .insert({ user_name: name, password: hashedPassword, role_id: role, email })
                .then((results) => {
                        res.redirect('/users');
                });
});
// delete/logout route
router.delete('/logout', (req, res) => {
        req.logOut();
        res.redirect('/login');
});

// about route
router.get('/about', (req, res) => {
        res.send('amsdkngowng');
});

// careers page
router.get('/careers', (req, res) => {
        knex('jobs.job_details')
                .select()
                .then((results) => {
                        res.render('careers', { job_details: results });
                });
});

// careers main page

router.get('/careersmain', async (req, res) => {
        const job_opening = await knex('jobs.job_opening').select();
        const job_description = await knex('jobs.job_description').select();
        res.render('careersmain', { job_opening, job_description });
});
router.get('/careersmain', (req, res) => {
        knex('jobs.job_opening')
                .select()
                .then((results) => {
                        res.render('careersmain', { job_opening: results });
                });
});

// route for examcreation
router.get('/examcreation', async (req, res) => {
        const question = await knex('question.question').select();
        const skill = await knex('admin.skill').select();
        res.render('examcreation', { question, skill });
});

router.post('/examcreation', async (req, res) => {
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
        knex('question.question')
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
                        res.redirect('/examcreation');
                });
});
// delete exam
router.get('/deleteExam/:question_id', (req, res) => {
        knex('question.question')
                .where('question_id', req.params.question_id)
                .del()
                .then((results) => {
                        res.redirect('/examcreation');
                });
});

module.exports = router;
