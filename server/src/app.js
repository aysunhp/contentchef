const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ── Security ─────────────────────────────────────────── */
// Disable Content Security Policy to allow external resources (like Puter.js and AI images) in hackathon
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Allow all origins with credentials for easy local development and multi-platform deployment
app.use(cors({
  origin: true,
  credentials: true
}));

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

/* ── Serve Static Assets (Production / Hackathon Monolith) ── */
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Support SPA routing: redirect any non-API route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('ContentChef API Server is running. (Vite static build not found, run npm run build)');
    }
  });
});

/* ── Error Handling ───────────────────────────────────── */
app.use(errorHandler);

/* ── Start Server ─────────────────────────────────────── */
app.listen(config.port, () => {
  console.log(`[ContentChef] Server running on port ${config.port} (${config.nodeEnv})`);
});

module.exports = app;
