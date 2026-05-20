const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ── Security ─────────────────────────────────────────── */
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));

/* ── Rate Limiting ────────────────────────────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

/* ── Body Parsing ─────────────────────────────────────── */
app.use(express.json({ limit: '1mb' }));

/* ── Routes ───────────────────────────────────────────── */
app.use('/api', routes);

/* ── Error Handling ───────────────────────────────────── */
app.use(errorHandler);

/* ── Start Server ─────────────────────────────────────── */
app.listen(config.port, () => {
  console.log(`[ContentChef] Server running on port ${config.port} (${config.nodeEnv})`);
});

module.exports = app;
