/*
  # إنشاء قاعدة البيانات الأساسية لمنصة SkillSwap AI

  1. الجداول الجديدة
    - `users` - بيانات المستخدمين الأساسية
    - `user_skills` - مهارات المستخدمين المؤكدة
    - `services` - الخدمات المتاحة
    - `service_requests` - طلبات الخدمات
    - `messages` - نظام الرسائل
    - `notifications` - الإشعارات
    - `disputes` - النزاعات
    - `user_badges` - شارات المستخدمين
    - `portfolio_items` - معرض أعمال المستخدمين
    - `learning_paths` - مسارات التعلم
    - `user_learning_progress` - تقدم المستخدمين في التعلم

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة
    - حماية البيانات الشخصية

  3. الفهارس
    - فهارس لتحسين الأداء
    - فهارس للبحث السريع
*/

-- إنشاء جدول المستخدمين
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

-- إنشاء جدول مهارات المستخدمين
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

-- إنشاء جدول الخدمات
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

-- إنشاء جدول طلبات الخدمات
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

-- إنشاء جدول الرسائل
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments text[] DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الإشعارات
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

-- إنشاء جدول النزاعات
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

-- إنشاء جدول شارات المستخدمين
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  badge_name text NOT NULL,
  badge_description text NOT NULL,
  badge_icon text NOT NULL,
  rarity text DEFAULT 'common',
  earned_at timestamptz DEFAULT now()
);

-- إنشاء جدول معرض الأعمال
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

-- إنشاء جدول مسارات التعلم
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

-- إنشاء جدول تقدم المستخدمين في التعلم
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  learning_path_id uuid REFERENCES learning_paths(id) ON DELETE CASCADE,
  completion_rate decimal(5,2) DEFAULT 0.0,
  enrolled_at timestamptz DEFAULT now(),
  completed_modules text[] DEFAULT '{}',
  UNIQUE(user_id, learning_path_id)
);

-- تفعيل Row Level Security
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

-- سياسات الأمان للمستخدمين
CREATE POLICY "Users can read all profiles" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- سياسات الأمان لمهارات المستخدمين
CREATE POLICY "Users can read all skills" ON user_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL TO authenticated USING (auth.uid() = user_id);

-- سياسات الأمان للخدمات
CREATE POLICY "Anyone can read services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own services" ON services FOR ALL TO authenticated USING (auth.uid() = provider_id);

-- سياسات الأمان لطلبات الخدمات
CREATE POLICY "Users can read all requests" ON service_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own requests" ON service_requests FOR ALL TO authenticated USING (auth.uid() = client_id);

-- سياسات الأمان للرسائل
CREATE POLICY "Users can read own messages" ON messages FOR SELECT TO authenticated 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE TO authenticated 
  USING (auth.uid() = receiver_id);

-- سياسات الأمان للإشعارات
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT TO authenticated 
  WITH CHECK (true);

-- سياسات الأمان للنزاعات
CREATE POLICY "Users can read own disputes" ON disputes FOR SELECT TO authenticated 
  USING (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "Users can create disputes" ON disputes FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);

-- سياسات الأمان للشارات
CREATE POLICY "Users can read all badges" ON user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own badges" ON user_badges FOR ALL TO authenticated USING (auth.uid() = user_id);

-- سياسات الأمان لمعرض الأعمال
CREATE POLICY "Users can read all portfolios" ON portfolio_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own portfolio" ON portfolio_items FOR ALL TO authenticated USING (auth.uid() = user_id);

-- سياسات الأمان لمسارات التعلم
CREATE POLICY "Anyone can read learning paths" ON learning_paths FOR SELECT TO authenticated USING (true);

-- سياسات الأمان لتقدم التعلم
CREATE POLICY "Users can read own progress" ON user_learning_progress FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON user_learning_progress FOR ALL TO authenticated 
  USING (auth.uid() = user_id);

-- إنشاء الفهارس لتحسين الأداء
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

-- إدراج بيانات تجريبية لمسارات التعلم
INSERT INTO learning_paths (skill, title, description, difficulty, duration, rating, students, modules) VALUES
('React', 'تطوير React الشامل', 'إتقان React من الأساسيات إلى المفاهيم المتقدمة بما في ذلك الـ hooks والـ context وتحسين الأداء.', 'intermediate', '6 أسابيع', 4.8, 1250, '[
  {
    "id": "1",
    "title": "أساسيات React",
    "type": "video",
    "duration": "2 ساعة",
    "completed": false,
    "url": "https://example.com/react-fundamentals"
  },
  {
    "id": "2",
    "title": "المكونات والخصائص",
    "type": "video",
    "duration": "1.5 ساعة",
    "completed": false,
    "url": "https://example.com/components-props"
  },
  {
    "id": "3",
    "title": "بناء تطبيق Todo",
    "type": "project",
    "duration": "3 ساعات",
    "completed": false,
    "content": "إنشاء تطبيق todo متكامل باستخدام React hooks"
  }
]'),
('Node.js', 'تطوير Backend بـ Node.js', 'تعلم تطوير خوادم الويب والـ APIs باستخدام Node.js و Express مع قواعد البيانات.', 'advanced', '8 أسابيع', 4.7, 890, '[
  {
    "id": "1",
    "title": "أساسيات Node.js",
    "type": "video",
    "duration": "2.5 ساعة",
    "completed": false
  },
  {
    "id": "2",
    "title": "Express Framework",
    "type": "video",
    "duration": "2 ساعة",
    "completed": false
  },
  {
    "id": "3",
    "title": "قواعد البيانات",
    "type": "article",
    "duration": "1 ساعة",
    "completed": false
  }
]'),
('UI/UX Design', 'تصميم واجهات المستخدم', 'تعلم أساسيات وأفضل ممارسات تصميم واجهات المستخدم وتجربة المستخدم.', 'beginner', '4 أسابيع', 4.9, 2100, '[
  {
    "id": "1",
    "title": "مبادئ التصميم",
    "type": "video",
    "duration": "1.5 ساعة",
    "completed": false
  },
  {
    "id": "2",
    "title": "أدوات التصميم",
    "type": "video",
    "duration": "2 ساعة",
    "completed": false
  },
  {
    "id": "3",
    "title": "مشروع تصميم تطبيق",
    "type": "project",
    "duration": "4 ساعات",
    "completed": false
  }
]');

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();