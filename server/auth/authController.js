/**
 * authController.js
 * Stateless JWT auth: register, login, current-user, OAuth callbacks.
 * The OAuth callbacks issue a JWT and redirect the browser back to a frontend
 * URL with the token in the query string — the SPA picks it up on load.
 */
const passport = require("./passport");
const { issueToken } = require("./tokenService");
const User = require("../models/User");
const { isValidEmail } = require("../middleware/validate");

const MIN_PASSWORD_LENGTH = 6;
const MAX_NAME_LENGTH = 100;

const sanitize = (s, max) =>
  typeof s === "string" ? s.trim().slice(0, max) : "";

const oauthSuccessRedirect =
  process.env.OAUTH_SUCCESS_REDIRECT || "/auth/callback";
const oauthFailureRedirect =
  process.env.OAUTH_FAILURE_REDIRECT || "/auth/callback";

/** Build a redirect URL carrying the JWT for the SPA to consume. */
function buildOAuthRedirect(token, errorMessage) {
  const base = token ? oauthSuccessRedirect : oauthFailureRedirect;
  // Use URL constructor so absolute and relative URLs both work.
  // Relative URLs get a placeholder base; we strip it back out below.
  const isRelative = !/^https?:\/\//i.test(base);
  const url = new URL(base, "http://placeholder.local");
  if (token) url.searchParams.set("token", token);
  if (errorMessage) url.searchParams.set("error", errorMessage);
  return isRelative ? url.pathname + url.search : url.toString();
}

// ─── REGISTER (local) ───
async function register(req, res, next) {
  try {
    const name = sanitize(req.body.name, MAX_NAME_LENGTH);
    const email = sanitize(req.body.email, 254).toLowerCase();
    const { password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // role is hard-coded to 'customer' — never trust client-supplied role.
    const user = await User.create({
      name,
      email,
      password,
      role: "customer",
      provider: "local",
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: { token: issueToken(user), user },
    });
  } catch (err) {
    next(err);
  }
}

// ─── LOGIN (local) ───
function login(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const message = (info && info.message) || "Invalid credentials";
      return res.status(401).json({ success: false, message });
    }
    return res.json({
      success: true,
      message: "Login successful",
      data: { token: issueToken(user), user },
    });
  })(req, res, next);
}

// ─── ME ───
async function me(req, res, next) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

// ─── LOGOUT (stateless: client just discards token) ───
function logout(_req, res) {
  return res.json({
    success: true,
    message: "Logged out (clear the token client-side)",
  });
}

// ─── OAuth providers list ───
function providers(_req, res) {
  return res.json({
    success: true,
    data: { providers: passport.listAvailableProviders() },
  });
}

// ─── OAuth callback handler factory ───
/**
 * Generates a callback handler for a given provider. Issues a JWT and
 * redirects to the configured frontend URL with the token (or error).
 */
function oauthCallback(providerName) {
  return (req, res, next) => {
    passport.authenticate(
      providerName,
      { session: false },
      (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          const message =
            (info && info.message) || "OAuth authentication failed";
          return res.redirect(buildOAuthRedirect(null, message));
        }
        const token = issueToken(user);
        return res.redirect(buildOAuthRedirect(token));
      },
    )(req, res, next);
  };
}

/** Trigger the provider's auth flow (delegates to passport). */
function oauthStart(providerName, scope) {
  return passport.authenticate(providerName, { session: false, scope });
}

module.exports = {
  register,
  login,
  me,
  logout,
  providers,
  oauthStart,
  oauthCallback,
};
