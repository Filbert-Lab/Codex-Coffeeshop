/**
 * JWT strategy — verifies `Authorization: Bearer <token>` headers.
 * Returns a lightweight user object (no DB lookup) for performance.
 * If you need fresh DB data per request, swap to a `User.findByPk(payload.id)`
 * version — the trade-off is one query per protected request.
 */
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("../tokenService");

module.exports = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    try {
      // Minimal sanity check on payload shape
      if (!payload || typeof payload.id !== "number") {
        return done(null, false);
      }
      // We trust the signature; no DB roundtrip on the hot path.
      return done(null, {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (err) {
      return done(err, false);
    }
  },
);
