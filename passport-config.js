const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByUsername, getUserById) {
        const authenticatUser = async (username, password, done) => {
                const user = await getUserByUsername(username);
                if (user == null) {
                        return done(null, false, { message: 'No user with that username' });
                        // render('/register')
                }
                try {
                        if (await bcrypt.compare(password, user.password)) {
                                return done(null, user);
                        }
                        return done(null, false, { message: 'Password incorrect' });
                } catch (err) {
                        return done(err);
                }
        };

        passport.use(new LocalStrategy({ usernameField: 'username' }, authenticatUser));
        passport.serializeUser((user, done) => done(null, user.user_id));
        passport.deserializeUser(async (id, done) => done(null, await getUserById(id)));
}

module.exports = initialize;
