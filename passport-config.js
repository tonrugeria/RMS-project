const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

function initialize(passport, getUserByUsername, getUserById) {
  const authenticatUser = async (username, password, done) => {
    const user = await getUserByUsername(username)
    if (user == null) {
      return done(null, false, { message: 'No user with that username' })
      // render('/register')
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch(err){
      return done(e)
    }
  }

  passport.use(new localStrategy({ usernameField: 'username'}, authenticatUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id))
  })
}

module.exports = initialize;

