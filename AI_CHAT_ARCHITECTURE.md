# AI Chat System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              HOMEPAGE                                    │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  AISearchBox Component                          │    │   │
│  │  │  ┌──────────────────────────────────────────┐   │    │   │
│  │  │  │ "Ask Academic Assistant..."              │   │    │   │
│  │  │  │ Placeholder cycles every 3 seconds       │   │    │   │
│  │  │  │ Gradient animation (green/blue/cyan)     │   │    │   │
│  │  │  │                                          │   │    │   │
│  │  │  │ [User Types Query]  [🔍]                │   │    │   │
│  │  │  │ Presses Enter ──→ navigate to /aichat   │   │    │   │
│  │  │  └──────────────────────────────────────────┘   │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           │ navigate("/aichat?q=<query>")       │
│                           ↓                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AI CHAT INTERFACE PAGE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Route: /aichat?q=<query>  →  AIChatPage Component             │
│                                     │                            │
│                                     ↓                            │
│                    Extract query from URL params                │
│                    Pass to AIChatInterface                      │
│                                     │                            │
│         ┌───────────────────────────┼───────────────────────────┐│
│         │                           │                           ││
│         ↓                           ↓                           ↓│
│    ┌─────────────────┐  ┌────────────────────┐  ┌──────────────┐
│    │  ChatSidebar    │  │  Main Chat Area    │  │  Theme Ctrl  │
│    │                 │  │                    │  │  (Dark/Light)│
│    │ ┌─────────────┐ │  │ ┌────────────────┐ │  └──────────────┘
│    │ │ New Chat    │ │  │ │   Header       │ │
│    │ │ Button      │ │  │ │   (Title)      │ │
│    │ └─────────────┘ │  │ └────────────────┘ │
│    │                 │  │ ┌────────────────┐ │
│    │ ┌─────────────┐ │  │ │ Messages Area  │ │
│    │ │ Search Box  │ │  │ │                │ │
│    │ │ (Find Conv) │ │  │ │ Welcome State: │ │
│    │ └─────────────┘ │  │ │ - Suggestion   │ │
│    │                 │  │ │   Cards        │ │
│    │ ┌─────────────┐ │  │ │ OR Messages:   │ │
│    │ │ Conv List   │ │  │ │ - User Bubble  │ │
│    │ │ - Title     │ │  │ │   (Blue)       │ │
│    │ │ - Date      │ │  │ │ - Assistant    │ │
│    │ │ - [×]Delete │ │  │ │   Bubble       │ │
│    │ │             │ │  │ │   (Emerald)    │ │
│    │ │ Click to    │ │  │ │ - Markdown     │ │
│    │ │ Load Conv   │ │  │ │   Rendered     │ │
│    │ └─────────────┘ │  │ │ - Hover to     │ │
│    │                 │  │ │   show actions │ │
│    │ ┌─────────────┐ │  │ │   (copy,       │ │
│    │ │ Quick Links │ │  │ │    regen,      │ │
│    │ │ - Browse    │ │  │ │    reactions)  │ │
│    │ │ - Path      │ │  │ │ - Typing       │ │
│    │ │ - Help      │ │  │ │   indicator    │ │
│    │ └─────────────┘ │  │ │   (animated    │ │
│    │                 │  │ │    dots)       │ │
│    │ (Collapsible on │  │ └────────────────┘ │
│    │  Mobile)        │  │ ┌────────────────┐ │
│    └─────────────────┘  │ │ Input Area     │ │
│         (320px)         │ │                │ │
│                         │ │ ┌────────────┐ │ │
│                         │ │ │ Action     │ │ │
│                         │ │ │ Buttons    │ │ │
│                         │ │ │ -Regenerate│ │ │
│                         │ │ └────────────┘ │ │
│                         │ │                │ │
│                         │ │ ┌────────────┐ │ │
│                         │ │ │ Textarea   │ │ │
│                         │ │ │ (auto-     │ │ │
│                         │ │ │  expand)   │ │ │
│                         │ │ │            │ │ │
│                         │ │ │ "Ask me    │ │ │
│                         │ │ │  anything" │ │ │
│                         │ │ └────────────┘ │ │
│                         │ │                │ │
│                         │ │ [Send Button]  │ │
│                         │ └────────────────┘ │
│                         │                    │
│                         │ Disclaimer: "AI   │
│                         │  can provide      │
│                         │  guidance..."     │
│                         └────────────────────┘
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ User sends message
                             ↓

┌─────────────────────────────────────────────────────────────────┐
│                    DATA & SERVICE LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User sends message → AIChatInterface                           │
│  ├─→ Call: aiChatService.sendMessage(                           │
│  │     conversationId,                                          │
│  │     userMessage,                                             │
│  │     previousMessages                                         │
│  │   )                                                           │
│  │                                                               │
│  └─→ aiChatService.js (~400 lines)                              │
│      │                                                           │
│      ├─→ Save user message to Supabase                          │
│      │   INSERT INTO chat_messages                              │
│      │                                                           │
│      ├─→ Call backend: POST /api/ai/chat                        │
│      │   ├─ Send: { conversationId, message, history }         │
│      │   ├─ Receive: { id, role, content, metadata }           │
│      │   └─ Backend uses LLM (GPT-4, Gemini, etc)              │
│      │                                                           │
│      ├─→ Save AI response to Supabase                           │
│      │   INSERT INTO chat_messages                              │
│      │                                                           │
│      └─→ Return response to Component                           │
│          display in chat bubble                                 │
│                                                                   │
│                       ↓                                          │
│                                                                   │
│  DATABASE LAYER (Supabase PostgreSQL)                           │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                                                      │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │ chat_conversations                            │ │      │
│  │  │ ┌──────────┬────────┬──────────┬────────────┐ │ │      │
│  │  │ │ id       │ title  │ user_id  │ created_at │ │ │      │
│  │  │ │ UUID     │ String │ UUID     │ Timestamp  │ │ │      │
│  │  │ │ (PK)     │ (Auto) │ (FK auth)│ (Auto)     │ │ │      │
│  │  │ └──────────┴────────┴──────────┴────────────┘ │ │      │
│  │  │ RLS: WHERE auth.uid() = user_id               │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │                                                      │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │ chat_messages                                  │ │      │
│  │  │ ┌──────────┬──────────┬──────┬────────────┐   │ │      │
│  │  │ │ id       │ conv_id  │ role │ content    │   │ │      │
│  │  │ │ UUID(PK) │ UUID(FK) │ Enum │ Text       │   │ │      │
│  │  │ │          │          │user/ │ (Markdown) │   │ │      │
│  │  │ │          │          │assist│            │   │ │      │
│  │  │ └──────────┴──────────┴──────┴────────────┘   │ │      │
│  │  │ Auto-trigger: Auto-title conv from 1st msg    │ │      │
│  │  │ RLS: Via chat_conversations user_id via FK    │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │                                                      │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │ message_reactions                              │ │      │
│  │  │ ┌──────────┬──────────┬─────────┬──────────┐   │ │      │
│  │  │ │ id       │ msg_id   │ reaction│ user_id  │   │ │      │
│  │  │ │ UUID(PK) │ UUID(FK) │ Enum    │ UUID(FK) │   │ │      │
│  │  │ │          │          │👍👎🚩│             │   │ │      │
│  │  │ └──────────┴──────────┴─────────┴──────────┘   │ │      │
│  │  │ RLS: WHERE auth.uid() = user_id                │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │                                                      │      │
│  │  ┌────────────────────────────────────────────────┐ │      │
│  │  │ conversation_tags                              │ │      │
│  │  │ ┌──────────┬──────────┬────────┐              │ │      │
│  │  │ │ id       │ conv_id  │ tag    │              │ │      │
│  │  │ │ UUID(PK) │ UUID(FK) │ String │              │ │      │
│  │  │ └──────────┴──────────┴────────┘              │ │      │
│  │  │ RLS: Via chat_conversations user_id via FK    │ │      │
│  │  └────────────────────────────────────────────────┘ │      │
│  │                                                      │      │
│  │  INDEXES (Performance Optimization)                │ │      │
│  │  • chat_conversations_user_id (PK lookup)         │ │      │
│  │  • chat_messages_conversation_id (FK join)        │ │      │
│  │  • chat_messages_created_at (sorting)             │ │      │
│  │  • Full-text search index on content              │ │      │
│  │                                                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Dependency Tree

```
App (Routes)
│
└─── Route: /aichat
     │
     └─── AIChatPage (src/pages/ai-chat/index.jsx)
          │
          │ Extracts ?q= param
          │
          └─── AIChatInterface (src/pages/ai-chat/AIChatInterface.jsx)
               │
               ├─── State Management
               │    ├─ conversation (current conv)
               │    ├─ messages (message array)
               │    ├─ input (textarea)
               │    ├─ loading (sending state)
               │    ├─ sidebarOpen (mobile toggle)
               │    ├─ darkMode (theme toggle)
               │    └─ copied (copy button feedback)
               │
               ├─── Hooks
               │    ├─ useAuthContext (get user)
               │    ├─ useRef (messagesEndRef, textareaRef)
               │    ├─ useState (all state)
               │    └─ useEffect (init, scroll, auto-send)
               │
               ├─── Child: ChatSidebar (src/components/ChatSidebar.jsx)
               │    │
               │    ├─── Props
               │    │    ├─ isOpen (toggle)
               │    │    ├─ onClose (callback)
               │    │    ├─ onNewChat (callback)
               │    │    └─ conversation (current conv)
               │    │
               │    ├─── State
               │    │    ├─ conversations (list)
               │    │    ├─ searchQuery (search filter)
               │    │    ├─ selectedConversation (current)
               │    │    └─ showDeleteConfirm (modal)
               │    │
               │    └─── Functions
               │         ├─ loadConversations()
               │         ├─ handleNewChat()
               │         ├─ handleSelectConversation()
               │         ├─ handleDeleteConversation()
               │         └─ handleSearchConversations()
               │
               ├─── Message Display
               │    ├─ ChatMessage (virtual - no separate component)
               │    │  ├─ Avatar (user vs assistant)
               │    │  ├─ Header (name, timestamp)
               │    │  ├─ Content (markdown rendered)
               │    │  └─ Actions (copy, regenerate, reactions)
               │    │
               │    └─ Loading State
               │       └─ Animated dots (3-dot typing indicator)
               │
               ├─── Input Area
               │    ├─ Textarea (auto-expanding)
               │    ├─ Send Button
               │    ├─ Action Buttons (regenerate, etc)
               │    └─ Character Display
               │
               ├─── Services (Called)
               │    └─ aiChatService (src/services/aiChatService.js)
               │       ├─ Methods
               │       │  ├─ getConversations()
               │       │  ├─ createConversation()
               │       │  ├─ sendMessage()
               │       │  ├─ regenerateResponse()
               │       │  ├─ addReaction()
               │       │  ├─ deleteConversation()
               │       │  ├─ searchConversations()
               │       │  └─ exportConversation()
               │       │
               │       └─ Dependencies
               │          ├─ supabase client (DB access)
               │          └─ apiService (backend calls)
               │
               └─── Styling (CSS)
                    ├─ AIChatInterface.css (~600 lines)
                    └─ ChatSidebar.css (~400 lines)

```

---

## Data Flow Diagram

```
USER INPUT
    │
    ├─→ Type message in textarea
    │   ├─ Auto-expand textarea on input
    │   └─ Show character count
    │
    ├─→ Press Enter (or click Send)
    │   └─ Validate: not empty, not loading
    │
    ├─→ STEP 1: Display User Message
    │   ├─ Add to messages state
    │   ├─ Clear input textarea
    │   ├─ Set loading = true
    │   └─ Auto-scroll to bottom
    │
    ├─→ STEP 2: Call AI Service
    │   │
    │   └─ aiChatService.sendMessage(convId, msg, history)
    │      │
    │      ├─→ Build request:
    │      │   {
    │      │     conversationId: UUID,
    │      │     message: string,
    │      │     history: [{role, content}, ...]
    │      │   }
    │      │
    │      ├─→ Save user message to DB:
    │      │   INSERT INTO chat_messages
    │      │   (conversation_id, role, content, user_id)
    │      │   VALUES (...)
    │      │   RETURN new message
    │      │
    │      ├─→ Call Backend:
    │      │   POST /api/ai/chat
    │      │   Backend calls LLM
    │      │   Returns AI response
    │      │
    │      ├─→ Save AI message to DB:
    │      │   INSERT INTO chat_messages
    │      │   (conversation_id, role, content, metadata)
    │      │   VALUES (...)
    │      │   RETURN message with id
    │      │
    │      └─→ Return to component
    │
    ├─→ STEP 3: Display AI Response
    │   ├─ Add to messages state
    │   ├─ Render with markdown
    │   ├─ Show hover actions
    │   └─ Set loading = false
    │
    └─→ STEP 4: Update Sidebar
        └─ Refresh conversation list
           (shows in sidebar with new message count)


MESSAGE ACTIONS

Copy Message
    └─ navigator.clipboard.writeText(content)
       └─ Show "Copied!" feedback (2 sec)

Regenerate Response
    ├─ Remove last assistant message
    ├─ Call aiChatService.regenerateResponse()
    │  └─ With conversation history
    ├─ Backend re-runs LLM
    └─ Display new response

Add Reaction
    ├─ Show reaction options (👍👎🚩)
    ├─ Call aiChatService.addReaction(msgId, emoji)
    ├─ Save to message_reactions table
    └─ Update UI (optional visual feedback)

Export Conversation
    ├─ Select format (JSON/Markdown/TXT)
    ├─ Call aiChatService.exportConversation(convId, format)
    ├─ Format all messages
    ├─ Create download file
    └─ Trigger browser download


SIDEBAR INTERACTIONS

New Chat
    └─ aiChatService.createConversation()
       ├─ INSERT into chat_conversations
       ├─ Return new conv
       ├─ Set as active
       └─ Clear messages

Search Conversations
    └─ aiChatService.searchConversations(query)
       ├─ Full-text search on content
       ├─ Filter by title
       └─ Return matching results

Select Conversation
    ├─ Set active conversation
    ├─ Load messages via aiChatService.getMessages(convId)
    ├─ Display in main area
    ├─ Close sidebar (mobile)
    └─ User can continue

Delete Conversation
    ├─ Show confirmation dialog
    └─ aiChatService.deleteConversation(convId)
       ├─ DELETE FROM chat_conversations (cascade deletes messages)
       ├─ Remove from list
       └─ If active, create new conversation


SECURITY LAYER

RLS Policies
    ├─ chat_conversations
    │  └─ WHERE auth.uid() = user_id
    │
    ├─ chat_messages
    │  └─ VIA conversation.user_id = auth.uid()
    │
    ├─ message_reactions
    │  └─ WHERE auth.uid() = user_id
    │
    └─ conversation_tags
       └─ VIA conversation.user_id = auth.uid()

Authentication Check
    ├─ AIChatInterface checks useAuthContext
    ├─ If no user, redirect to login
    └─ All DB queries filtered by auth.uid()


STYLING SYSTEM

CSS Variables
    ├─ Colors (primary, secondary, accent)
    ├─ Sizing (spaces, widths)
    ├─ Transitions (duration, easing)
    └─ Shadows (elevation)

Dark Mode Implementation
    ├─ darkMode state (React)
    ├─ Applied to container class
    └─ CSS uses :root and .dark overrides

Responsive Design
    ├─ Desktop (≥1024px)
    │  └─ Sidebar: 320px fixed
    │  └─ Messages: flex-1
    │
    ├─ Tablet (768-1023px)
    │  └─ Sidebar: Collapsible overlay
    │  └─ Menu button: Visible
    │
    └─ Mobile (<768px)
       └─ Sidebar: Full-width overlay
       └─ Optimized touch targets
       └─ Stack all vertically


PERFORMANCE OPTIMIZATIONS

Database
    ├─ Indexes on user_id, conversation_id, created_at
    ├─ LIMIT 50 on conversation fetch
    └─ Pagination ready

Frontend
    ├─ useCallback for event handlers
    ├─ useRef for DOM access (no re-renders)
    ├─ CSS animations use GPU (transform, opacity)
    └─ AnimatePresence for exit animations

Loading States
    ├─ Show loading indicator during send
    ├─ Disable input while loading
    ├─ Animated typing dots
    └─ Error messages inline


ERROR HANDLING

Try-Catch Blocks
    ├─ All service methods wrapped
    ├─ All event handlers wrapped
    └─ All API calls wrapped

User Feedback
    ├─ Error messages displayed in chat
    ├─ Console logging for debugging
    └─ Network errors show friendly message

Fallbacks
    ├─ If conversation creation fails, show error
    ├─ If send fails, keep message in input
    └─ If DB unavailable, show appropriate message
```

---

## Integration Points with Existing System

```
Homepage
│
└─── AISearchBox Component
     │
     ├─→ Updated with navigation logic
     │   └─ navigate("/aichat?q=" + encodeURIComponent(query))
     │
     └─→ Gradient Animation
         └─ Gemini-style rotating colors

                    ↓ (User presses Enter)

/aichat Route
│
└─── AIChatPage Component
     │
     ├─→ Extracts URL query (?q=<search>)
     │
     └─→ Passes to AIChatInterface
         │
         └─→ Auto-sends initial message

                    ↓ (AI Response)

Backend API: /api/ai/chat
│
└─→ Receives: { conversationId, message, history }
    │
    ├─→ Calls LLM (GPT-4, Gemini, Claude, etc)
    │
    └─→ Returns: { id, role, content, metadata }

                    ↓ (Save & Display)

Supabase Database
│
├─→ chat_conversations table
│   └─ User's conversations stored
│
├─→ chat_messages table
│   └─ All messages stored with role (user/assistant)
│
├─→ message_reactions table
│   └─ User feedback (thumbs up/down/flag)
│
└─→ RLS Policies
    └─ Ensure user privacy (can only access own data)

                    ↓ (UI Update)

AIChatInterface Component
│
├─→ Display in chat bubble
├─→ Render markdown
├─→ Show message actions
└─→ Auto-scroll to bottom
```

---

## File Dependency Graph

```
App.jsx / Router
│
├─→ pages/HomePage.jsx
│   └─→ components/ui/AISearchBox.jsx (UPDATED)
│       └─→ navigate("/aichat?q=...")
│
└─→ Route: /aichat
    │
    └─→ pages/ai-chat/index.jsx
        │
        └─→ pages/ai-chat/AIChatInterface.jsx (350 lines)
            │
            ├─→ IMPORTS:
            │   ├─ React, hooks (useState, useEffect, useRef)
            │   ├─ framer-motion (motion, AnimatePresence)
            │   ├─ lucide-react (icons: Send, Brain, Copy, etc)
            │   ├─ contexts/AuthContext (useAuthContext)
            │   ├─ services/aiChatService (all CRUD methods)
            │   ├─ utils/markdownRenderer (renderMarkdown)
            │   ├─ ./ChatSidebar (component)
            │   └─ ./AIChatInterface.css (styling)
            │
            ├─→ STATE:
            │   ├─ conversation (current conv)
            │   ├─ messages (message array)
            │   ├─ input (textarea value)
            │   ├─ loading (bool)
            │   ├─ sidebarOpen (bool)
            │   ├─ darkMode (bool)
            │   └─ copied (string for feedback)
            │
            ├─→ FUNCTIONS:
            │   ├─ initializeConversation()
            │   ├─ handleSendMessage()
            │   ├─ handleCopyMessage()
            │   ├─ handleRegenerateLast()
            │   ├─ handleReaction()
            │   ├─ handleExportConversation()
            │   └─ scrollToBottom()
            │
            ├─→ EFFECTS:
            │   ├─ Initialize conversation on mount
            │   ├─ Auto-scroll on messages change
            │   └─ Auto-send initial query
            │
            ├─→ RENDERS:
            │   ├─ ChatSidebar (props: isOpen, onClose, etc)
            │   │   │
            │   │   └─→ components/ChatSidebar.jsx (250 lines)
            │   │       │
            │   │       ├─→ IMPORTS:
            │   │       │   ├─ React hooks
            │   │       │   ├─ framer-motion
            │   │       │   ├─ lucide-react
            │   │       │   ├─ useNavigate
            │   │       │   ├─ aiChatService
            │   │       │   └─ ./ChatSidebar.css
            │   │       │
            │   │       ├─→ STATE:
            │   │       │   ├─ conversations (list)
            │   │       │   ├─ searchQuery (search)
            │   │       │   ├─ loading (bool)
            │   │       │   ├─ selectedConversation (id)
            │   │       │   └─ showDeleteConfirm (id)
            │   │       │
            │   │       ├─→ FUNCTIONS:
            │   │       │   ├─ loadConversations()
            │   │       │   ├─ handleNewChat()
            │   │       │   ├─ handleSelectConversation()
            │   │       │   ├─ handleDeleteConversation()
            │   │       │   └─ handleSearchConversations()
            │   │       │
            │   │       ├─→ EFFECTS:
            │   │       │   ├─ Load conversations on mount
            │   │       │   └─ Update selected on prop change
            │   │       │
            │   │       └─→ RENDERS:
            │   │           ├─ Overlay (mobile)
            │   │           ├─ Sidebar container
            │   │           ├─ Header with branding
            │   │           ├─ New Chat button
            │   │           ├─ Search input
            │   │           ├─ Conversation list
            │   │           │   ├─ Loading state
            │   │           │   ├─ Empty state
            │   │           │   └─ Conversation items
            │   │           │       ├─ Select button
            │   │           │       ├─ Delete button
            │   │           │       └─ Delete confirm modal
            │   │           └─ Footer (quick links)
            │   │
            │   ├─ Main Chat Area
            │   │   ├─ Header (title, theme toggle, export)
            │   │   ├─ Messages Container
            │   │   │   ├─ Welcome state OR
            │   │   │   └─ Messages list
            │   │   │       ├─ User message bubble
            │   │   │       ├─ Assistant message bubble
            │   │   │       │   ├─ Markdown content
            │   │   │       │   ├─ Message actions
            │   │   │       │   └─ Reactions
            │   │   │       └─ Typing indicator (if loading)
            │   │   └─ Input Area
            │   │       ├─ Regenerate button
            │   │       ├─ Textarea (auto-expand)
            │   │       ├─ Send button
            │   │       └─ Disclaimer text
            │   │
            │   └─→ CSS STYLING
            │       └─→ pages/ai-chat/AIChatInterface.css (600 lines)
            │           ├─ CSS variables (:root)
            │           ├─ Container layout (flex)
            │           ├─ Header styling
            │           ├─ Messages area (scrollable)
            │           ├─ Message bubbles (user vs assistant)
            │           ├─ Message actions (hover)
            │           ├─ Input area
            │           ├─ Loading animations (@keyframes)
            │           ├─ Responsive breakpoints (@media)
            │           ├─ Dark mode support (.dark class)
            │           ├─ Custom scrollbars (::-webkit-scrollbar)
            │           └─ Transitions & animations
            │
            └─→ CSS STYLING
                └─→ components/ChatSidebar.css (400 lines)
                    ├─ Sidebar container
                    ├─ Overlay (mobile)
                    ├─ Header styling
                    ├─ New Chat button
                    ├─ Search input styling
                    ├─ Conversation list styling
                    ├─ Delete confirm dialog
                    ├─ Footer styling
                    ├─ Responsive breakpoints (@media)
                    ├─ Dark mode support (.dark class)
                    └─ Animations (open/close, delete confirm)

services/aiChatService.js (400 lines)
│
├─→ IMPORTS:
│   ├─ Supabase client
│   ├─ apiService (backend calls)
│   └─ Error handling
│
├─→ EXPORTED FUNCTIONS:
│   │
│   ├─ Conversations API
│   │   ├─ getConversations()
│   │   ├─ createConversation(title, context)
│   │   ├─ getConversation(id)
│   │   ├─ updateConversation(id, updates)
│   │   ├─ deleteConversation(id)
│   │   └─ toggleArchive(id)
│   │
│   ├─ Messages API
│   │   ├─ getMessages(conversationId)
│   │   ├─ addMessage(conversationId, message, role)
│   │   ├─ updateMessage(messageId, updates)
│   │   └─ deleteMessage(messageId)
│   │
│   ├─ AI API
│   │   ├─ sendMessage(conversationId, message, history)
│   │   │   ├─ Save user message
│   │   │   ├─ Call /api/ai/chat (backend)
│   │   │   ├─ Save AI response
│   │   │   └─ Return response
│   │   │
│   │   └─ regenerateResponse(conversationId, history)
│   │       ├─ Delete last assistant message
│   │       ├─ Call /api/ai/chat with same history
│   │       ├─ Save new response
│   │       └─ Return new response
│   │
│   ├─ Reactions API
│   │   ├─ addReaction(messageId, reaction)
│   │   ├─ removeReaction(messageId, reaction)
│   │   └─ getReactions(messageId)
│   │
│   ├─ Tags API
│   │   ├─ addTag(conversationId, tag)
│   │   ├─ removeTag(conversationId, tag)
│   │   └─ getTags(conversationId)
│   │
│   ├─ Search & Export
│   │   ├─ searchConversations(query)
│   │   ├─ searchMessages(conversationId, query)
│   │   └─ exportConversation(conversationId, format)
│   │
│   └─ Utilities
│       ├─ clearOldConversations(days)
│       └─ getAllReactions(conversationId)
│
└─→ DATABASE CONNECTIONS
    ├─ SELECT queries to Supabase
    ├─ INSERT for new messages
    ├─ UPDATE for reactions
    ├─ DELETE for conversation cleanup
    ├─ Error handling (try-catch)
    └─ RLS enforced by Supabase

backend/supabase/AI_CHAT_SCHEMA.sql
│
├─→ TABLES:
│   ├─ chat_conversations
│   │   ├─ id (UUID PK)
│   │   ├─ user_id (UUID FK → auth.users)
│   │   ├─ title (TEXT, auto-filled)
│   │   ├─ context (TEXT, optional)
│   │   ├─ created_at (TIMESTAMP)
│   │   └─ updated_at (TIMESTAMP)
│   │
│   ├─ chat_messages
│   │   ├─ id (UUID PK)
│   │   ├─ conversation_id (UUID FK)
│   │   ├─ user_id (UUID FK → auth.users)
│   │   ├─ role (ENUM: 'user', 'assistant')
│   │   ├─ content (TEXT)
│   │   ├─ metadata (JSONB)
│   │   ├─ created_at (TIMESTAMP)
│   │   └─ updated_at (TIMESTAMP)
│   │
│   ├─ message_reactions
│   │   ├─ id (UUID PK)
│   │   ├─ message_id (UUID FK)
│   │   ├─ user_id (UUID FK → auth.users)
│   │   ├─ reaction (ENUM: 'thumbs_up', 'thumbs_down', 'flag')
│   │   └─ created_at (TIMESTAMP)
│   │
│   └─ conversation_tags
│       ├─ id (UUID PK)
│       ├─ conversation_id (UUID FK)
│       ├─ tag (TEXT)
│       └─ created_at (TIMESTAMP)
│
├─→ RLS POLICIES:
│   ├─ chat_conversations (4 policies)
│   │   ├─ SELECT: WHERE auth.uid() = user_id
│   │   ├─ INSERT: Allow users to create
│   │   ├─ UPDATE: WHERE auth.uid() = user_id
│   │   └─ DELETE: WHERE auth.uid() = user_id
│   │
│   ├─ chat_messages (4 policies)
│   │   └─ Via conversation.user_id = auth.uid()
│   │
│   ├─ message_reactions (2 policies)
│   │   └─ WHERE auth.uid() = user_id
│   │
│   └─ conversation_tags (2 policies)
│       └─ Via conversation.user_id = auth.uid()
│
├─→ INDEXES:
│   ├─ chat_conversations_user_id
│   ├─ chat_messages_conversation_id
│   ├─ chat_messages_created_at
│   └─ Full-text search on content
│
└─→ TRIGGERS:
    ├─ Auto-title conversation from first user message
    └─ Update updated_at on any message insert
```

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns (UI → Service → DB)
- ✅ Reusable service layer (aiChatService)
- ✅ Beautiful, responsive UI components
- ✅ Secure database with RLS policies
- ✅ Proper error handling throughout
- ✅ Performance optimization (indexes, pagination)
- ✅ Dark mode support
- ✅ Mobile-first responsive design
- ✅ Framer Motion animations
- ✅ Complete keyboard support

**Total Lines of Code**: ~2,200
**Components**: 3 major components
**Service Methods**: 20+
**Database Tables**: 4 tables
**RLS Policies**: 12 policies
**CSS Styling**: 1,000+ lines
