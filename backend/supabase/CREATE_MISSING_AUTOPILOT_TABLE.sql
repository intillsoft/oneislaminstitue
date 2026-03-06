-- FIX: Missing Autopilot Settings table
CREATE TABLE IF NOT EXISTS public.auto_apply_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT false,
    frequency TEXT DEFAULT 'daily', -- daily, weekly, custom, continuous
    check_interval_minutes INTEGER DEFAULT 1440,
    last_check_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.auto_apply_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own auto_apply_settings" 
    ON public.auto_apply_settings FOR ALL 
    USING (auth.uid() = user_id);

-- Grafts index
CREATE INDEX IF NOT EXISTS idx_auto_apply_settings_user_id ON public.auto_apply_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_apply_settings_enabled ON public.auto_apply_settings(enabled);
