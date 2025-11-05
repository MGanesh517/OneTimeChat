# OneTime Chat Backend

Node.js + Socket.io + MongoDB backend server for the OneTime Chat application.

## ✅ Setup Complete!

Your MongoDB connection is configured in `.env` file.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ MongoDB Connected: onetimechat.iyvduyc.mongodb.net
   🚀 Server running on port 5000
   📡 Socket.io ready
   ```

3. **Test backend:**
   - Open: `http://localhost:5000`
   - Should see: `{"message":"OneTime Chat Backend API","status":"running"}`

## Environment Variables

Already configured in `.env`:
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Server port (5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

## API Endpoints

- `GET /` - Health check
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:roomId` - Get room information
- `GET /api/rooms/:roomId/users` - Get room participants
- `DELETE /api/rooms/:roomId` - Delete a room

## Socket Events

### Client → Server
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a chat message
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - WebRTC ICE candidate

### Server → Client
- `room-joined` - Confirmation of joining room
- `room-left` - Confirmation of leaving room
- `message-received` - New message in room
- `user-joined` - Another user joined
- `user-left` - Another user left
- `offer-received` - WebRTC offer received
- `answer-received` - WebRTC answer received
- `ice-candidate-received` - ICE candidate received
- `error` - Error message

## Deployment to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables:
   - `MONGODB_URI` (already configured)
   - `FRONTEND_URL` (your deployed frontend URL)
   - `NODE_ENV=production`
5. Build command: `npm install`
6. Start command: `npm start`
7. Deploy!

The server will automatically use the PORT environment variable provided by Render.

## Testing

Test locally:
```bash
npm run dev
# Backend runs on http://localhost:5000
```

Test API:
```bash
curl http://localhost:5000
# Should return: {"message":"OneTime Chat Backend API","status":"running"}
```

## Troubleshooting

### MongoDB Connection Error
- Check `.env` file exists
- Verify MongoDB connection string is correct
- Check network access in MongoDB Atlas

### Port Already in Use
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update `FRONTEND_URL` in frontend `.env.local`
