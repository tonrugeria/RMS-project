const express = require('express');
const knex = require('../dbconnection');
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
} = require('../middlewares/auth');

const router = express.Router();

// settings
router.get('/branding', checkAuthenticated, authRole([3, 1]), async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const branding = await knex('admin.branding');

  const items = [
    'Navigation Bar',
    'Menu Text',
    'Menu Text Archive',
    'Nameplate',
    'SideBar',
    'Normal Text',
    'Active Text',
    'Active Background',
    'Hover Background',
    'Dividing Line',
  ];

  const names = items.map((item) => item.replace(/\s/g, '_'));

  res.render('branding', {
    currentUser,
    currentUserId,
    currentUserRole,
    branding,
    items,
    names,
  });
});

router.post('/branding', checkAuthenticated, authRole([3, 1]), async (req, res) => {
  let {
    company_name,
    company_logo,
    login_bg,
    Navigation_Bar,
    Menu_Text,
    Menu_Text_Archive,
    Nameplate,
    SideBar,
    Normal_Text,
    Active_Text,
    Active_Background,
    Hover_Background,
    Dividing_Line,
  } = req.body;

  const branding = await knex('admin.branding');

  if (company_logo == '') {
    company_logo = null;
  }

  if (branding == 0) {
    await knex('admin.branding').insert({ company_name, company_logo });
  } else {
    await knex('admin.branding').update({ company_name, company_logo });
  }

  res.redirect('/branding');
});

module.exports = router;
