const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const knex = require('../dbconnection');
const upload = require('../middlewares/upload');
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
} = require('../middlewares/auth');

const router = express.Router();

// users
router.get('/users', checkAuthenticated, authRole([4, 1]), async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const users = await knex('admin.users');
  const userRole = await knex('admin.user_role');
  const role = await knex
    .select('')
    .from('admin.user_role')
    .innerJoin('admin.users', 'admin.users.role_id', 'admin.user_role.role_id');

  res.render('users', {
    users,
    role,
    userRole,
    currentUser,
    currentUserId,
    currentUserRole,
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

router.post('/users', upload, async (req, res) => {
  const name = req.body.user_name;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = req.body.role_name;
  const { email } = req.body;
  const image = req.file.filename;
  knex('admin.users')
    .insert({
      user_name: name,
      password: hashedPassword,
      photo: image,
      role_id: role,
      email,
    })
    .then((results) => {
      res.redirect('/users');
    });
});
router.use(express.static('photo'));

router.post('/edit/:user_id', upload, async (req, res) => {
  const { user_name } = req.body;
  const role = req.body.role_name;
  const { email } = req.body;
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
    .where('user_id', req.params.user_id)
    .update({
      user_name,
      role_id: role,
      photo: new_image,
      email,
      password,
    })
    .then((results) => {
      res.redirect('/users');
    });
});
router.use(express.static('photo'));
module.exports = router;
