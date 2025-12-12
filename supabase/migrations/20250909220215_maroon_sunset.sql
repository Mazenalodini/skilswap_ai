/*
  # Create skills table

  1. New Tables
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text, English name)
      - `name_ar` (text, Arabic name)
      - `category_id` (uuid, foreign key to categories)
      - `description` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `skills` table
    - Add policy for public read access

  3. Sample Data
    - Insert initial skills data for different categories
*/

-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    name_ar text NOT NULL,
    category_id uuid,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON public.skills FOR SELECT USING (true);

-- Insert sample skills data
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