const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// home route
router.get('/', checkAuthenticated, (req, res) => {
        res.render('index', { username: req.user.username });
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

// job-requirement get route
router.get('/job-requirement', async (req, res) => {
        const skill = await knex('admin.skill').select();
        res.render('jobRequirement', { skill });
});

// job-requirement post route
router.post('/job-requirement', async (req, res) => {
        const job = await knex('jobs.job_opening');
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
        } = req.body;
        knex('jobs.job_opening')
                .insert({
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
                        res.send('/save/9');
                });
});


// job-details get route
router.get('/job-details/:job_id', async (req, res) => {
        const job = await knex.select().from('jobs.job_opening').where('job_id', req.params.job_id);
        const category = await knex('jobs.job_details').where('job_id', req.params.job_id);
        res.render('jobDetails', { catView: category, detailsView: category, job });
        const hello = await knex
                .select('')
                .from('jobs.job_details')
                .innerJoin('jobs.job_opening', 'jobs.job_details.job_id', 'jobs.job_opening.job_id');
});

// job-details post route
router.post('/job-details/:job_id', (req, res) => {
        const { category, button, details } = req.body;
        const jobId = req.params.job_id;
        if (button === 'categoryBtn') {
                if (!category) res.redirect('/job-details/:job_id');
                else {
                        knex('jobs.job_details')
                                .insert({ category_name: category, job_id: jobId })
                                .then(() => {
                                        res.redirect(`/job-details/${jobId}`);
                                });
                }
        } else if (button === 'detailsBtn') {
                if (!details) res.redirect('/job-details');
                else {
                        knex('jobs.job_details')
                                .insert({ item_description: details, job_id: jobId })
                                .then((results) => {
                                        res.redirect(`/job-details/${jobId}`);
                                });
                }
        } else if (button === 'deleteCatDetailBtn') {
                // delete category description function
                res.redirect('/job-details');
        } else if (button === 'saveBtn') {
                // save function
        }
});

// exam route
router.get('/exam', (req, res) => {
        res.render('exam');
});

// settings
router.get('/settings', (req, res) => {
        res.render('settings');
});

// users
router.get('/users', (req, res) => {
        knex('admin.users')
                .select()
                .then((results) => {
                        res.render('users', { users: results });
                });
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

router.post('/examcreation',async(req,res)=>{
        const {questioncategory,questionlevel,questiontimer,
                questiondetail,correctAnswer,choice_1,choice_2,
                choice_3,choice_4}=req.body;
                knex('question.question').insert({
                        question_category:questioncategory,
                        question_level:questionlevel,
                        question_time_limit:questiontimer,
                        question_detail:questiondetail,
                        choice_1:choice_1,
                        choice_2:choice_2,
                        choice_3:choice_3,
                        choice_4:choice_4,
                        correct_answer:correctAnswer
                }).then(()=>{
                        res.send('save')
                })
});
module.exports = router;
