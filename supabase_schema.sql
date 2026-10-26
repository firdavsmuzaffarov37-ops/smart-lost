-- ====================================================================
-- FindIt AI — Supabase Database Schema
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ====================================================================

-- 1. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    image TEXT,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    location_address TEXT,
    coordinates JSONB,
    date DATE NOT NULL,
    time TEXT,
    reward TEXT,
    contact_preference TEXT DEFAULT 'in_app_chat',
    custody_location TEXT,
    secret_question TEXT,
    user_id TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reporter_avatar TEXT,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT PRIMARY KEY,
    item_id TEXT REFERENCES public.reports(id) ON DELETE CASCADE,
    item_title TEXT NOT NULL,
    item_image TEXT,
    other_user JSONB NOT NULL,
    last_message TEXT,
    last_time TEXT,
    unread INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    is_safe_notice BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Open Public Policies for Demo/Prototype Access
-- Allow anyone to read reports
CREATE POLICY "Allow public read access on reports" 
    ON public.reports FOR SELECT 
    USING (true);

-- Allow anyone to insert reports
CREATE POLICY "Allow public insert on reports" 
    ON public.reports FOR INSERT 
    WITH CHECK (true);

-- Allow updates on reports
CREATE POLICY "Allow public update on reports" 
    ON public.reports FOR UPDATE 
    USING (true);

-- Allow delete on reports
CREATE POLICY "Allow public delete on reports" 
    ON public.reports FOR DELETE 
    USING (true);

-- Conversations & Messages public policies
CREATE POLICY "Allow public all access on conversations" 
    ON public.conversations FOR ALL 
    USING (true);

CREATE POLICY "Allow public all access on messages" 
    ON public.messages FOR ALL 
    USING (true);

-- 6. Enable Realtime (optional, for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
