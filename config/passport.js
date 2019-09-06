import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../server/models/User";

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]"
    },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" }
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(
    null,
    user ? { id: user.id, username: user.username, name: user.name } : false
  );
});
