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

// register post route
router.post(
        '/login',
        checkNotAuthenticated,
        passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true,
        })
);

router.post('/register', checkNotAuthenticated, async (req, res) => {
        const { name, password } = req.body;
        const userFound = knex.select('user_name').from('admin.users').where({ user_name: name });
        if (userFound === name) {
                req.flash('error', 'User with that username already exists');
                res.redirect('/register');
        } else {
                try {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        knex('admin.users').insert({ user_name: name, password: hashedPassword });
                        res.redirect('/login');
                } catch (error) {
                        console.log(error);
                        res.redirect('/register');
                }
        }
});

// job-requirement route
router.get('/job-requirement', (req, res) => {
        res.render('jobRequirement');
});

// job-details route
router.get('/job-details', (req, res) => {
        res.render('jobDetails');
});

// exam route
router.get('/exam', (req, res) => {
        res.render('exam');
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

module.exports = router;
