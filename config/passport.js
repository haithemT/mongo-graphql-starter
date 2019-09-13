require("dotenv").config();
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
const { JWT_SECRET } = process.env;

const cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const verifyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET,
  audience: "localhost",
  algorithms: ["HS256"]
};

passport.use(
  new JwtStrategy(verifyOptions, (payload, done) => done(null, payload))
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = users.find(user => user._id === id);
  done(
    null,
    user ? { id: user._id, username: user.username, name: user.name } : false
  );
});

export const authenticate = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err, payload) => {
      if (err) reject(err);
      resolve(payload);
    })(req, res);
  });
