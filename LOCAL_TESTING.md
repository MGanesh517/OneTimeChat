# 🧪 Local Testing Guide

Test everything locally before deploying!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Two browser windows/tabs for testing

---

## Step 1: MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Create cluster (takes 3-5 minutes)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/onetimechat?retryWrites=true&w=majority`

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for testing)
   - Or add your current IP address

---

## Step 2: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   # Copy the template
   cp env.template .env
   ```

4. **Edit `.env` file**
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ MongoDB Connected: ...
   🚀 Server running on port 5000
   📡 Socket.io ready
   ```

6. **Test backend**
   - Open browser: `http://localhost:5000`
   - Should see: `{"message":"OneTime Chat Backend API","status":"running"}`

---

## Step 3: Frontend Setup

1. **Navigate to root folder** (from backend, go back)
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file**
   ```bash
   # In root directory
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. **Start frontend**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   ```

5. **Open browser**
   - Go to `http://localhost:3000`

---

## Step 4: Test Features

### Test Room Creation

1. **Window 1: Create Room**
   - Click "GENERATE ROOM ID"
   - Copy the room ID (e.g., `A1B2C3D4`)

2. **Window 2: Join Room**
   - Paste room ID in "JOIN ROOM"
   - Click "JOIN ROOM"

3. **Both windows should show the same room**

### Test Real-time Chat

1. **Window 1:**
   - Type a message
   - Press Enter or click SEND

2. **Window 2:**
   - Should see the message appear instantly!

3. **Window 2:**
   - Type a reply
   - Window 1 should see it

### Test Video Call

1. **Window 1:**
   - Click "VIDEO CALL" tab
   - Allow camera/microphone permissions
   - Should see your video

2. **Window 2:**
   - Click "VIDEO CALL" tab
   - Allow camera/microphone permissions
   - Should see both videos (yours and remote)

---

## Troubleshooting

### Backend won't start

**Problem**: MongoDB connection error
```
❌ MongoDB Connection Error
```
**Solution**: 
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB network access allows your IP
- Check password in connection string

**Problem**: Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update `FRONTEND_URL` in `.env` and `NEXT_PUBLIC_BACKEND_URL` in `.env.local`

### Frontend won't connect

**Problem**: Socket.io connection failed
**Solution**:
- Check backend is running
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Check browser console for errors

### Video not working

**Problem**: Camera/microphone not accessible
**Solution**:
- Allow permissions in browser
- Check browser console for errors
- Try different browser (Chrome recommended)

**Problem**: Video works locally but not in production
**Solution**:
- WebRTC requires HTTPS in production
- Both frontend and backend must be HTTPS

---

## Expected Console Output

### Backend (Terminal)
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
🌐 Environment: development
📡 Socket.io ready
✅ User connected: abc123
👤 User abc123 joined room A1B2C3D4
💬 Message sent in room A1B2C3D4
```

### Frontend (Browser Console)
```
✅ Socket connected: xyz789
✅ Connected to server
✅ Joined room, participants: 1
👤 User joined, total: 2
💬 Message received
```

---

## Next Steps

Once everything works locally:

1. ✅ Read `DEPLOYMENT.md` for production deployment
2. ✅ Deploy backend to Render
3. ✅ Deploy frontend to Vercel
4. ✅ Update environment variables
5. ✅ Test in production!

**Happy Testing! 🚀**

