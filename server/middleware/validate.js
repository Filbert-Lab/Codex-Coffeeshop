/**
 * Validation helpers — keep validation co-located and reusable.
 */

/** Validates :id route param is a positive integer. */
const validateIdParam = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid ID parameter" });
  }
  req.params.id = id;
  next();
};

/** Trim and length-limit string fields. Returns middleware. */
const sanitizeBody = (fields = {}) => (req, _res, next) => {
  for (const [key, max] of Object.entries(fields)) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().slice(0, max);
    }
  }
  next();
};

/** Email regex (RFC-5322 simplified) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (s) => typeof s === "string" && EMAIL_RE.test(s) && s.length <= 254;

module.exports = { validateIdParam, sanitizeBody, isValidEmail };
