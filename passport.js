const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('./models/UserModel');

// JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
      secretOrKey: process.env.jwt_secret,
    },
    async (payload, done) => {
      try {
        //Find user specified in token
        const user = await User.findById(payload.sub);

        console.log(payload.sub);

        //If user doesn't exists, handle it
        if (!user) {
          return done(null, false);
        }

        //Otherwise, return the token
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        //Find the user given the email
        const user = await User.findOne({ email });

        //If not, handle it
        if (!user) return done(null, false);

        //Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        //If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        //Otherwise, return the user
        done(null, user);
      } catch (error) {
        // done({ error_message: 'User is not registered' }, false);
        done(error, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
