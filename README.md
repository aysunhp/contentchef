# ContentChef 🍳

A Micro-SaaS content planning platform tailored for content creators. Built for hackathon with a focus on clean architecture, premium UI/UX, and AI-powered content generation.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Drag & Drop:** @hello-pangea/dnd
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

```
ContentChef/
├── client/                 # React + Tailwind Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── context/        # React Context Providers
│   │   ├── hooks/          # Custom Hooks
│   │   ├── constants/      # Theme tokens, config
│   │   ├── services/       # API service layer
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── server/                 # Node.js + Express Backend
    ├── src/
    │   ├── config/         # Server configuration
    │   ├── controllers/    # Request handlers
    │   ├── middleware/      # Express middleware
    │   ├── models/         # Data models
    │   ├── routes/         # API routes
    │   ├── services/       # Business logic
    │   └── app.js
    └── package.json
```

## License

MIT
