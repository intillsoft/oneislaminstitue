-- ============================================================================
-- UNIFIED MESSAGING SYSTEM: CORE SCHEMA
-- ============================================================================
-- This script creates the tables required for the LinkedIn-style messaging system.
-- Includes support for conversations, individual messages, and real-time updates.

-- 1. CONVERSATIONS TABLE
-- Tracks unique chat threads between participants
CREATE TABLE IF NOT EXISTS messaging_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_ids UUID[] NOT NULL, -- Array of user IDs involved
    last_message_text TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}' -- For group chat names, specific job context, etc.
);

-- Index for faster participant lookups
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON messaging_conversations USING GIN (participant_ids);

-- 2. MESSAGES TABLE
-- Stores individual message entries within a conversation
CREATE TABLE IF NOT EXISTS messaging_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES messaging_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}' -- For message type (text, image, AI suggestion), etc.
);

-- Index for conversation message history
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messaging_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messaging_messages(created_at);

-- 3. RLS POLICIES
ALTER TABLE messaging_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging_messages ENABLE ROW LEVEL SECURITY;

-- Conversations: Users can see conversations they are part of
CREATE POLICY "Users can view own conversations" ON messaging_conversations
    FOR SELECT USING (auth.uid() = ANY(participant_ids));

-- Messages: Users can see messages in conversations they are part of
CREATE POLICY "Users can view messages in own conversations" ON messaging_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messaging_conversations 
            WHERE id = messaging_messages.conversation_id 
            AND auth.uid() = ANY(participant_ids)
        )
    );

-- Messages: Users can insert messages if they are part of the conversation
CREATE POLICY "Users can send messages to own conversations" ON messaging_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM messaging_conversations 
            WHERE id = messaging_messages.conversation_id 
            AND auth.uid() = ANY(participant_ids)
        )
    );

-- 4. REALTIME REPLICATION
-- Add tables to the 'supabase_realtime' publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE messaging_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messaging_messages;

-- 5. FUNCTION: Update last message on conversation
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE messaging_conversations
    SET last_message_text = NEW.content,
        last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_conversation_last_message
AFTER INSERT ON messaging_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();
