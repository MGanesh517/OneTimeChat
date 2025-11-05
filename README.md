# OneTime Chat - Anonymous Chat Application

A modern, hacking-themed anonymous chat application built with Next.js, featuring unique room IDs, real-time chat, and video call capabilities.

## Features

- 🎨 **Hacking Theme UI** - Matrix-style code rain background with glitch effects
- 🔐 **Anonymous Chat** - No identity required, completely anonymous
- 🆔 **Unique Room IDs** - Generate or join rooms with unique identifiers
- 💬 **Real-time Chat** - Socket-based messaging (ready for integration)
- 📹 **Video Call** - WebRTC video calling interface (ready for integration)
- ✨ **Animations** - Smooth animations powered by Framer Motion
- 🎯 **Modern UI** - Tailwind CSS with custom hacking theme

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Socket.io Client** - Real-time communication (ready for backend integration)
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (room creation/join)
│   └── room/
│       └── [roomId]/
│           └── page.tsx     # Chat room page
├── components/
│   ├── ChatInterface.tsx    # Chat UI component
│   ├── CodeRain.tsx         # Matrix-style code rain animation
│   ├── GlitchText.tsx       # Glitch effect text component
│   ├── HackingTerminal.tsx  # Terminal-style UI component
│   └── VideoCallInterface.tsx # Video call UI component
└── package.json
```

## UI Features

### Home Page
- Create new rooms with unique IDs
- Join existing rooms by ID
- Hacking-themed terminal interface
- Code rain background animation

### Chat Room
- Real-time chat interface
- Anonymous messaging
- Video call interface
- Tab-based navigation
- Connection status indicators

## Backend Integration

✅ **Backend is fully integrated!**

- **Socket.io Server** - Real-time chat and WebRTC signaling
- **MongoDB** - Room and message storage
- **REST API** - Room management

See `DEPLOYMENT_ONE_REPO.md` for deployment instructions.

## Deployment

### One Repository Setup:
- **Backend** → Deploy to Render (from `backend/` folder)
- **Frontend** → Deploy to Vercel (from root folder)
- **Both** → Use same GitHub repository

Quick guide: `QUICK_DEPLOY.md`

## Customization

- **Colors**: Edit `tailwind.config.ts` to customize the hacking theme colors
- **Animations**: Adjust animation timings in `tailwind.config.ts` or component files
- **Components**: All components are modular and easily customizable

## License

MIT

