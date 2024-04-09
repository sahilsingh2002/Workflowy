const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const cookieParser = require('cookie-parser');
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.user; // Assuming the JWT token is stored in a cookie named 'user'
  }
  return token;
};

const jwtSecret = 'workflowy_adm'; // Replace with your actual secret key

// Configure Passport.js to use JWT strategy
passport.use(new JWTStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtSecret
}, (jwtPayload, done) => {
  console.log(jwtPayload);
  const user = { id: jwtPayload.userId }; // Dummy user object for demonstration
  return done(null, user);
}));

module.exports.authenticateUser = passport.authenticate('jwt', { session: false });