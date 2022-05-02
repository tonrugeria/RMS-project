const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
const knex = require('../dbconnection');
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
} = require('../middlewares/auth');

const router = express.Router();

// admin job listing get route
router.get('/', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const branding = await knex('admin.branding');
  const admin_department = await knex('admin.department').where({
    dept_status: 'active',
  });
  const jobOpening = await knex('jobs.job_opening')
    .leftJoin('admin.department', 'jobs.job_opening.job_dept', 'admin.department.dept_id')
    .orderBy('job_id')
    .where({
      dept_status: 'active',
    });
  const date = [];
  jobOpening.forEach((job) =>
    date.push({
      job_id: job.job_id,
      date: moment(job.date_opened).format('DD MMMM YYYY'),
    })
  );
  const jobSkill = await knex('jobs.job_opening')
    .innerJoin('jobs.skill', 'jobs.job_opening.job_id', 'jobs.skill.job_id')
    .innerJoin('admin.skill', 'jobs.skill.skill_id', 'admin.skill.skill_id');
  const jobApplications = await knex('job_application.applicant_details').innerJoin(
    'jobs.job_opening',
    'job_application.applicant_details.job_id',
    'jobs.job_opening.job_id'
  );
  if (currentUserRole[0].role_id === 2) {
    res.redirect('/application');
  } else {
    res.render('index', {
      jobOpening,
      admin_department,
      jobSkill,
      jobApplications,
      currentUser,
      currentUserId,
      currentUserRole,
      branding,
      date,
    });
  }
});

// admin job listing post route
router.post('/job/:job_id/status', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const today = new Date();
  const thisDay = moment(today, 'MM/DD/YYYY');
  const jobId = req.params.job_id;
  const { status } = req.body;

  if (typeof status != typeof []) {
    await knex('jobs.job_opening').update({ status }).where({ job_id: jobId });
    if (status == 0) {
      await knex('jobs.job_opening').where({ job_id: jobId }).update({
        date_opened: thisDay,
        last_date_updated: thisDay,
        last_updated_by: currentUserId,
      });
    } else {
      await knex('jobs.job_opening').where({ job_id: jobId }).update({
        date_opened: null,
        last_date_updated: thisDay,
        last_updated_by: currentUserId,
      });
    }
  } else {
    status.forEach(async (item) => {
      await knex('jobs.job_opening').update({ status: item }).where({ job_id: jobId });
      if (item == 0) {
        await knex('jobs.job_opening').where({ job_id: jobId }).update({
          date_opened: thisDay,
          last_date_updated: thisDay,
          last_updated_by: currentUserId,
        });
      } else {
        await knex('jobs.job_opening').where({ job_id: jobId }).update({
          date_opened: null,
          last_date_updated: thisDay,
          last_updated_by: currentUserId,
        });
      }
    });
  }

  res.redirect('/');
});

// register get route
router.get('/register', checkNotAuthenticated, async (req, res) => {
  const superAdmin = await knex('admin.users').where({ role_id: 3 });
  if (superAdmin == 0) {
    res.render('register');
  } else {
    res.redirect('/login');
  }
});

// register post route
router.post('/register', checkNotAuthenticated, async (req, res) => {
  const { username, email, password } = req.body;
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
      const userRoles = await knex('admin.user_role');
      if (userRoles == 0) {
        const roles = [
          { role_id: 1, role_name: 'Admin' },
          { role_id: 2, role_name: 'Reviewer' },
          { role_id: 3, role_name: 'Super Admin' },
        ];
        roles.forEach((role) => {
          knex('admin.user_role')
            .insert({ role_id: role.role_id, role_name: role.role_name })
            .then((results) => results);
        });
      }
      const today = new Date();
      const thisDay = moment(today, 'MM/DD/YYYY');
      knex('admin.users')
        .insert({
          date_created: thisDay,
          date_last_updated: thisDay,
          user_name: username,
          email,
          password: hashedPassword,
          role_id: 3,
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

// login get route
router.get('/login', checkNotAuthenticated, async (req, res) => {
  const user = knex('admin.users');
  knex('admin.users')
    .where('role_id', 3)
    .then((results) => {
      if (results != 0) {
        res.render('login', {
          title: 'Log In',
          user,
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

// delete/logout route
router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

// load data

module.exports = router;
