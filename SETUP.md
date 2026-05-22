# ContentChef 🍳 — Setup & Development Guide

Welcome to ContentChef! This guide will help you get up and running quickly.

## Quick Start (5 minutes)

### Prerequisites

- **Node.js 18+** and **npm 9+**
- Git (for version control)

### Installation

```bash
# 1. Clone or navigate to the project root
cd contentchef

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Return to root
cd ..
```

### Running the Application

**Terminal 1 — Start the API Server:**

```bash
cd server
npm run dev
# API running on http://localhost:3001
```

**Terminal 2 — Start the Frontend:**

```bash
cd client
npm run dev
# UI running on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
contentchef/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AI/                  # AI generation UI
│   │   │   ├── Calendar/            # Calendar board & cards
│   │   │   ├── Kitchen/             # Content editor (right panel)
│   │   │   ├── Media/               # Media library
│   │   │   ├── Sidebar/             # Left navigation
│   │   │   └── common/              # Modals, menus, etc.
│   │   ├── context/                 # React Context (Posts, Media, Theme)
│   │   ├── hooks/                   # useFetch, useDragAndDrop
│   │   ├── services/                # API client, AI generation
│   │   └── styles/                  # Tailwind CSS
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/                  # Database config
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Validation, error handling
│   │   ├── models/                  # Post, Media models
│   │   ├── routes/                  # API endpoints
│   │   └── services/                # AI service logic
│   ├── package.json
│   └── .env                         # Environment variables
│
├── README.md                        # Project overview
├── SETUP.md                         # This file
└── CLAUDE.md                        # Development guidelines
```

---

## Features

### ✅ Completed

- **Calendar Board** — Monthly view with drag-and-drop post management
- **Content Kitchen** — Edit posts: hooks, body, hashtags, status, media
- **AI Generation** — Puter.js AI (no API key) or server-side generation
- **Moodboard** — AI-generated visual preview for posts
- **Media Library** — Organize and browse all saved images
- **Light/Dark Theme** — Full theme support with localStorage persistence
- **Post Status** — Draft → Review → Published workflow
- **Platform Support** — Instagram and TikTok creation hints
- **Notes Feature** — Quick notes for content planning

### 🔄 Recent Additions

- **Post Filtering** — Query by status or date range
- **Notes Creation** — Standalone notes for planning
- **Platform-Specific Hints** — Instagram/TikTok context in post modal
- **Validation** — Date, status, and format validation on backend
- **Error Handling** — Try/catch wrapping in all controllers

### ⚠️ Known Limitations

- **No Database** — Posts stored in server memory (reset on restart)
- **No Authentication** — Single-user only
- **Puter AI Free Tier** — May require user sign-in on first use
- **File Upload** — Images only (no video upload to server)
- **Placeholder Sections** — Messages, Analytics, Settings panels are UI stubs

---

## Environment Setup

### Server (.env)

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-openai-api-key-here  # Optional: for live OpenAI
```

### Client (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

---

## API Endpoints

| Method   | Endpoint                                                                  | Description                                   |
| -------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| `GET`    | `/api/health`                                                             | Server status check                           |
| `GET`    | `/api/posts`                                                              | Get all posts                                 |
| `GET`    | `/api/posts/:id`                                                          | Get single post                               |
| `GET`    | `/api/posts/filter/by-status?status=draft`                                | Filter posts by status                        |
| `GET`    | `/api/posts/filter/by-date-range?startDate=2024-01-01&endDate=2024-12-31` | Filter by date                                |
| `POST`   | `/api/posts`                                                              | Create post                                   |
| `PUT`    | `/api/posts/:id`                                                          | Update post                                   |
| `DELETE` | `/api/posts/:id`                                                          | Delete post                                   |
| `GET`    | `/api/media`                                                              | Get all media                                 |
| `POST`   | `/api/media`                                                              | Save image to media library                   |
| `POST`   | `/api/generate-plan`                                                      | Generate 7-day content plan (server fallback) |
| `POST`   | `/api/generate-moodboard`                                                 | Generate moodboard image (server fallback)    |

---

## Development Workflow

### Adding a New Feature

1. **Backend** (if needed):
   - Add controller logic in `server/src/controllers/`
   - Create routes in `server/src/routes/`
   - Add model methods if using data

2. **Frontend**:
   - Create UI component(s) in `client/src/components/`
   - Wire to context providers as needed
   - Call API via `services/api.js`

3. **Test**:
   - Check browser DevTools for network requests
   - Verify state with React DevTools extension

### Debugging

**Frontend:**

- Open DevTools (`F12`)
- Check Console for errors
- Use React DevTools extension for state inspection
- Network tab to see API calls

**Backend:**

- Check terminal output for request logging
- Add `console.log()` in controllers/middleware
- Test endpoints with cURL or Postman

### Code Style

Follow the guidelines in `CLAUDE.md`:

- Keep changes surgical (touch only what's needed)
- Write simple code (no over-engineering)
- Match existing patterns
- Handle errors gracefully

---

## Build & Deploy

### Production Build

**Frontend:**

```bash
cd client
npm run build
# Output: dist/
```

**Backend:**

- Ensure `.env` has production values
- Run `npm start` (not `npm run dev`)

### Deployment Options

1. **Frontend**: Vercel, Netlify, GitHub Pages, AWS S3
2. **Backend**: Heroku, Railway, Fly.io, AWS EC2
3. **Database Migration**: Add PostgreSQL, MongoDB, or Firebase when ready

---

## Troubleshooting

### Issue: "Failed to reach the server"

**Solution:**

- Ensure `npm run dev` is running in the `server/` directory
- Check that backend is on `http://localhost:3001`
- Verify `CLIENT_URL` in server `.env`

### Issue: Styles not applying (Tailwind)

**Solution:**

- Restart `npm run dev` in `client/`
- Clear browser cache (`Ctrl+Shift+Delete`)
- Check `tailwind.config.js` paths

### Issue: Posts disappear on refresh

**This is expected** — data is stored in-memory. To persist data:

- Add a database (MongoDB, PostgreSQL, etc.)
- Or use browser localStorage for demo purposes

### Issue: AI generation not working

**Solution:**

- Check browser console for Puter.js errors
- May require Puter sign-in on first use (free tier)
- Server fallback uses mock data (always works)

---

## Next Steps

### Recommended Enhancements

1. **Database Integration** — Add PostgreSQL/MongoDB for persistence
2. **Authentication** — Implement user login (Firebase, Auth0, etc.)
3. **Real AI** — Wire OpenAI API key for live generation
4. **Export** — Add CSV/PDF export for posts
5. **Scheduling** — Add automatic post scheduling
6. **Analytics** — Dashboard with post performance metrics
7. **Team Collaboration** — Multi-user support

### Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [Puter.js Docs](https://docs.puter.com)

---

## Support

For issues or questions:

1. Check the README.md in project root
2. Review CLAUDE.md for development principles
3. Check API responses in browser Network tab
4. Add logging and retry failed operations

---

**Happy creating! 🎉**
