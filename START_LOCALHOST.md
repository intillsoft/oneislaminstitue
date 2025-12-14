# 🚀 Starting the Application on Localhost

## Quick Start

### Option 1: Start Both Servers (Recommended)

**In Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**In Terminal 2 (Frontend):**
```bash
npm start
```

### Option 2: Use the Batch File (Windows)

**Start Backend:**
```bash
START_BACKEND.bat
```

**Start Frontend (in a new terminal):**
```bash
npm start
```

---

## Server URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

The frontend will automatically open in your browser when it starts.

---

## Environment Variables Required

### Frontend (.env in root directory)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env in backend directory)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
FRONTEND_URL=http://localhost:3000
```

See `backend/env.example` for all backend environment variables.

---

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:
- **Frontend:** Change port in `vite.config.mjs` (line 21)
- **Backend:** Change `PORT` in `backend/.env`

### Backend Not Starting
- Check if `backend/.env` exists
- Verify all required environment variables are set
- Check `backend/logs/` for error messages

### Frontend Not Connecting to Backend
- Verify `VITE_API_URL=http://localhost:3001/api` in root `.env`
- Ensure backend is running on port 3001
- Check browser console for CORS errors

### Jobs Not Appearing
- Verify Supabase RLS policies are set correctly
- Check that jobs have status 'active' or 'published'
- Ensure user is authenticated

---

## Current Status

✅ **All Critical Fixes Applied:**
- Role-based navigation fixed
- Jobs display fixed
- Dark mode fixed
- Error handling improved
- Profile loading fixed

The application is ready to run!











