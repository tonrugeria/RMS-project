const express = require('express');
const fs = require('fs');
const knex = require('../dbconnection');
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
} = require('../middlewares/auth');
const multipleUploads = require('../middlewares/multiUploads');

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
  const { company_logo, company_name, login_bg } = branding[0] || {};

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
    company_logo,
    company_name,
    login_bg,
  });
});

router.post(
  '/branding',
  checkAuthenticated,
  multipleUploads,
  authRole([3, 1]),
  async (req, res) => {
    const {
      company_name,
      file1,
      file2,
      old_image1,
      old_image2,
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

    if (branding.length == 0) {
      if (req.files !== 0) {
        await knex('admin.branding').insert({
          company_name,
          company_logo: req.files.file1[0].filename,
          login_bg: req.files.file2[0].filename,
        });
        res.redirect('/branding');
      } else {
        await knex('admin.branding').insert({ company_name });
        res.redirect('/branding');
      }
    } else {
      let new_image1 = '';
      let new_image2 = '';
      if (req.files) {
        if (req.files.file1) {
          new_image1 = req.files.file1[0].filename;
          try {
            fs.unlinkSync(`./company_logo/${req.body.old_image1}`);
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('1no');
          new_image1 = req.body.old_image1;
        }

        if (req.files.file2) {
          new_image2 = req.files.file2[0].filename;
          try {
            fs.unlinkSync(`./company_logo/${req.body.old_image2}`);
          } catch (err) {
            console.log(err);
          }
        } else {
          new_image2 = req.body.old_image2;
        }
      }

      await knex('admin.branding').update({
        company_name,
        company_logo: new_image1,
        login_bg: new_image2,
      });
      res.redirect('/branding');
    }
  }
);

module.exports = router;
