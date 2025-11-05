# 🚀 Quick Start - Your Setup

## ✅ Step 1: MongoDB Connection String

**Use this complete connection string:**

```env
mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
```

**Add to `backend/.env`:**
```bash
cd backend
# Create .env file
MONGODB_URI=mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## ❓ Step 2: Firebase - Do You Need It?

### **Short Answer: NO, you don't need it right now!**

Your app works perfectly with:
- ✅ MongoDB (storage)
- ✅ Socket.io (real-time)

### **When to Add Firebase:**
- If you want image/file sharing in chat
- If you want analytics
- If you want push notifications

**For now: Skip Firebase** - Your app is fully functional without it!

---

## 🧪 Step 3: Test Locally

### Backend:
```bash
cd backend
npm install
npm run dev
# Should see: ✅ MongoDB Connected
```

### Frontend:
```bash
# In root directory
npm install
# Create .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
npm run dev
```

### Test:
1. Open `http://localhost:3000`
2. Create a room
3. Open in two browser windows
4. Test chat and video!

---

## 📦 Step 4: Deploy

### Backend to Render:
1. Push to GitHub
2. Deploy on Render
3. Set environment variable:
   ```
   MONGODB_URI=mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
   ```

### Frontend to Vercel:
1. Set environment variable:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   ```
2. Deploy!

---

## 🎉 You're Ready!

- ✅ MongoDB connection string ready
- ✅ Firebase optional (skip for now)
- ✅ Everything configured

**Next:** Follow `LOCAL_TESTING.md` to test, then `DEPLOYMENT.md` to deploy!

