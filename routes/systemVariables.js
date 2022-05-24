const express = require('express');
const knex = require('../dbconnection');
const {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
} = require('../middlewares/auth');

const router = express.Router();

// display
router.get(
  '/system-variables',
  checkAuthenticated,
  authRole([3, 1]),
  async (req, res) => {
    const currentUserId = req.user.user_id;
    const currentUser = await knex('admin.users').where('user_id', currentUserId);
    const currentUserRole = await knex('admin.user_role').where(
      'role_id',
      req.user.role_id
    );
    const position = await knex('admin.job_position');
    const technologies = await knex('admin.skill')
      .where({ skill_status: 'active' })
      .orderBy('skill_id');
    const remarks = await knex('admin.remarks')
      .where({ remark_status: 'active' })
      .orderBy('remark_id');
    const jobType = await knex('admin.job_type')
      .where({ job_type_status: 'active' })
      .orderBy('job_type_id');
    const positionLevel = await knex('admin.position_level')
      .where({ position_level_status: 'active' })
      .orderBy('position_level_id');
    const department = await knex('admin.department')
      .where('dept_status', 'active')
      .orderBy('dept_id');
    const branding = await knex('admin.branding');
    res.render('systemVariables', {
      branding,
      position,
      technologies,
      remarks,
      positionLevel,
      jobType,
      department,
      currentUser,
      currentUserId,
      currentUserRole,
    });
  }
);

// DEPARTMENT
router.post('/addDepartment', async (req, res) => {
  const { department } = req.body;
  await knex('admin.department').insert({
    dept_name: department,
    dept_status: 'active',
  });
  res.redirect('/system-variables');
});

router.post('/system-variables/department/:dept_id', async (req, res) => {
  const departmentId = req.params.dept_id;
  const { departments } = req.body;

  await knex('admin.department')
    .where({ dept_id: departmentId })
    .update({ dept_name: departments });
  res.redirect('/system-variables');
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

// SKILLS
router.post('/addTechnologies', async (req, res) => {
  const { adminSkill, skillType } = req.body;
  await knex('admin.skill').insert({
    skill_name: adminSkill,
    skill_type: skillType,
    skill_status: 'active',
  });
  res.redirect('/system-variables');
});

router.post('/system-variables/skill/:skill_id', async (req, res) => {
  const skillId = req.params.skill_id;
  const { technologies } = req.body;

  await knex('admin.skill')
    .where({ skill_id: skillId })
    .update({ skill_name: technologies });
  res.redirect('/system-variables');
});

router.post('/delete/skill/:skill_id', async (req, res) => {
  const skillId = req.params.skill_id;

  await knex('admin.skill')
    .update({ skill_status: 'inactive' })
    .where('skill_id', skillId);
  res.redirect('/system-variables');
});

// JOB TYPE
router.post('/addTypes', async (req, res) => {
  const jobType = req.body.jobType.toLowerCase();
  const jobTypeArr = jobType.split('-');

  for (let i = 0; i < jobTypeArr.length; i++) {
    jobTypeArr[i] = jobTypeArr[i].charAt(0).toUpperCase() + jobTypeArr[i].slice(1);
  }

  const jobType2 = jobTypeArr.join('-');

  const jobTypeFound = await knex('admin.job_type').where({ job_type_name: jobType2 });

  if (jobTypeFound != 0) {
    const jobTypeFoundLower = jobTypeFound[0].job_type_name.toLowerCase();
    const jobTypeFoundArr = jobTypeFoundLower.split('-');

    for (let i = 0; i < jobTypeFoundArr.length; i++) {
      jobTypeFoundArr[i] =
        jobTypeFoundArr[i].charAt(0).toUpperCase() + jobTypeFoundArr[i].slice(1);
    }

    const jobTypeFound2 = jobTypeFoundArr.join('-');

    if (jobType2 == jobTypeFound2) {
      await knex('admin.job_type')
        .update({
          job_type_name: jobType2,
          job_type_status: 'active',
        })
        .where({ job_type_name: jobType2 });
    }
  } else {
    await knex('admin.job_type').insert({
      job_type_name: jobType2,
      job_type_status: 'active',
    });
  }

  res.redirect('/system-variables');
});

router.post('/system-variables/job-type/:job_type_id', async (req, res) => {
  const jobTypeId = req.params.job_type_id;
  const type = req.body.type.toLowerCase();

  const typeArr = type.split('-');

  for (let i = 0; i < typeArr.length; i++) {
    typeArr[i] = typeArr[i].charAt(0).toUpperCase() + typeArr[i].slice(1);
  }

  const type2 = typeArr.join('-');

  await knex('admin.job_type')
    .where({ job_type_id: jobTypeId })
    .update({ job_type_name: type2 });
  res.redirect('/system-variables');
});

router.post('/delete/type/:job_type_id', async (req, res) => {
  const jobTypeId = req.params.job_type_id;
  await knex('admin.job_type')
    .update({ job_type_status: 'inactive' })
    .where('job_type_id', jobTypeId);
  res.redirect('/system-variables');
});

// CAREER LEVEL
router.post('/addCareer', async (req, res) => {
  const positionLevel = req.body.positionLevel.toLowerCase();
  const positionLevelArr = positionLevel.split(' ');

  for (let i = 0; i < positionLevelArr.length; i++) {
    positionLevelArr[i] = positionLevelArr[i].charAt(0).toUpperCase() + positionLevelArr[i].slice(1);
  }

  const positionLevel2 = positionLevelArr.join(' ');

  const positionLevelFound = await knex('admin.position_level').where({ position_level_name: positionLevel2 });

  if (positionLevelFound != 0) {
    const positionLevelFoundLower = positionLevelFound[0].position_level_name.toLowerCase();
    const positionLevelFoundArr = positionLevelFoundLower.split(' ');

    for (let i = 0; i < positionLevelFoundArr.length; i++) {
      positionLevelFoundArr[i] =
        positionLevelFoundArr[i].charAt(0).toUpperCase() + positionLevelFoundArr[i].slice(1);
    }

    const positionLevelFound2 = positionLevelFoundArr.join(' ');

    if (positionLevel2 == positionLevelFound2) {
      await knex('admin.position_level')
        .update({
          position_level_name: positionLevel2,
          position_level_status: 'active',
        })
        .where({ position_level_name: positionLevel2 });
    }
  } else {
    await knex('admin.position_level').insert({
      position_level_name: positionLevel2,
      position_level_status: 'active',
    });
  }

  res.redirect('/system-variables');
});

router.post('/system-variables/career-level/:position_level_id', async (req, res) => {
  const positionLevelId = req.params.position_level_id;
  const career = req.body.career;

  const careerArr = career.split(' ');

  for (let i = 0; i < careerArr.length; i++) {
    careerArr[i] = careerArr[i].charAt(0).toUpperCase() + careerArr[i].slice(1);
  }

  const career2 = careerArr.join(' ');

  await knex('admin.position_level')
    .where({ position_level_id: positionLevelId })
    .update({ position_level_name: career2 });
  res.redirect('/system-variables');
});

router.post('/delete/career-level/:position_level_id', async (req, res) => {
  const positionLevelId = req.params.position_level_id;
  await knex('admin.position_level')
    .update({ position_level_status: 'inactive' })
    .where('position_level_id', positionLevelId);
  res.redirect('/system-variables');
});

// REMARKS
router.post('/addRemarks', async (req, res) => {
  const remark = req.body.remark.toLowerCase();
  const remarkArr = remark.split(' ');

  for (let i = 0; i < remarkArr.length; i++) {
    remarkArr[i] = remarkArr[i].charAt(0).toUpperCase() + remarkArr[i].slice(1);
  }

  const remark2 = remarkArr.join(' ');

  const remarkFound = await knex('admin.remarks').where({ remark_name: remark2 });

  if (remarkFound != 0) {
    const remarkFoundLower = remarkFound[0].remark_name.toLowerCase();
    const remarkFoundArr = remarkFoundLower.split(' ');

    for (let i = 0; i < remarkFoundArr.length; i++) {
      remarkFoundArr[i] =
        remarkFoundArr[i].charAt(0).toUpperCase() + remarkFoundArr[i].slice(1);
    }

    const remarkFound2 = remarkFoundArr.join(' ');

    if (remark2 == remarkFound2) {
      await knex('admin.remarks')
        .update({
          remark_name: remark2,
          remark_status: 'active',
        })
        .where({ remark_name: remark2 });
    }
  } else {
    await knex('admin.remarks').insert({
      remark_name: remark2,
      remark_status: 'active',
    });
  }

  res.redirect('/system-variables');
});

router.post('/system-variables/remark/:remark_id', async (req, res) => {
  const remarkId = req.params.remark_id;
  const { remarks } = req.body;

  await knex('admin.remarks')
    .where({ remark_id: remarkId })
    .update({ remark_name: remarks });
  res.redirect('/system-variables');
});

router.post('/delete/remark/:remark_id', async (req, res) => {
  const remarkId = req.params.remark_id;
  await knex('admin.remarks')
    .update({ remark_status: 'inactive' })
    .where('remark_id', remarkId);
  res.redirect('/system-variables');
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

module.exports = router;
