/**
 * passport.js — initialise Passport with all available strategies.
 * The two OAuth strategies are opt-in: only registered when their
 * credentials are present in the environment.
 *
 * Stateless flow: we don't use sessions, so no serialize/deserialize.
 */
const passport = require("passport");

const localStrategy = require("./strategies/localStrategy");
const jwtStrategy = require("./strategies/jwtStrategy");
const google = require("./strategies/googleStrategy");
const github = require("./strategies/githubStrategy");

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

if (google.isConfigured) {
  passport.use("google", google.strategy);
  console.log("✅ [auth] Google OAuth strategy registered");
} else {
  console.log(
    "ℹ️  [auth] Google OAuth disabled (set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to enable)",
  );
}

if (github.isConfigured) {
  passport.use("github", github.strategy);
  console.log("✅ [auth] GitHub OAuth strategy registered");
} else {
  console.log(
    "ℹ️  [auth] GitHub OAuth disabled (set GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET to enable)",
  );
}

/** Returns which OAuth providers are wired up — useful for the client. */
function listAvailableProviders() {
  const list = [];
  if (google.isConfigured) list.push("google");
  if (github.isConfigured) list.push("github");
  return list;
}

module.exports = passport;
module.exports.listAvailableProviders = listAvailableProviders;
