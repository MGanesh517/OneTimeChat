# 🎯 Complete Setup Guide - Ready to Go!

## ✅ Step 1: MongoDB Connection (DONE!)

Your MongoDB connection string is configured:
```
mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
```

**Files created:**
- ✅ `backend/.env` - Backend environment variables
- ✅ `.env.local` - Frontend environment variables

---

## 🧪 Step 2: Test Locally

### Backend Setup:
```bash
cd backend
npm install
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: onetimechat.iyvduyc.mongodb.net
🚀 Server running on port 5000
📡 Socket.io ready
```

### Frontend Setup:
```bash
# In root directory (from backend, go back)
cd ..
npm install
npm run dev
```

**Expected output:**
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
```

### Test:
1. Open `http://localhost:3000`
2. Create a room
3. Open in two browser windows
4. Test chat and video!

---

## 🚀 Step 3: Deploy to Production

### **Backend → Render** (Recommended)

1. **Prepare Backend:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend setup"
   ```

2. **Push to GitHub:**
   - Create new repo on GitHub
   - Push backend folder
   ```bash
   git remote add origin https://github.com/yourusername/onetime-chat-backend.git
   git push -u origin main
   ```

3. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Login
   - Click "New" → "Web Service"
   - Connect GitHub repo
   - Select repository
   - Configure:
     - **Name**: `onetime-chat-backend`
     - **Root Directory**: `backend` (if repo includes frontend)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Set Environment Variables in Render:**
   ```
   MONGODB_URI=mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app (update after deploying frontend)
   ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Copy your backend URL: `https://onetime-chat-backend.onrender.com`

---

### **Frontend → Vercel** (Recommended)

1. **Prepare Frontend:**
   ```bash
   # In root directory
   git init (if not already)
   git add .
   git commit -m "Frontend setup"
   ```

2. **Push to GitHub:**
   - Create new repo on GitHub (or same repo)
   ```bash
   git remote add origin https://github.com/yourusername/onetime-chat.git
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js (auto-detected)
     - **Root Directory**: `./` (root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

4. **Set Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://onetime-chat-backend.onrender.com
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-5 minutes
   - Your app is live!

6. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` to your Vercel URL
   - Redeploy backend

---

## ✅ Step 4: Test Production

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com`
   - Should see: `{"message":"OneTime Chat Backend API","status":"running"}`

2. **Test Frontend:**
   - Visit: `https://your-app.vercel.app`
   - Create a room
   - Open in two browser windows
   - Test chat and video!

---

## 📝 Summary

### ✅ What's Done:
- ✅ MongoDB connection configured
- ✅ Backend environment variables set
- ✅ Frontend environment variables set
- ✅ Ready for local testing
- ✅ Ready for deployment

### 🎯 Next Steps:
1. Test locally (Step 2)
2. Deploy backend to Render (Step 3)
3. Deploy frontend to Vercel (Step 3)
4. Update CORS
5. Test production!

---

## 🔧 Troubleshooting

### MongoDB Connection Issues:
- Check password is correct: `ganesh.517`
- Verify network access allows your IP
- Connection string format is correct

### Backend Won't Start:
- Check `.env` file exists in `backend/` folder
- Verify MongoDB connection string
- Check Node.js version (18+)

### Frontend Can't Connect:
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Verify backend is running
- Check browser console for errors

---

## 🎉 You're All Set!

Everything is configured and ready to go. Start with local testing, then deploy!

**Questions?** Check the other guides:
- `LOCAL_TESTING.md` - Detailed local testing
- `DEPLOYMENT.md` - Full deployment guide
- `HOSTING_RECOMMENDATION.md` - Why we chose Render + Vercel

