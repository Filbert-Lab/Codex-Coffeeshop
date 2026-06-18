/**
 * GitHub OAuth 2.0 strategy (passport-github2).
 * Only registered if GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET are set.
 * Mirrors the Google strategy linking logic.
 */
const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("../../models/User");

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL || "/api/auth/github/callback";

const isConfigured = Boolean(CLIENT_ID && CLIENT_SECRET);

let strategy = null;

if (isConfigured) {
  strategy = new GitHubStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value
            ? profile.emails[0].value.toLowerCase()
            : null;
        const avatar =
          profile.photos && profile.photos[0] && profile.photos[0].value
            ? profile.photos[0].value
            : null;
        const name =
          profile.displayName ||
          profile.username ||
          (email ? email.split("@")[0] : "User");

        // GitHub users may hide their email — fall back to a stable surrogate.
        const fallbackEmail = `${profile.id}+${profile.username || "github"}@users.noreply.github.com`;
        const finalEmail = email || fallbackEmail;

        // 1) Existing OAuth link?
        let user = await User.findByProvider("github", profile.id);
        if (user) return done(null, user);

        // 2) Existing email? Link the OAuth provider to it.
        if (email) {
          user = await User.findByEmail(email);
          if (user) {
            if (user.provider === "local" || user.provider === "github") {
              user.provider = "github";
              user.provider_id = String(profile.id);
              if (!user.avatar_url) user.avatar_url = avatar;
              await user.save();
              return done(null, user);
            }
            return done(null, false, {
              message: `Email already registered via ${user.provider}`,
            });
          }
        }

        // 3) Brand new user
        user = await User.create({
          name,
          email: finalEmail,
          provider: "github",
          provider_id: String(profile.id),
          avatar_url: avatar,
          role: "customer",
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  );
}

module.exports = { strategy, isConfigured };
