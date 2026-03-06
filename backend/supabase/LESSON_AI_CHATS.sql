-- Lesson AI Chats Tables
-- This file contains the schema for storing both text and voice AI chat history for a specific lesson

-- 1. Create the `lesson_chats` table to store session metadata
CREATE TABLE IF NOT EXISTS public.lesson_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('text', 'voice')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the `lesson_chat_messages` table to store individual messages inside a chat
CREATE TABLE IF NOT EXISTS public.lesson_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.lesson_chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lesson_chats_user ON public.lesson_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_chats_lesson ON public.lesson_chats(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_chat_messages_chat ON public.lesson_chat_messages(chat_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.lesson_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Users can only see and manage their own chats
CREATE POLICY "Users can view their own lesson chats" 
ON public.lesson_chats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson chats" 
ON public.lesson_chats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson chats" 
ON public.lesson_chats FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson chats" 
ON public.lesson_chats FOR DELETE 
USING (auth.uid() = user_id);

-- Messages inherit security from the chat they belong to, but we can do a simple check.
-- For a highly secure approach, we join with lesson_chats to check the user_id.
CREATE POLICY "Users can view messages of their own chats"
ON public.lesson_chat_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.lesson_chats
        WHERE lesson_chats.id = lesson_chat_messages.chat_id
        AND lesson_chats.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert messages into their own chats"
ON public.lesson_chat_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.lesson_chats
        WHERE lesson_chats.id = chat_id
        AND lesson_chats.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own chat messages"
ON public.lesson_chat_messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.lesson_chats
        WHERE lesson_chats.id = chat_id
        AND lesson_chats.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own chat messages"
ON public.lesson_chat_messages FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.lesson_chats
        WHERE lesson_chats.id = chat_id
        AND lesson_chats.user_id = auth.uid()
    )
);

-- Trigger to update `updated_at` on lesson_chats
CREATE OR REPLACE FUNCTION update_lesson_chats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lesson_chats_modtime
BEFORE UPDATE ON public.lesson_chats
FOR EACH ROW
EXECUTE FUNCTION update_lesson_chats_updated_at();

-- Add triggers to update the chat updated_at when a new message is added
CREATE OR REPLACE FUNCTION touch_lesson_chat()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.lesson_chats
    SET updated_at = timezone('utc'::text, now())
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER touch_lesson_chat_on_new_message
AFTER INSERT OR UPDATE ON public.lesson_chat_messages
FOR EACH ROW
EXECUTE FUNCTION touch_lesson_chat();
