const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/userProfile', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  res.render('userProfile', { currentUser, currentUserId, currentUserRole });
});

router.post('/userProfile', upload, async (req, res) => {
  const { user_name, email } = req.body;
  let { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (password[0] !== '$') {
    password = hashedPassword;
  }

  let new_image = '';
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync(`./photo/${req.body.old_image}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  knex('admin.users')
    .where('user_id', req.user.user_id)
    .update({
      user_name,
      photo: new_image,
      email,
      password,
    })
    .then((results) => {
      req.flash('error', 'Your Profile succesully updated');
      res.redirect('/userProfile');
    });
});

module.exports = router;
