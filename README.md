# ContentChef 🍳

A beautiful, AI-powered content planning platform designed for creators. Plan your content calendar, organize your ideas, and let AI help you generate engaging posts.

**Live Features:**

- 📅 **Calendar Board** — Monthly view with intuitive drag-and-drop
- ✍️ **Content Kitchen** — Professional post editor with media preview
- 🤖 **AI Generation** — Powered by Puter.js (no API key required)
- 🎨 **Moodboard** — AI visual previews for your content
- 📸 **Media Library** — Organized gallery of all your assets
- 🌙 **Dark Mode** — Beautiful light & dark themes
- 📌 **Quick Notes** — Jot down ideas as you plan
- 🎯 **Status Workflow** — Draft → Review → Published
- 📱 **Platform Support** — Instagram & TikTok creation hints

## What You Can Do

| Feature                             | Status                        |
| ----------------------------------- | ----------------------------- |
| Monthly calendar with drag-and-drop | ✅ Working                    |
| Create / edit / delete posts        | ✅ Working                    |
| Content Kitchen (full editor)       | ✅ Working                    |
| AI content plan generation          | ✅ Puter AI + Server fallback |
| AI moodboard preview                | ✅ Puter AI image generation  |
| Light / dark theme toggle           | ✅ Working                    |
| Context menu (status, delete, edit) | ✅ Working                    |
| Media library & gallery             | ✅ Working                    |
| Quick notes feature                 | ✅ Working                    |
| Platform-specific hints             | ✅ Instagram/TikTok support   |
| Post filtering (status, date)       | ✅ Backend ready              |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Quick Start (< 5 minutes)

```bash
# 1. Clone/navigate to project
cd contentchef

# 2. Install dependencies
cd server && npm install && cd ../client && npm install && cd ..

# 3. Start backend (Terminal 1)
cd server && npm run dev
# ✓ API on http://localhost:3001

# 4. Start frontend (Terminal 2)
cd client && npm run dev
# ✓ UI on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Done! 🎉

### Detailed Setup Guide

See `SETUP.md` for complete installation, environment setup, and troubleshooting.

## Using ContentChef

### Create a Post

1. Click **"New Post"** button in header
2. Fill in topic, category, format (image/video)
3. Add hook, body text, and hashtags
4. Click **"Create Post"** to add to calendar

### Edit in Content Kitchen

1. Click any post card on the calendar
2. Right panel opens with full editor
3. Change status (Draft → Review → Published)
4. Upload or AI-generate moodboard image
5. Click **"Save Changes"** to persist

### Generate with AI

1. Click **"AI Generate"** button
2. Describe your content (e.g., _"7 Instagram Reels for personal finance tips"_)
3. AI creates a 7-day plan automatically
4. Review and tweak posts as needed

### Organize with Media Library

1. Click **"Media"** in sidebar
2. Browse all saved images and moodboards
3. Click any image to jump to that post
4. Organize by generated moodboards or uploads

### Quick Notes

1. Click **"+"** button → **"New Note"**
2. Title your note, add content & tags
3. Use for planning, ideas, reminders

## Project Structure

```
contentchef/
├── client/                  # React + Vite + Tailwind
│   ├── src/components/
│   │   ├── AI/              # AI prompt interface
│   │   ├── Calendar/        # Calendar & cards
│   │   ├── Kitchen/         # Post editor
│   │   ├── Media/           # Media gallery
│   │   ├── Sidebar/         # Navigation
│   │   └── common/          # Modals, menus
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                  # Express.js + Node
    ├── src/
    │   ├── config/          # Database config
    │   ├── controllers/      # Handlers
    │   ├── models/          # Post, Media logic
    │   ├── routes/          # API endpoints
    │   └── services/        # AI generation
    ├── package.json
    └── .env                 # Environment vars
```

## API Reference

```
GET    /api/health                                   # Server status
GET    /api/posts                                    # All posts
GET    /api/posts/:id                                # Single post
GET    /api/posts/filter/by-status?status=draft     # By status
GET    /api/posts/filter/by-date-range?...          # Date range
POST   /api/posts                                    # Create post
PUT    /api/posts/:id                                # Update post
DELETE /api/posts/:id                                # Delete post
GET    /api/media                                    # All media
POST   /api/media                                    # Save media
POST   /api/generate-plan                            # AI plan (fallback)
POST   /api/generate-moodboard                       # AI image (fallback)
```

## Known Limitations

- **No Database** — Posts stored in server memory (reset on restart)
- **No Authentication** — Single-user only (suitable for hackathons/demos)
- **Puter AI** — Free tier may require sign-in on first use
- **File Uploads** — Images only (no video upload storage)
- **Placeholders** — Messages, Analytics, Settings sections are UI stubs

## Tech Stack

| Layer           | Technology                           |
| --------------- | ------------------------------------ |
| **Frontend**    | React 18, Vite, Tailwind CSS         |
| **Drag & Drop** | @hello-pangea/dnd                    |
| **Icons**       | Lucide React                         |
| **Backend**     | Node.js, Express.js                  |
| **Security**    | Helmet, CORS, rate-limiting          |
| **AI**          | Puter.js (browser) + Server fallback |
| **Styling**     | Tailwind CSS + custom theme          |

## Configuration

### Server (.env)

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-key-here  # Optional: live OpenAI integration
```

### Client (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## Development

### Start Development Servers

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Build for Production

```bash
# Frontend
cd client && npm run build

# Backend - ensure .env has production settings
npm start
```

### Recommended Enhancements

1. **Persistence** — Add PostgreSQL, MongoDB, or Firebase
2. **Authentication** — User login & multi-user support
3. **Real AI** — Integrate OpenAI API for live generation
4. **Export** — CSV/PDF export of content plans
5. **Scheduling** — Auto-publish posts at optimal times
6. **Analytics** — Track post performance
7. **Collaboration** — Team/multi-user workspaces

## Theme Design

**Light Mode** — Pastel cream & soft neutrals  
**Dark Mode** — Deep obsidian with accent lavender/mint

Custom color system optimized for long content creation sessions.

## Troubleshooting

**"Failed to reach server"**

- Start backend: `cd server && npm run dev`
- Check `http://localhost:3001/api/health`

**Styles not loading**

- Restart: `cd client && npm run dev`
- Clear cache: `Ctrl+Shift+Delete`

**Posts disappear on refresh**

- Expected (in-memory storage). Add database for persistence.

**AI not generating**

- Check browser console for Puter errors
- Server fallback always works (uses mock data)

## Contributing

Follow guidelines in `CLAUDE.md`:

- Keep changes surgical (touch only what's needed)
- Write simple, readable code
- Test before committing
- Document new features

## Performance Tips

- Use the monthly calendar for large post libraries (100+ posts)
- Export to analytics tools for long-term tracking
- Archive old posts to keep memory usage low
- Clear browser cache if Tailwind styles act weird

## License

MIT — Use freely for personal or commercial projects

---

**Ready to create? Open `http://localhost:5173` and start planning! 🍳✨**
