/*
  # SkillSwap AI Platform - Complete Database Schema
  
  This file contains all the necessary SQL commands to set up the backend database.
  Run this in the Supabase SQL Editor.
*/

-- ==========================================
-- 1. Core Tables (Users, Services, etc.)
-- ==========================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  bio text,
  phone text,
  location text,
  website text,
  points integer DEFAULT 100,
  reputation decimal(3,2) DEFAULT 0.0,
  level text DEFAULT 'beginner',
  status text DEFAULT 'offline',
  completed_services integer DEFAULT 0,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  category text NOT NULL,
  level text NOT NULL,
  verified boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 0.0,
  completed_projects integer DEFAULT 0,
  assessment_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  skill_required text NOT NULL,
  skill_level text NOT NULL,
  points integer NOT NULL,
  estimated_time text NOT NULL,
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'available',
  tags text[] DEFAULT '{}',
  portfolio text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  skill_needed text NOT NULL,
  budget integer NOT NULL,
  deadline date,
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'open',
  requirements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments text[] DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open',
  resolution text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  badge_name text NOT NULL,
  badge_description text NOT NULL,
  badge_icon text NOT NULL,
  rarity text DEFAULT 'common',
  earned_at timestamptz DEFAULT now()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  project_url text,
  rating decimal(3,2) DEFAULT 5.0,
  client_feedback text,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  duration text NOT NULL,
  rating decimal(3,2) DEFAULT 0.0,
  students integer DEFAULT 0,
  modules jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create user_learning_progress table
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  learning_path_id uuid REFERENCES learning_paths(id) ON DELETE CASCADE,
  completion_rate decimal(5,2) DEFAULT 0.0,
  enrolled_at timestamptz DEFAULT now(),
  completed_modules text[] DEFAULT '{}',
  UNIQUE(user_id, learning_path_id)
);

-- ==========================================
-- 2. Security Policies (RLS)
-- ==========================================

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can read all profiles" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User Skills Policies
CREATE POLICY "Users can read all skills" ON user_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Services Policies
CREATE POLICY "Anyone can read services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own services" ON services FOR ALL TO authenticated USING (auth.uid() = provider_id);

-- Service Requests Policies
CREATE POLICY "Users can read all requests" ON service_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own requests" ON service_requests FOR ALL TO authenticated USING (auth.uid() = client_id);

-- Messages Policies
CREATE POLICY "Users can read own messages" ON messages FOR SELECT TO authenticated 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE TO authenticated 
  USING (auth.uid() = receiver_id);

-- Notifications Policies
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Disputes Policies
CREATE POLICY "Users can read own disputes" ON disputes FOR SELECT TO authenticated 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "Users can create disputes" ON disputes FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);

-- Badges Policies
CREATE POLICY "Users can read all badges" ON user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own badges" ON user_badges FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Portfolio Policies
CREATE POLICY "Users can read all portfolios" ON portfolio_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own portfolio" ON portfolio_items FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Learning Paths Policies
CREATE POLICY "Anyone can read learning paths" ON learning_paths FOR SELECT TO authenticated USING (true);

-- Learning Progress Policies
CREATE POLICY "Users can read own progress" ON user_learning_progress FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON user_learning_progress FOR ALL TO authenticated 
  USING (auth.uid() = user_id);

-- ==========================================
-- 3. Indexes & Triggers
-- ==========================================

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_service_requests_client_id ON service_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_service_id ON disputes(service_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON user_learning_progress(user_id);

-- Update Timestamp Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 4. Additional Data (Skills Catalog)
-- ==========================================

-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    name_ar text NOT NULL,
    category_id uuid,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Public read access for skills
CREATE POLICY "Enable read access for all users" ON public.skills FOR SELECT USING (true);

-- Insert sample skills
INSERT INTO public.skills (name, name_ar, description) VALUES
('Web Development', 'تطوير الويب', 'Skills related to building web applications'),
('Mobile Development', 'تطوير التطبيقات', 'Skills for creating mobile applications'),
('Graphic Design', 'التصميم الجرافيكي', 'Skills related to visual communication and design'),
('UI/UX Design', 'تصميم واجهة المستخدم', 'Designing user interfaces and experiences'),
('Digital Marketing', 'التسويق الرقمي', 'Skills for promoting products or services online'),
('Content Writing', 'كتابة المحتوى', 'Skills for creating written content'),
('Translation', 'الترجمة', 'Language translation services'),
('Video Editing', 'تحرير الفيديو', 'Skills for editing and producing videos'),
('Photography', 'التصوير الفوتوغرافي', 'Professional photography services'),
('Data Analysis', 'تحليل البيانات', 'Skills for analyzing and interpreting data'),
('React', 'رياكت', 'JavaScript library for building user interfaces'),
('Node.js', 'نود.جي إس', 'JavaScript runtime for server-side development'),
('Python', 'بايثون', 'Programming language for various applications'),
('JavaScript', 'جافا سكريبت', 'Programming language for web development'),
('HTML/CSS', 'إتش تي إم إل/سي إس إس', 'Markup and styling languages for web'),
('WordPress', 'ووردبريس', 'Content management system'),
('Photoshop', 'فوتوشوب', 'Image editing and graphic design software'),
('Illustrator', 'إليستريتور', 'Vector graphics design software'),
('After Effects', 'أفتر إفكتس', 'Motion graphics and visual effects software'),
('SEO', 'تحسين محركات البحث', 'Search engine optimization techniques'),
('Social Media Marketing', 'التسويق عبر وسائل التواصل', 'Marketing through social media platforms'),
('Copywriting', 'كتابة إعلانية', 'Writing persuasive marketing content'),
('Technical Writing', 'الكتابة التقنية', 'Writing technical documentation'),
('English-Arabic Translation', 'ترجمة إنجليزي-عربي', 'Translation between English and Arabic'),
('French-Arabic Translation', 'ترجمة فرنسي-عربي', 'Translation between French and Arabic');
