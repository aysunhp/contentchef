/**
 * Generic request body validator middleware factory.
 * Accepts an array of required field names.
 * Returns 400 if any required field is missing.
 */
const validateBody = (requiredFields) => (req, res, next) => {
  const missing = requiredFields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: { message: `Missing required fields: ${missing.join(', ')}` },
    });
  }

  next();
};

module.exports = { validateBody };
