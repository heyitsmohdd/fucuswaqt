-- =====================================================
-- Focus Heatmap Database Schema
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- This creates the table, indexes, RLS policies, and helper function

-- 1. Create the daily_focus table
CREATE TABLE IF NOT EXISTS daily_focus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  focus_minutes INTEGER DEFAULT 0,
  sessions_completed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per user per day
  CONSTRAINT unique_user_date UNIQUE(user_id, date)
);

-- 2. Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_daily_focus_user_id ON daily_focus(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_focus_date ON daily_focus(date);
CREATE INDEX IF NOT EXISTS idx_daily_focus_user_date ON daily_focus(user_id, date DESC);

-- 3. Add table comment
COMMENT ON TABLE daily_focus IS 'Stores daily focus statistics for heatmap visualization';

-- 4. Enable Row Level Security (RLS)
ALTER TABLE daily_focus ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "Users can view own focus data" ON daily_focus;
DROP POLICY IF EXISTS "Users can insert own focus data" ON daily_focus;
DROP POLICY IF EXISTS "Users can update own focus data" ON daily_focus;

-- 6. Create RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own focus data"
  ON daily_focus
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own focus data"
  ON daily_focus
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own focus data"
  ON daily_focus
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Create helper function for efficient updates
CREATE OR REPLACE FUNCTION increment_daily_focus(
  p_user_id UUID,
  p_date DATE,
  p_minutes INTEGER,
  p_sessions INTEGER DEFAULT 1,
  p_tasks INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges to bypass RLS for function
AS $$
BEGIN
  INSERT INTO daily_focus (user_id, date, focus_minutes, sessions_completed, tasks_completed)
  VALUES (p_user_id, p_date, p_minutes, p_sessions, p_tasks)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    focus_minutes = daily_focus.focus_minutes + p_minutes,
    sessions_completed = daily_focus.sessions_completed + p_sessions,
    tasks_completed = daily_focus.tasks_completed + p_tasks,
    updated_at = NOW();
END;
$$;

-- 8. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_daily_focus TO authenticated;

-- =====================================================
-- Profiles Table Schema (for Streak Tracking)
-- =====================================================

-- 9. Create the profiles table for streak tracking
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Add table comment
COMMENT ON TABLE profiles IS 'Stores user profile data including streak information';

-- 11. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 12. Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 13. Create RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 14. Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_study_date ON profiles(last_study_date);

-- =====================================================
-- Verification Queries (Optional - for testing)
-- =====================================================

-- Check if table was created
-- SELECT * FROM daily_focus LIMIT 1;

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'daily_focus';

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'daily_focus';

-- =====================================================
-- Success!
-- =====================================================
-- You can now use this table with your FocusWaqt app
