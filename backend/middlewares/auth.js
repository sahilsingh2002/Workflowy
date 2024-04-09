const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');

// Setup Passport.js JWT strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_secret_key'
}, (jwtPayload, done) => {
    console.log(jwtPayload);
  const user = jwtPayload;
  
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));

// Middleware to authenticate user using Passport.js
const authenticateUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticateUser;
