# MongoDB Connection String Setup

## Your Connection String

Your current string:
```
mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/
```

## ✅ Complete Connection String (Use This!)

Add the database name and query parameters:

```
mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
```

**What to add:**
- Database name: `/onetimechat` (after the last `/`)
- Query params: `?retryWrites=true&w=majority` (for reliability)

## Where to Use It

### Backend `.env` file:
```env
MONGODB_URI=mongodb+srv://oneTimeChat:ganesh.517@onetimechat.iyvduyc.mongodb.net/onetimechat?retryWrites=true&w=majority
```

### For Render Deployment:
Use the same string in Render environment variables.

## 🔒 Security Note

⚠️ **Important**: Never commit your `.env` file to GitHub!
- The connection string contains your password
- Always use environment variables
- `.env` is already in `.gitignore`

