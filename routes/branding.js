const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated, authRole, } = require('../middlewares/auth');

const router = express.Router();

// settings
router.get('/branding', checkAuthenticated, authRole([3, 1]), async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  res.render('branding', { currentUser, currentUserId, currentUserRole });
});

module.exports = router;
