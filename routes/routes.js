const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");

const router = express.Router();

// home route
router.get('/', async (req, res) => {
        const job_opening = await knex('jobs.job_opening').select();
        const skill = await knex('admin.skill').select(); 
        res.render('index', {job_opening, skill});
});


// register get route
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

// login get route
router.get("/login", checkNotAuthenticated, (req, res) => {
  knex("admin.users").then((results) => {
    if (results != 0) {
      res.render("login", {
        title: "Log In",
      });
    } else {
      res.redirect("/register");
    }
  });
});

// login post route
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
// register post route
router.post("/register", checkNotAuthenticated, async (req, res) => {
  const { username, password } = req.body;
  const userFound = await knex("admin.users")
    .where({ user_name: username })
    .first()
    .then((row) => {
      if (row) {
        return row.user_name;
      }
      return row;
    });
  if (userFound === username) {
    req.flash("error", "User with that username already exists");
    res.redirect("/register");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      knex("admin.users")
        .insert({
          user_name: username,
          password: hashedPassword,
        })
        .then(() => {
          res.redirect("/login");
        });
    } catch (error) {
      console.log(error);
      req.flash("error", "Cant insert");
      res.redirect("/register");
    }
  }
});

// job-requirement route
router.get('/job-requirement', (req, res) => {
        knex('admin.skill')
                .select()
                .then((results) => {
                        res.render('jobRequirement', { skill: results });
                });
});

// job-details get route
router.get("/job-details/:job_id", async (req, res) => {
  const job = await knex
    .select()
    .from("jobs.job_opening")
    .where("job_id", req.params.job_id);
  const responsi = await knex("jobs.job_details")
    .where("job_id", req.params.job_id)
    .andWhere("category_id", 1);
  const quali = await knex("jobs.job_details")
    .where("job_id", req.params.job_id)
    .andWhere("category_id", 2);
  const role = await knex("jobs.job_details").where(
    "job_id",
    req.params.job_id
  );
  console.log("badtrip",role);
  const jobId = req.params.job_id;
  res.render("jobDetails", { responsi, quali, job, role, jobId });
});

// job-details post route

router.post("/job-details/:job_id", (req, res) => {
  const { responsiDesc, qualiDesc, button, role } = req.body;
  const jobId = req.params.job_id;
  if (button === "roleBtn") {
  } else if (button === "responsiBtn") {
    if (!responsiDesc) res.redirect("/job-details/:job_id");
    else {
      knex("jobs.job_details")
        .insert({
          item_description: responsiDesc,
          job_id: jobId,
          category_id: 1,
          role,
        })
        .then(() => {
          res.redirect(`/job-details/${jobId}`);
        });
    }
  } else if (button === "qualiBtn") {
    if (!qualiDesc) res.redirect("/job-details/:job_id");
    else {
      knex("jobs.job_details")
        .insert({
          item_description: qualiDesc,
          job_id: jobId,
          category_id: 2,
          role,
        })
        .then(() => {
          res.redirect(`/job-details/${jobId}`);
        });
    }
  } else if (button === "saveBtn") {
    // save category description function
    const { role } = req.body
    knex("jobs.job_details")
        .update({
          role
        })
        .where('job_id', jobId)
        .then(() => {
          res.redirect(`/job-details/${jobId}`);
        });
  } else if (button === "deleteBtn") {
    // delete category description function
    //to be continue on wednesday
      knex('jobs.job_details')
      .where('job_id', req.params.job_id)
      .del()
    }
  }
);


// exam route
router.get("/exam/:job_id", (req, res) => {
  const jobId = req.params.job_id;
  res.render("exam", { jobId });
});

// settings
router.get("/settings", (req, res) => {
  res.render("settings");
});

// users
router.get('/users', async (req, res) => {
        const users = await knex('admin.users')
        const userRole = await knex('admin.user_role')
        const role = await knex
                .select('')
                .from('admin.user_role')
                .innerJoin('admin.users', 'admin.users.role_id', 'admin.user_role.role_id');
                
        res.render('users', {users, role , userRole});
//        knex('admin.users', )
//                 .select()
//                 .then((results) => {
//                         res.render('users', { users: results });
//                         console.log('Select users',results);
//                 });
});

// delete/logout route
router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// about route
router.get("/about", (req, res) => {
  res.send("amsdkngowng");
});

// careers page
router.get("/careers", (req, res) => {
  knex("jobs.job_details")
    .select()
    .then((results) => {
      res.render("careers", { job_details: results });
    });
});

// careers main page
router.get('/careersmain', async (req, res) => {
        const job_opening = await knex('jobs.job_opening').select();
        const job_description = await knex('jobs.job_description').select(); 
        res.render('careersmain', {job_opening, job_description});
});


module.exports = router;
