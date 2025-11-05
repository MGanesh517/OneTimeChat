# 🚀 Deployment Guide

## Step-by-Step Deployment Process

### **PHASE 1: MongoDB Setup**

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier
   - Create a new cluster (free tier M0)

2. **Configure Database**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/onetimechat`

3. **Network Access**
   - Go to Network Access
   - Add IP address: `0.0.0.0/0` (allow all IPs for now)

---

### **PHASE 2: Backend Deployment (Render)**

1. **Prepare Backend Code**
   ```bash
   cd backend
   # Make sure all files are ready
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

4. **Configure Render Service**
   - **Name**: `onetime-chat-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (or paid if needed)

5. **Set Environment Variables in Render**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onetimechat
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   PORT=5000 (Render sets this automatically, but good to have)
   ```

6. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://onetime-chat-backend.onrender.com`

---

### **PHASE 3: Frontend Deployment**

#### Option A: Vercel (Recommended)

1. **Prepare Frontend**
   ```bash
   # In root directory
   # Create .env.local file
   NEXT_PUBLIC_BACKEND_URL=https://onetime-chat-backend.onrender.com
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set environment variable:
     - `NEXT_PUBLIC_BACKEND_URL` = Your Render backend URL

3. **Deploy!**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Your app is live!

#### Option B: Render (Alternative)

1. **Create Static Site on Render**
   - New → Static Site
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Set environment variables

---

### **PHASE 4: Update Backend CORS**

After deploying frontend, update backend `FRONTEND_URL` in Render:
- Go to Render dashboard → Your backend service
- Environment → Edit
- Update `FRONTEND_URL` to your deployed frontend URL
- Redeploy

---

### **PHASE 5: Test Everything**

1. **Test Backend**
   - Visit: `https://your-backend.onrender.com`
   - Should see: `{"message":"OneTime Chat Backend API","status":"running"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Create a room
   - Open in two browser windows
   - Test chat and video

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: MongoDB connection fails
- **Solution**: Check MongoDB URI, network access, and password

**Problem**: CORS errors
- **Solution**: Update `FRONTEND_URL` in Render environment variables

**Problem**: Socket.io not connecting
- **Solution**: Check that backend URL is correct in frontend `.env.local`

### Frontend Issues

**Problem**: Can't connect to backend
- **Solution**: Check `NEXT_PUBLIC_BACKEND_URL` environment variable

**Problem**: WebRTC not working
- **Solution**: WebRTC requires HTTPS in production. Both frontend and backend must be HTTPS.

---

## 📝 Environment Variables Checklist

### Backend (Render)
- [ ] `MONGODB_URI`
- [ ] `FRONTEND_URL`
- [ ] `NODE_ENV=production`

### Frontend (Vercel/Render)
- [ ] `NEXT_PUBLIC_BACKEND_URL`

---

## 🎉 You're Done!

Your anonymous chat app is now live with:
- ✅ Real-time chat via Socket.io
- ✅ Video calls via WebRTC
- ✅ MongoDB database
- ✅ Room management
- ✅ Anonymous messaging

**Next Steps:**
- Add Firebase for file storage (optional)
- Add analytics
- Customize UI further
- Add more features!

