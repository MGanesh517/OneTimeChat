# ⚙️ Render Settings - Exact Configuration

## 🔧 Fix Your Render Deployment

### The Problem:
- ❌ Render is building from root (not `backend/` folder)
- ❌ Render is trying to run `npm run build` (doesn't exist)

### The Solution:
Update these settings in Render Dashboard:

---

## 📋 Exact Settings to Use

### 1. Basic Settings:
```
Name: onetime-chat-backend
Environment: Node
Region: (Choose closest to you)
```

### 2. Build & Deploy Settings (CRITICAL):
```
Root Directory: backend

Build Command: npm install

Start Command: npm start
```

### 3. Environment Variables:
```
MONGODB_URI = mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority

NODE_ENV = production

FRONTEND_URL = https://your-app.vercel.app
(Update this after deploying frontend)
```

---

## 🎯 Step-by-Step Fix

1. **Go to Render Dashboard:**
   - https://dashboard.render.com
   - Click on your service

2. **Click "Settings" tab**

3. **Scroll to "Build & Deploy" section**

4. **Update Root Directory:**
   - Find "Root Directory" field
   - Delete any existing value
   - Type: `backend`
   - ⚠️ **Must be exactly:** `backend` (lowercase, no slash)

5. **Update Build Command:**
   - Find "Build Command" field
   - Change from: `npm install; npm run build`
   - Change to: `npm install`

6. **Verify Start Command:**
   - Should be: `npm start`

7. **Click "Save Changes"**

8. **Render will auto-redeploy** (wait 2-5 minutes)

---

## ✅ Why Backend Has No Build Script

The backend is a **Node.js server**, not a static site:
- ✅ `npm start` - Runs the server
- ✅ `npm run dev` - Development mode
- ❌ No `build` script needed (server runs directly)

Render was confused because:
- It saw a Next.js project in root (has `build` script)
- But backend is separate (no `build` script)

**Solution:** Point Render to `backend/` folder only!

---

## 🔍 Verify Settings

After updating, check:
- ✅ Root Directory = `backend`
- ✅ Build Command = `npm install` (only)
- ✅ Start Command = `npm start`
- ✅ Environment variables are set

---

## 📊 Expected Success

After fixing, Render logs should show:
```
✅ MongoDB Connected: onetimechat.iyvduyc.mongodb.net
🚀 Server running on port 5000
📡 Socket.io ready
```

Your backend URL should work:
- Visit: `https://your-backend.onrender.com`
- Response: `{"message":"OneTime Chat Backend API","status":"running"}`

---

## 🚨 Common Mistakes

❌ **Wrong Root Directory:**
- `./backend` (don't use `./`)
- `/backend` (don't use `/`)
- `backend/` (don't use trailing slash)

✅ **Correct:**
- `backend` (just the folder name)

❌ **Wrong Build Command:**
- `npm install; npm run build` (backend has no build script)
- `npm run build` (doesn't exist)

✅ **Correct:**
- `npm install` (only installs dependencies)

---

## 📝 Quick Reference

**Render Settings:**
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

**Backend package.json scripts:**
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

No `build` script = No problem! Just use `npm install` and `npm start`.

---

**Update these settings and redeploy!** 🚀

