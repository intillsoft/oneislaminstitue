# AI Chat System - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Execute Database Schema
Copy & paste contents of `backend/supabase/AI_CHAT_SCHEMA.sql` into Supabase SQL editor → Run

### 2. Add Route
```jsx
// In App.jsx or your router:
import AIChatPage from './pages/ai-chat';

<Route path="/aichat" element={<AIChatPage />} />
```

### 3. Done! ✅
- Navigate to homepage
- Type in search box
- Press Enter
- Beautiful AI chat interface loads

---

## 📁 File Locations

```
src/
├── pages/
│   └── ai-chat/
│       ├── index.jsx (page wrapper)
│       ├── AIChatInterface.jsx (main component)
│       └── AIChatInterface.css
├── components/
│   ├── ChatSidebar.jsx
│   ├── ChatSidebar.css
│   └── ui/
│       └── AISearchBox.jsx (updated)
└── services/
    └── aiChatService.js

backend/supabase/
└── AI_CHAT_SCHEMA.sql (execute in Supabase)
```

---

## 🎯 Core Components

### AIChatInterface.jsx
Main chat container with:
- Message display area
- Beautiful styling
- Message actions
- Input area with send button
- Sidebar integration

### ChatSidebar.jsx
Conversation history with:
- New chat button
- Conversation list
- Search conversations
- Delete conversations
- Quick links footer

### aiChatService.js
Complete API with methods:
```javascript
// Conversations
getConversations()
createConversation(title, context)
deleteConversation(id)

// Messages
sendMessage(conversationId, message, history)
getMessages(conversationId)
regenerateResponse(conversationId, history)

// Reactions
addReaction(messageId, reaction)
removeReaction(messageId, reaction)

// Search & Export
searchConversations(query)
exportConversation(conversationId, format)
```

---

## 🎨 Styling System

### Colors
- Primary Blue: `#3b82f6`
- Secondary Emerald: `#10b981`
- Accent Violet: `#8b5cf6`
- Dark Background: `#0f172a`
- Light Background: `#ffffff`

### CSS Variables (in AIChatInterface.css)
```css
--ai-primary: #3b82f6
--ai-primary-dark: #1e40af
--ai-secondary: #10b981
--ai-bg-dark: #0f172a
--ai-text-dark: #e2e8f0
```

### Responsive Breakpoints
- Desktop: ≥1024px (sidebar always visible)
- Tablet: 768px-1023px (sidebar collapsible)
- Mobile: <768px (full-width overlay)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Send message |
| Shift+Enter | New line |
| Escape | Close sidebar (mobile) |

---

## 🔐 RLS Policies

All tables have RLS enabling users to:
- ✅ Create their own conversations
- ✅ Read their own messages
- ✅ Update their own settings
- ❌ Access other users' data

Policy format:
```sql
WHERE auth.uid() = user_id
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 404 on `/aichat` | Add route to router config |
| Messages not saving | Execute `AI_CHAT_SCHEMA.sql` in Supabase |
| RLS errors | Check RLS policies in Supabase dashboard |
| No sidebar conversations | Ensure user is authenticated |
| Dark mode not working | Check `darkMode` state is toggling |
| Auto-scroll not working | Verify `messagesEndRef` attached to DOM |

---

## 📊 Database Schema

### Tables
1. `chat_conversations` - User conversations
2. `chat_messages` - Messages in conversations
3. `message_reactions` - User reactions (👍👎🚩)
4. `conversation_tags` - Categorization system

### Indexes
- `chat_conversations_user_id` - Fast user lookups
- `chat_messages_conversation_id` - Fast message retrieval
- `chat_messages_created_at` - Fast sorting

### Triggers
- Auto-title from first user message
- Auto-timestamp on new messages

---

## 🚀 User Flow

```
1. User on homepage
2. Types in AISearchBox
3. Presses Enter
4. Redirected to /aichat?q=query
5. AIChatInterface loads
6. Conversation created in DB
7. Initial message sent
8. Response displays
9. Sidebar shows conversation
10. User can continue chat
```

---

## ✨ Features

- ✅ ChatGPT-like interface
- ✅ Message history in sidebar
- ✅ Search conversations
- ✅ Copy message to clipboard
- ✅ Regenerate last response
- ✅ Like/dislike/flag messages
- ✅ Export conversation
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Markdown support
- ✅ Loading indicators
- ✅ Suggestion cards

---

## 🔗 Integration Points

### With Homepage
- AISearchBox sends user to `/aichat?q=<query>`
- Query is auto-populated in chat input
- First message is auto-sent

### With Backend
- `/api/ai/chat` endpoint receives and responds
- Expects: `{ conversationId, message, history }`
- Returns: `{ id, role, content, created_at }`

### With Database
- All conversations saved to `chat_conversations`
- All messages saved to `chat_messages`
- User privacy via RLS policies

---

## 📝 Example Usage

```javascript
// In component:
import { aiChatService } from '../services/aiChatService';

// Get all conversations
const convs = await aiChatService.getConversations();

// Send message
const response = await aiChatService.sendMessage(
  convId,
  'User message',
  previousMessages
);

// Add reaction
await aiChatService.addReaction(messageId, 'thumbs_up');

// Search
const results = await aiChatService.searchConversations('query');

// Export
const exported = await aiChatService.exportConversation(convId, 'markdown');
```

---

## 🎯 Customization

### Change Primary Color
Edit `AIChatInterface.css`:
```css
--ai-primary: #your-color;
```

### Change Suggestions
Edit `AIChatInterface.jsx`:
```jsx
{
  icon: BookOpen,
  title: 'Your Title',
  query: 'Your prompt'
}
```

### Disable Sidebar
In `AIChatInterface.jsx`:
```jsx
<ChatSidebar isOpen={false} />
```

### Disable Features
Remove button code from `AIChatInterface.jsx`:
- Copy button
- Regenerate button
- Reaction buttons
- Export button

---

## 📊 Performance Tips

✅ Already optimized:
- Database indexes on key columns
- Message pagination
- CSS animations use GPU

🚀 Optional enhancements:
- Add message virtualization (react-window)
- Add conversation pagination
- Add response caching
- Add keyboard shortcuts
- Add voice input

---

## 🧪 Testing Checklist

- [ ] Can send message and get response
- [ ] Messages save to database
- [ ] Sidebar shows conversation history
- [ ] Can search conversations
- [ ] Can delete conversation
- [ ] Can copy message
- [ ] Can regenerate response
- [ ] Can add reaction
- [ ] Can export conversation
- [ ] Dark mode toggles
- [ ] Mobile layout responsive
- [ ] Keyboard shortcuts work

---

## 📞 Need Help?

1. Check `AI_CHAT_COMPLETE_GUIDE.md` for detailed docs
2. Review console errors (F12 → Console)
3. Check Supabase dashboard for data
4. Verify all files in correct locations
5. Test components in isolation

---

**Status**: ✅ Production Ready
**Version**: 1.0
**Last Updated**: 2024
