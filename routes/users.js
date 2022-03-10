const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

// users
router.get("/users", async (req, res) => {
  const users = await knex("admin.users");
  const userRole = await knex("admin.user_role");
  const role = await knex
    .select("")
    .from("admin.user_role")
    .innerJoin("admin.users", "admin.users.role_id", "admin.user_role.role_id");

  res.render("users", { users, role, userRole });
  //        knex('admin.users', )
  //                 .select()
  //                 .then((results) => {
  //                         res.render('users', { users: results });
  //                         console.log('Select users',results);
  //                 });
});
// delete user
router.get("/delete/:user_id", (req, res) => {
  knex("admin.users")
    .where("user_id", req.params.user_id)
    .del()
    .then((results) => {
      res.redirect("/users");
    });
});

// add user
router.post("/users", async (req, res) => {
  const name = req.body.user_name;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = req.body.role_name;
  const { email } = req.body;
  knex("admin.users")
    .insert({ user_name: name, password: hashedPassword, role_id: role, email })
    .then((results) => {
      res.redirect("/users");
    });
});

module.exports = router;
