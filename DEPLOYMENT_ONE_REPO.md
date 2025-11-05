# 🚀 Deployment Guide - One Repository (Frontend + Backend)

## ✅ Yes! You Can Use One Repository!

You can absolutely use **one GitHub repository** for both frontend and backend, and deploy them separately to:
- **Backend → Render** (from `backend/` folder)
- **Frontend → Vercel** (from root folder)

---

## 📁 Repository Structure

Your repository structure should look like this:

```
OneTimeChat/
├── app/                    # Frontend (Next.js)
├── components/             # Frontend components
├── lib/                    # Frontend utilities
├── hooks/                  # Frontend hooks
├── contexts/               # Frontend contexts
├── package.json           # Frontend dependencies
├── next.config.js         # Frontend config
├── tailwind.config.ts     # Frontend config
│
├── backend/               # Backend (Node.js)
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── package.json       # Backend dependencies
│   └── .env               # Backend env (NOT in git)
│
├── README.md
├── .gitignore
└── .env.local             # Frontend env (NOT in git)
```

---

## 📝 Step 1: Commit Everything to GitHub

### Initialize Git (if not already done):

```bash
# In root directory
git init
git add .
git commit -m "Initial commit - Frontend and Backend"
```

### Create GitHub Repository:

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `onetime-chat` (or any name)
4. **Don't** initialize with README (you already have files)
5. Click "Create repository"

### Push to GitHub:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/onetime-chat.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Done!** Both frontend and backend are now in one repository.

---

## 🚀 Step 2: Deploy Backend to Render

### Configure Render:

1. Go to [render.com](https://render.com)
2. Sign up/Login
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Select your repository: `onetime-chat`

### Render Settings:

**Basic Settings:**
- **Name**: `onetime-chat-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you

**Build & Deploy:**
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid if needed)

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app (update after deploying frontend)
```

**⚠️ Important:** 
- Set **Root Directory** to `backend`
- This tells Render to only look in the `backend/` folder

### Deploy:
- Click "Create Web Service"
- Wait 5-10 minutes
- Copy your backend URL: `https://onetime-chat-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### Configure Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository: `onetime-chat`

### Vercel Settings:

**Project Settings:**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (root - leave empty) ⚠️ **IMPORTANT!**
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Environment Variables:**
```
NEXT_PUBLIC_BACKEND_URL=https://onetime-chat-backend.onrender.com
```

**⚠️ Important:**
- **Root Directory** should be `./` (root) or leave empty
- This tells Vercel to build from the root folder (where `package.json` is)

### Deploy:
- Click "Deploy"
- Wait 2-5 minutes
- Your app is live!

---

## 🔄 Step 4: Update Backend CORS

After frontend is deployed:

1. Go to Render dashboard
2. Go to your backend service
3. Click "Environment"
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Click "Save Changes"
6. Render will auto-redeploy

---

## ✅ Step 5: Test Everything

### Test Backend:
- Visit: `https://your-backend.onrender.com`
- Should see: `{"message":"OneTime Chat Backend API","status":"running"}`

### Test Frontend:
- Visit: `https://your-app.vercel.app`
- Create a room
- Open in two browser windows
- Test chat and video!

---

## 📋 Summary

### One Repository Structure:
```
✅ Root: Frontend (Next.js)
✅ backend/: Backend (Node.js)
✅ Both in same GitHub repo
```

### Deployment:
```
✅ Render: Deploys from backend/ folder
✅ Vercel: Deploys from root folder
✅ Both use same GitHub repo
```

### Key Settings:

**Render:**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

**Vercel:**
- Root Directory: `./` (root)
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)

---

## 🔧 Troubleshooting

### Render Can't Find Backend Files:
- **Problem**: Build fails
- **Solution**: Check "Root Directory" is set to `backend`

### Vercel Can't Build:
- **Problem**: Build fails
- **Solution**: Check "Root Directory" is `./` or empty (root)

### Backend CORS Error:
- **Problem**: Frontend can't connect
- **Solution**: Update `FRONTEND_URL` in Render to your Vercel URL

---

## 🎉 You're Done!

**One repository, two deployments:**
- ✅ Backend on Render
- ✅ Frontend on Vercel
- ✅ Both from same GitHub repo

**Next:** Follow the steps above to deploy!

