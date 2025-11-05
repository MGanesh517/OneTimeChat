# 🚀 Backend Integration Guide

## 📋 Architecture Overview

Here's the **recommended architecture** using your services:

```
┌─────────────────┐
│  Next.js Frontend │  (Vercel/Netlify/Render)
│  (This Project)   │
└────────┬─────────┘
         │
         │ Socket.io + REST API
         │
┌────────▼─────────┐
│  Node.js Backend │  (Render)
│  Socket.io Server│
│  Express API     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼─────┐
│ MongoDB│  │ Firebase│  (Optional)
│  Rooms │  │ Storage │
│  Logs  │  │ Files   │
└───────┘  └─────────┘
```

## 🎯 Service Usage Strategy

### **1. MongoDB** (Primary Database)
- ✅ **Room Management** - Store room IDs, creation time, participants count
- ✅ **Message History** (Optional) - Store messages if you want persistence
- ✅ **Session Logs** - Track active sessions, user counts
- ✅ **Room Metadata** - Settings, expiration times

### **2. Socket.io** (Real-time Communication)
- ✅ **Chat Messages** - Real-time messaging between users
- ✅ **WebRTC Signaling** - Exchange WebRTC offers/answers for video calls
- ✅ **Room Events** - User join/leave, typing indicators
- ✅ **Connection Management** - Handle reconnections, room validation

### **3. Firebase** (Optional - Use if needed)
- 🔸 **File Storage** - If you want to share files/images in chat
- 🔸 **Real-time Presence** - Alternative to Socket.io (but Socket.io is better for this)
- 🔸 **Analytics** - Track usage, errors
- ⚠️ **Not recommended** for messages (use MongoDB + Socket.io instead)

### **4. Render** (Hosting)
- ✅ **Backend Server** - Host your Node.js + Socket.io server
- ✅ **Frontend** (Optional) - Can also host Next.js if needed
- ✅ **Environment Variables** - Store MongoDB connection, secrets

---

## 📝 Step-by-Step Integration Process

### **PHASE 1: Backend Setup (Render)**

#### Step 1: Create Backend Server Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── config/
│   └── database.js    # MongoDB connection
├── models/
│   └── Room.js        # Room model
├── routes/
│   └── api.js         # REST API routes
├── socket/
│   └── handlers.js    # Socket.io event handlers
└── .env               # Environment variables
```

#### Step 2: Install Backend Dependencies
```bash
cd backend
npm init -y
npm install express socket.io mongoose cors dotenv
npm install --save-dev nodemon
```

#### Step 3: Set Up MongoDB
- Create MongoDB Atlas account (free tier available)
- Create a cluster
- Get connection string
- Create database: `onetimechat`

#### Step 4: Deploy to Render
- Create new Web Service on Render
- Connect your GitHub repo
- Set environment variables
- Deploy!

---

### **PHASE 2: Frontend Integration (This Project)**

#### Step 1: Create Socket Context
- Create `lib/socket.ts` - Socket.io client setup
- Create `contexts/SocketContext.tsx` - React context for socket

#### Step 2: Update Components
- Update `ChatInterface.tsx` - Connect to socket
- Update `VideoCallInterface.tsx` - Add WebRTC + signaling
- Update `app/page.tsx` - Validate rooms with backend

#### Step 3: Environment Variables
- Create `.env.local` with backend URL
- Update `next.config.js` if needed

---

### **PHASE 3: Features Integration**

#### Feature 1: Real-time Chat
- Socket events: `join-room`, `leave-room`, `send-message`, `receive-message`
- Message format: `{ id, text, sender, timestamp, roomId }`

#### Feature 2: Video Calls
- WebRTC setup: `getUserMedia`, `RTCPeerConnection`
- Socket signaling: `offer`, `answer`, `ice-candidate`
- Handle multiple users (optional)

#### Feature 3: Room Management
- Backend API: `POST /api/rooms` - Create room
- Backend API: `GET /api/rooms/:id` - Validate room
- Socket: Room participant count updates

---

## 🔧 What We'll Build

### Backend Endpoints:
```
POST   /api/rooms              - Create new room
GET    /api/rooms/:roomId      - Get room info
GET    /api/rooms/:roomId/users - Get participants
DELETE /api/rooms/:roomId      - Delete room (optional)
```

### Socket Events:
```
Client → Server:
  - join-room
  - leave-room
  - send-message
  - offer (WebRTC)
  - answer (WebRTC)
  - ice-candidate (WebRTC)

Server → Client:
  - room-joined
  - room-left
  - message-received
  - user-joined
  - user-left
  - offer-received
  - answer-received
  - ice-candidate-received
```

---

## 🚀 Next Steps

I'll create:
1. ✅ Complete backend server code (Node.js + Socket.io + MongoDB)
2. ✅ Frontend Socket.io integration (hooks, context)
3. ✅ Updated ChatInterface with real-time messaging
4. ✅ Updated VideoCallInterface with WebRTC
5. ✅ Room validation and management
6. ✅ Deployment instructions for Render

**Ready to start?** I'll create all the backend code and update your frontend components!

