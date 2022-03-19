const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../dbconnection");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");
const router = express.Router();

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

// delete user
router.get("/delete/:user_id", (req, res) => {
knex("admin.users")
.where("user_id", req.params.user_id)
.del()
.then((results) => {
res.redirect("/users");
});
});


const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb (null, './image');  
},
filename: function (req, file, cb)  {
cb(null,file.fieldname + '_' + Date.now() + '_' +file.originalname);
},
});
const upload = multer({
storage: storage,
});
router.post('/users', upload.single('photo'), async (req, res) => {
  let name = req.body.user_name;
  let password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  let role = req.body.role_name;
  let email = req.body.email;
  let image = req.file.filename;
  knex('admin.users', )
          .insert({user_name: name, password: hashedPassword, photo: image, role_id: role, email: email})
          .then((results) => {
                  res.redirect('/users');
          });
});
router.use(express.static('image'));

router.post("/edit/:user_id", upload.single('photo'), async (req, res) => {
  let user_name = req.body.user_name;
  let role = req.body.role_name;
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (req.file) {
    let image= req.file.filename;
} else {
  const image= req.file.filename;
}
const image= req.file.filename;
  knex("admin.users")
  .where("user_id", req.params.user_id)
  .update({ user_name: user_name, role_id: role, photo: image, email: email, password: hashedPassword,}) 
  .then((results) => {
  res.redirect("/users");
});
});
router.use(express.static('image'));
module.exports = router;
