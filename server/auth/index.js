/**
 * server/auth — Public surface of the auth module.
 *
 * Usage:
 *   const auth = require("./auth");
 *   app.use(auth.passport.initialize());
 *   app.use("/api/auth", auth.routes);
 *
 *   router.get("/foo", auth.requireAuth, handler);
 *   router.get("/admin", auth.requireAdmin, handler);
 *   router.get("/maybe", auth.optionalAuth, handler);
 */
const passport = require("./passport");
const routes = require("./authRoutes");
const middleware = require("./authMiddleware");
const tokenService = require("./tokenService");

module.exports = {
  passport,
  routes,
  ...middleware,
  ...tokenService,
};
