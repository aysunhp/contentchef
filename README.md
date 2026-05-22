# ContentChef 🍳

A content planning platform for creators — calendar scheduling, a content editor ("Kitchen"), and AI-assisted post generation.

## What you can do

| Feature | Status |
|---------|--------|
| Monthly calendar with drag-and-drop posts | ✅ Working |
| Create / edit / delete posts | ✅ Working |
| Content Kitchen (hook, body, hashtags, status) | ✅ Working |
| AI content plan generation | ✅ Puter AI in browser (no API key) |
| AI moodboard preview | ✅ Puter AI image generation |
| Light / dark theme | ✅ Working |
| Context menu (status, delete, open kitchen) | ✅ Working |

## Known limitations

- **No database** — posts live in server memory and reset on restart
- **No authentication** — not suitable for multi-user production as-is
- **AI runs via Puter.js** in the browser — first use may prompt Puter sign-in (user-pays model)
- Server `/api/generate-*` routes still exist as legacy fallbacks but the UI uses Puter directly
- **Sidebar sections** (Media, Messages, Analytics, Settings) are UI placeholders
- **File upload** in Kitchen is visual only
- **"New Note"** in the create menu does nothing yet
- **Instagram / TikTok** menu items open the same post modal (no platform-specific planner)

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, `@hello-pangea/dnd`
- **Backend:** Node.js, Express, Helmet, rate limiting, CORS

## Getting started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install

```bash
cd server && npm install
cd ../client && npm install
```

### Run (two terminals)

```bash
# Terminal 1 — API on :3001
cd server && npm run dev

# Terminal 2 — UI on :5173
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Environment

Copy `server/.env.example` to `server/.env`:

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Optional client override for production:

```env
# client/.env
VITE_API_URL=https://your-api.example.com/api
```

## API

```
GET    /api/health
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/generate-plan
POST   /api/generate-moodboard
```

## Project structure

```
contentchef/
├── client/          React app
└── server/          Express API
```

## License

MIT
