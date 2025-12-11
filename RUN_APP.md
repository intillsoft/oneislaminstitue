# 🚀 Running the App on Localhost

## ✅ Frontend is Starting!

The frontend server should be starting now. It will open at:
**http://localhost:5173** (or http://localhost:3000)

---

## 📋 Quick Checklist

### ✅ Frontend (Starting Now)
- [x] Dependencies installed
- [x] Server starting
- [ ] Open http://localhost:5173 in browser

### ⚠️ Backend (Optional - for AI features)
- [ ] Navigate to `backend` folder
- [ ] Create `backend/.env` file
- [ ] Run `npm install`
- [ ] Run `npm start`

---

## 🌐 Access the App

Once the server starts, open your browser to:
- **Frontend:** http://localhost:5173
- **Backend (if running):** http://localhost:3001

---

## 🔧 If Frontend Doesn't Start

### Check for errors:
1. Look at the terminal output
2. Check if port 5173 is already in use
3. Verify `.env` file exists (optional for basic features)

### Common Issues:

**Port already in use:**
```bash
# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Missing dependencies:**
```bash
npm install
```

**Missing .env:**
- Create `.env` file in project root
- Add at minimum:
  ```env
  VITE_SUPABASE_URL=your_url
  VITE_SUPABASE_ANON_KEY=your_key
  VITE_API_URL=http://localhost:3001/api
  ```

---

## 🎯 What Works Without Backend

- ✅ UI and navigation
- ✅ Authentication UI (needs Supabase)
- ✅ Job search UI (needs Supabase)
- ✅ Resume builder UI
- ✅ Dashboard UI

**Note:** To use real data, you need:
1. Supabase database set up
2. `.env` file with Supabase credentials

---

## 🚀 Start Backend (For AI Features)

If you want AI features, payments, and emails:

```bash
# Open new terminal
cd backend
npm install
npm start
```

Backend will run on http://localhost:3001

---

## ✅ Success!

If you see the app in your browser, you're all set! 🎉

**Next Steps:**
1. Set up Supabase (see `QUICK_START.md`)
2. Create `.env` file
3. Start backend (optional)

