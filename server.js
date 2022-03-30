require('dotenv').config();
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const knex = require('./dbconnection');

const app = express();
const PORT = process.env.PORT || 3000;

const initializePassport = require('./passport-config');

initializePassport(
  passport,
  async (username) => {
    const userFound = await knex('admin.users').where({ user_name: username }).first();
    return userFound;
  },
  async (id) => {
    const userFound = await knex('admin.users').where({ user_id: id }).first();
    return userFound;
  }
);

// set template engine
app.set('view engine', 'ejs');

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static('/photo'));

// route prefix
app.use('', require('./routes/routes'));
app.use('', require('./routes/passwordReset'));
app.use('', require('./routes/jobRequirement'));
app.use('', require('./routes/editJobRequirement'));
app.use('', require('./routes/jobDetails'));
app.use('', require('./routes/exam'));
app.use('', require('./routes/settings'));
app.use('', require('./routes/users'));
app.use('', require('./routes/careerDetails'));
app.use('', require('./routes/careers'));
app.use('', require('./routes/examCreation'));
app.use('', require('./routes/exam'));
app.use('', require('./routes/systemVariables'));
app.use('', require('./routes/resume'));
app.use('', require('./routes/editResume'));
app.use('', require('./routes/applicantExam'));
app.use('', require('./routes/application'));
app.use('', require('./routes/userProfile'));

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
