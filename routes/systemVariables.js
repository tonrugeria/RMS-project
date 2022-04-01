const express = require('express');
const knex = require('../dbconnection');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// display
router.get('/system-variables', checkAuthenticated, async (req, res) => {
  const currentUserId = req.user.user_id;
  const currentUser = await knex('admin.users').where('user_id', currentUserId);
  const currentUserRole = await knex('admin.user_role').where(
    'role_id',
    req.user.role_id
  );
  const position = await knex('admin.job_position');
  const technologies = await knex('admin.skill').orderBy('skill_id');
  const remarks = await knex('admin.remarks').orderBy('remark_id');
  const jobType = await knex('admin.job_type').orderBy('job_type_id');
  const department = await knex('admin.department')
    .where('dept_status', 'active')
    .orderBy('dept_id');
  res.render('systemVariables', {
    position,
    technologies,
    remarks,
    jobType,
    department,
    currentUser,
    currentUserId,
    currentUserRole,
  });
});

// POSITION
// router.post('/addPosition', async (req, res) => {
//   const { jobPosition } = req.body;
//   await knex('admin.job_position')
//     .insert({
//       position_name: jobPosition,
//     })
//     .then((result) => {
//       res.redirect('/system-variables');
//     });
// });

// router.post('/delete/position/:position_id', async (req, res) => {
//   const positionId = req.params.position_id;
//   await knex('admin.job_position')
//     .where('position_id', positionId)
//     .del()
//     .then((result) => {
//       res.redirect('/system-variables');
//     });
// });

// SKILLS
router.post('/addTechnologies', (req, res) => {
  const { adminSkill, skillType } = req.body;
  knex('admin.skill')
    .insert({
      skill_name: adminSkill,
      skill_type: skillType,
    })
    .then((result) => {
      res.redirect('/system-variables');
    });
});

router.post('/system-variables/skill/:skill_id', async (req, res) => {
  const skillId = req.params.skill_id;
  const { technologies } = req.body;

  knex('admin.skill')
    .where({ skill_id: skillId })
    .update({ skill_name: technologies })
    .then(() => {
      res.redirect('/system-variables');
    });
});

router.post('/delete/skill/:skill_id', async (req, res) => {
  const skillId = req.params.skill_id;
  await knex('job_application.applicant_rating')
    .where('skill_id', skillId)
    .del()
    .then(() => {
      knex('jobs.skill')
        .where('skill_id', skillId)
        .del()
        .then(() => {
          knex('admin.skill')
            .where('skill_id', skillId)
            .del()
            .then((result) => {
              console.log('RESULT', result);
              res.redirect('/system-variables');
            });
        });
    });
});

// REMARKS
router.post('/addRemarks', async (req, res) => {
  const { remark } = req.body;
  await knex('admin.remarks')
    .insert({
      remark_name: remark,
    })
    .then((result) => {
      res.redirect('/system-variables');
    });
});

router.post('/system-variables/remark/:remark_id', async (req, res) => {
  const remarkId = req.params.remark_id;
  const { remarks } = req.body;

  knex('admin.remarks')
    .where({ remark_id: remarkId })
    .update({ remark_name: remarks })
    .then(() => {
      res.redirect('/system-variables');
    });
});

router.post('/delete/remark/:remark_id', async (req, res) => {
  const remarkId = req.params.remark_id;
  await knex('admin.remarks')
    .where('remark_id', remarkId)
    .del()
    .then((result) => {
      res.redirect('/system-variables');
    });
});

// JOB TYPE
router.post('/addTypes', async (req, res) => {
  const { jobType } = req.body;
  await knex('admin.job_type')
    .insert({
      job_type_name: jobType,
    })
    .then((result) => {
      res.redirect('/system-variables');
    });
});

router.post('/system-variables/job-type/:job_type_id', async (req, res) => {
  const jobTypeId = req.params.job_type_id;
  const { type } = req.body;

  knex('admin.job_type')
    .where({ job_type_id: jobTypeId })
    .update({ job_type_name: type })
    .then(() => {
      res.redirect('/system-variables');
    });
});

router.post('/delete/type/:job_type_id', async (req, res) => {
  const jobTypeId = req.params.job_type_id;
  await knex('admin.job_type')
    .where('job_type_id', jobTypeId)
    .del()
    .then((result) => {
      res.redirect('/system-variables');
    });
});

// DEPARTMENT
router.post('/addDepartment', async (req, res) => {
  const { department } = req.body;
  await knex('admin.department')
    .insert({
      dept_name: department,
      dept_status: 'active',
    })
    .then((result) => {
      res.redirect('/system-variables');
    });
});

router.post('/system-variables/department/:dept_id', async (req, res) => {
  const departmentId = req.params.dept_id;
  const { departments } = req.body;

  knex('admin.department')
    .where({ dept_id: departmentId })
    .update({ dept_name: departments })
    .then(() => {
      res.redirect('/system-variables');
    });
});

router.post('/delete/department/:dept_id', async (req, res) => {
  const departmentId = req.params.dept_id;
  const deptJobs = await knex('jobs.job_opening').where('job_dept', departmentId);

  try {
    await knex('admin.department')
      .where('dept_id', departmentId)
      .update({ dept_status: 'inactive' });
    res.redirect('/system-variables');
  } catch (err) {
    console.log(err);
    res.redirect('/system-variables');
  }
});

module.exports = router;
