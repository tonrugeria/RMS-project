<<<<<<< HEAD
const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const { format } = require("path/posix");
=======
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');
>>>>>>> e63c964a27f30b59f7a14e49e53c4294ee653622

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

// job-requirement route
router.get('/job-requirement', (req, res) => {
  knex('admin.skill')
    .select()
    .then((results) => {
      res.render('jobRequirement', {skill: results });
    });
});

// job-details route
const items = [];
const detailArray = [];
router.get('/job-details', (req, res) => {
        res.render('jobDetails', { newListItems: items, newListDetails: detailArray });
});

router.post('/job-details', (req, res) => {
        const item = req.body.category;
        const btn = req.body.button;
        const itemDetail = req.body.details;
        if (btn === 'detailsBtn') {
                if (!itemDetail) res.redirect('/job-details');
                else {
                        detailArray.push(itemDetail);
                        res.redirect('/job-details');
                }
        } else if (!item) res.redirect('/job-details');
        else {
                items.push(item);
                res.redirect('/job-details');
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
              res.render('users', {users: results });
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
router.get("/careers", (req, res) => {
  knex('jobs.job_details')
       .select()
       .then((results) => {
              res.render('careers', {job_details: results });
       });
});

<<<<<<< HEAD
// careers main page
router.get("/careersmain", (req, res) => {
  knex('jobs.job_opening')
       .select()
       .then((results) => {
              res.render('careersmain', {job_opening: results });
       });
});

=======
// exam creation route
router.get('/examcreation', (req, res) => {
        res.render('examcreation');
});
>>>>>>> 42ed42f62b4fc1e0389fa98ebdd58df96eaaee03
module.exports = router;

