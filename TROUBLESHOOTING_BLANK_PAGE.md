# Troubleshooting: Blank Page / No Content Visible

## Quick Fix Steps

### 1. **Check Browser Console**
Open DevTools (F12) → Console tab
- Look for any red error messages
- Share any errors you see

### 2. **Hard Refresh Browser**
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 3. **Clear Browser Cache**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 4. **Check Network Tab**
In DevTools → Network tab:
- Look for failed requests (red)
- Check if files are loading (status 200)

### 5. **Verify Files Exist**
Check if these files are present:
- ✅ `src/pages/HomePage.jsx`
- ✅ `src/components/chat/BoltBaseChat.jsx`
- ✅ `src/components/chat/BoltMessages.jsx`
- ✅ `src/components/chat/BoltMarkdown.jsx`
- ✅ `src/components/chat/BoltSidebar.jsx`

### 6. **Check Route Configuration**
Verify `src/Routes.jsx` has:
```jsx
<Route path="/" element={<HomePage />} />
```

## What You Should See

When working correctly, you should see:
- Dark background (#0A0E27 - very dark blue/black)
- White text: "What will you **build** today?"
- Gray subtitle: "Create stunning apps & websites by chatting with AI."
- Large input box at the bottom (dark gray/transparent)
- Example prompts below input

## If Still Blank

### Temporary Test Version
Replace `src/pages/HomePage.jsx` with this test version:

```jsx
import React from 'react';

const HomePage = () => {
  return (
    <div style={{ 
      backgroundColor: '#0A0E27', 
      color: 'white', 
      padding: '50px',
      minHeight: '100vh',
      fontSize: '24px'
    }}>
      <h1>TEST - Can you see this text?</h1>
      <p>If you can see this, the page is loading but the chat component might have issues.</p>
    </div>
  );
};

export default HomePage;
```

If you see "TEST - Can you see this text?", the routing works but the BoltBaseChat component has an issue.

## Common Issues

1. **JavaScript Error**: Check browser console
2. **Import Error**: Component files missing or wrong paths
3. **CSS Issue**: Content rendering but invisible
4. **Auth Context**: Error in AuthContext blocking render
5. **Animation Issue**: Framer Motion animation stuck

## Next Steps
1. Open browser console (F12)
2. Take screenshot of any errors
3. Share what you see (or don't see)
4. Check Network tab for failed requests

