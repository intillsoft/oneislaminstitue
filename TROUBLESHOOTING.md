# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Failed to resolve import @supabase/supabase-js"

**Solution:**

1. **Install the package:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **If that doesn't work, try:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Restart the dev server:**
   - Stop the current dev server (Ctrl+C)
   - Start it again: `npm start`

4. **Verify installation:**
   ```bash
   npm list @supabase/supabase-js
   ```

### Issue: "VITE_SUPABASE_URL is not defined"

**Solution:**

1. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Restart the dev server after adding environment variables

3. Make sure variable names start with `VITE_` for Vite to expose them

### Issue: "Module not found" errors

**Solution:**

1. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm start
   ```

2. **Check if package is in package.json:**
   ```bash
   cat package.json | grep supabase
   ```

3. **Reinstall all dependencies:**
   ```bash
   npm install
   ```

### Issue: Authentication not working

**Solution:**

1. **Check environment variables are set:**
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL);
   ```

2. **Verify Supabase credentials:**
   - Go to Supabase Dashboard
   - Check Project Settings > API
   - Verify URL and anon key

3. **Check browser console for errors**

### Issue: CORS errors

**Solution:**

1. **Check Supabase CORS settings:**
   - Go to Supabase Dashboard
   - Settings > API
   - Add your domain to allowed origins

2. **Verify backend CORS configuration:**
   ```javascript
   // backend/server.js
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
   }));
   ```

### Issue: RLS (Row Level Security) errors

**Solution:**

1. **Check RLS policies in Supabase:**
   ```sql
   -- Check if RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

2. **Verify user is authenticated:**
   ```javascript
   const { data: { user } } = await supabase.auth.getUser();
   console.log('User:', user);
   ```

3. **Check policy allows access:**
   ```sql
   -- View policies
   SELECT * FROM pg_policies WHERE tablename = 'your_table';
   ```

### Issue: API requests failing

**Solution:**

1. **Check backend server is running:**
   ```bash
   cd backend
   npm start
   ```

2. **Verify API URL in .env:**
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Check network tab in browser DevTools:**
   - Look for failed requests
   - Check response status codes
   - Verify request headers

### Issue: Build errors

**Solution:**

1. **Clear build cache:**
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

2. **Check for TypeScript errors:**
   ```bash
   npm run type-check  # if available
   ```

3. **Verify all imports are correct:**
   - Check file paths
   - Verify package names
   - Check for circular dependencies

## Quick Fixes

### Restart Everything

```bash
# Stop all processes
# Then:
rm -rf node_modules package-lock.json
npm install
npm start
```

### Check Environment

```bash
# Windows PowerShell
Get-Content .env

# Linux/Mac
cat .env
```

### Verify Dependencies

```bash
npm list --depth=0
```

## Still Having Issues?

1. **Check the console:**
   - Browser DevTools Console
   - Terminal output
   - Network tab

2. **Check logs:**
   - Backend logs: `backend/logs/`
   - Browser console errors

3. **Verify versions:**
   ```bash
   node --version
   npm --version
   ```

4. **Update dependencies:**
   ```bash
   npm update
   ```

## Getting Help

- Check [Integration Guide](./INTEGRATION_GUIDE.md)
- Review [Supabase Docs](https://supabase.com/docs)
- Check [Vite Docs](https://vitejs.dev/guide/troubleshooting.html)

