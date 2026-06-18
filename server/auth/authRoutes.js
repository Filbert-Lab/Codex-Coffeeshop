/**
 * authRoutes.js — public auth endpoints mounted at /api/auth.
 *
 *   POST   /register             local register
 *   POST   /login                local login
 *   GET    /me                   current user (requires Bearer token)
 *   POST   /logout               stateless (just clears token client-side)
 *   GET    /providers            list of enabled OAuth providers
 *   GET    /google               start Google OAuth flow
 *   GET    /google/callback      Google OAuth callback
 *   GET    /github               start GitHub OAuth flow
 *   GET    /github/callback      GitHub OAuth callback
 */
const express = require("express");
const router = express.Router();

const ctrl = require("./authController");
const { requireAuth } = require("./authMiddleware");
const passport = require("./passport");

// Local
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", requireAuth, ctrl.me);
router.post("/logout", ctrl.logout);
router.get("/providers", ctrl.providers);

// Helper to register an OAuth pair only when its strategy is wired up.
function registerOAuth(provider, scope) {
  if (passport._strategy && !passport._strategy(provider)) return;
  router.get(`/${provider}`, ctrl.oauthStart(provider, scope));
  router.get(`/${provider}/callback`, ctrl.oauthCallback(provider));
}

registerOAuth("google", ["profile", "email"]);
registerOAuth("github", ["user:email"]);

module.exports = router;
