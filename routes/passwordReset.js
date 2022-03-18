const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// register get route
router.get('/password-reset', (req, res) => {
        res.render('passwordReset');
});

// register post route
router.post('/password-reset', checkNotAuthenticated, async (req, res) => {
        const { user_name, email, password } = req.body;
        const user = await knex('admin.users').where({ user_name, email }).first();
        console.log(user);
        if (user != undefined) {
          var link  = '/login/';
          var message =  'Password reset Successfully!, <a href="'+ link +'"> log in</a>.'
                req.flash('error', message);
                try {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        knex('admin.users')
                                .update({
                                        password: hashedPassword,
                                })
                                .where('user_id', user.user_id)
                                .then(() => {
                                        res.redirect('/password-reset');
                                });
                } catch (error) {
                        req.flash('error', 'Cant update');
                        res.redirect('/register');
                }
        } else {
                req.flash('error', 'Username and Password does not match');
                res.redirect('/password-reset');
        }
});

module.exports = router;