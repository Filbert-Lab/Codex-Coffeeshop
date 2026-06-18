/**
 * Google OAuth 2.0 strategy.
 * Only registered if GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set.
 * On success we either link to an existing email-matched account or create
 * a new "customer" user. Local-password accounts are NOT auto-promoted to
 * OAuth — we just fall back to creating a separate provider link if needed.
 */
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../../models/User");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";

const isConfigured = Boolean(CLIENT_ID && CLIENT_SECRET);

let strategy = null;

if (isConfigured) {
  strategy = new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["profile", "email"],
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
          profile.displayName || (email ? email.split("@")[0] : "User");

        if (!email) {
          return done(null, false, {
            message: "Google account did not return an email",
          });
        }

        // 1) Existing OAuth link?
        let user = await User.findByProvider("google", profile.id);
        if (user) return done(null, user);

        // 2) Existing email? Link the OAuth provider to it.
        user = await User.findByEmail(email);
        if (user) {
          // Only link if the existing account isn't bound to another provider.
          if (user.provider === "local" || user.provider === "google") {
            user.provider = "google";
            user.provider_id = String(profile.id);
            if (!user.avatar_url) user.avatar_url = avatar;
            await user.save();
            return done(null, user);
          }
          return done(null, false, {
            message: `Email already registered via ${user.provider}`,
          });
        }

        // 3) Brand new user
        user = await User.create({
          name,
          email,
          provider: "google",
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
