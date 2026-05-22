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

/**
 * Validates that a string field is a valid date in YYYY-MM-DD format
 */
const validateDateFormat = (dateStr) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validates that a string is a valid UUID v4
 */
const validateUUID = (str) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
};

module.exports = { validateBody, validateDateFormat, validateUUID };
