# ⚠️ IMPORTANT: Check Vercel Environment Variable

## 🔍 The Issue

If you see "CONNECTING..." and it never connects, **most likely** the environment variable is not set correctly in Vercel.

## ✅ Fix Steps

### 1. Check Vercel Environment Variables

1. Go to **Vercel Dashboard**
2. Click your project: `one-time-chat-one`
3. Go to **Settings** → **Environment Variables**
4. Look for: `NEXT_PUBLIC_BACKEND_URL`

### 2. Set the Correct Value

**The value should be:**
```
https://onetimechat.onrender.com
```

**NOT:**
- ❌ `http://onetimechat.onrender.com` (no `http`, use `https`)
- ❌ `https://onetimechat.onrender.com/socket.io` (no path)
- ❌ `wss://onetimechat.onrender.com` (no `wss://`)

**Just the base URL:**
- ✅ `https://onetimechat.onrender.com`

### 3. Redeploy After Setting

1. After setting/updating the variable
2. Go to **Deployments** tab
3. Click the **three dots** (⋯) on latest deployment
4. Click **Redeploy**
5. Or push a new commit to auto-redeploy

### 4. Verify in Browser Console

After redeploy, open browser console (F12) and you should see:
```
🔍 Environment check: { NEXT_PUBLIC_BACKEND_URL: "https://onetimechat.onrender.com", ... }
🔌 Connecting to backend: https://onetimechat.onrender.com
✅ Socket connected: abc123
```

---

## 🔧 Alternative: Hardcode for Testing

If environment variable is not working, temporarily hardcode in `lib/socket.ts`:

```typescript
const backendUrl = 'https://onetimechat.onrender.com';
```

**Then remove after fixing Vercel env var!**

---

## 📝 Checklist

- [ ] Vercel environment variable exists
- [ ] Variable name is exactly: `NEXT_PUBLIC_BACKEND_URL`
- [ ] Value is: `https://onetimechat.onrender.com` (your Render backend URL)
- [ ] Redeployed after setting variable
- [ ] Checked browser console for connection logs

---

**This is the #1 cause of connection issues!** 🎯

