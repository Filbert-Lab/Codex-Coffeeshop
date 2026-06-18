/**
 * Local strategy — email + password login.
 * Designed for stateless JWT flow: we don't use sessions, so the
 * controller just receives `req.user` set by passport.authenticate().
 */
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../../models/User");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
  },
  async (email, password, done) => {
    try {
      const normalized = String(email || "")
        .trim()
        .toLowerCase();
      if (!normalized || !password) {
        return done(null, false, { message: "Email and password required" });
      }

      const user = await User.findByEmail(normalized);
      // Constant-time-ish: always run comparePassword to limit timing leaks.
      const match = user ? await user.comparePassword(password) : false;

      if (!user || !match) {
        return done(null, false, { message: "Invalid credentials" });
      }
      if (user.provider && user.provider !== "local") {
        return done(null, false, {
          message: `This account uses ${user.provider} sign-in`,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);
