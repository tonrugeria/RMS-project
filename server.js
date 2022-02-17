require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./models/User')
const bcrypt = require('bcryptjs/dist/bcrypt')
const {
  checkAuthenticated,
  checkNotAuthenticated
} = require('./middlewares/auth')



const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.static('image'))
const initializePassport = require('./passport-config')
const { db } = require('./models/User')
initializePassport(
  passport,
  async(username) => {
    const userFound = await User.findOne({ username })
    return userFound
  },
  async (id) => {
    const userFound = await User.findOne({ _id: id })
    return userFound
  }
)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { username: req.user.username })
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}), async (req, res) => {
  
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  const userFound = await User.findOne({ username: req.body.username })
  if (userFound) {
    req.flash('error', 'User with that username already exists')
    res.redirect('/register')
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User ({
        username: req.body.username,
        password: hashedPassword,
      })
      await user.save()
      res.redirect('/login')
    } catch (error) {
      console.log(error)
      res.redirect('/register')
    }
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

mongoose.connect('mongodb://localhost:27017/auth', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
  })
})

app.get('/about', (req, res) => {
  res.send('amsdkngowng')
})