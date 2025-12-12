/*
  # Challenges Schema

  1. New Tables
    - `challenges`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `skill` (text)
      - `difficulty` (text: beginner, intermediate, advanced)
      - `prize` (integer)
      - `deadline` (timestamp)
      - `status` (text: active, completed)
      - `participants_count` (integer, default 0)
      - `created_at` (timestamp)

    - `challenge_participants`
      - `id` (uuid, primary key)
      - `challenge_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `status` (text: joined, submitted, completed)
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS
    - Policies for viewing and joining
*/

-- 1. Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    skill text NOT NULL,
    difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
    prize integer DEFAULT 0,
    deadline timestamp with time zone NOT NULL,
    status text CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    participants_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone" ON public.challenges
    FOR SELECT USING (true);

-- 2. Challenge Participants
CREATE TABLE IF NOT EXISTS public.challenge_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    status text CHECK (status IN ('joined', 'submitted', 'completed')) DEFAULT 'joined',
    joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(challenge_id, user_id)
);

ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants are viewable by everyone" ON public.challenge_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join challenges" ON public.challenge_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" ON public.challenge_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample challenges
INSERT INTO public.challenges (title, description, skill, difficulty, prize, deadline, participants_count) VALUES
('تحدي تطوير تطبيق إدارة المهام', 'طور تطبيق ويب لإدارة المهام باستخدام React و Node.js مع ميزات متقدمة', 'Full Stack Development', 'advanced', 1000, NOW() + INTERVAL '30 days', 45),
('مسابقة تصميم شعار إبداعي', 'صمم شعاراً مبتكراً لشركة تقنية ناشئة في مجال الذكاء الاصطناعي', 'Graphic Design', 'intermediate', 500, NOW() + INTERVAL '15 days', 78),
('تحدي كتابة محتوى تسويقي', 'اكتب حملة تسويقية متكاملة لمنتج تقني جديد', 'Content Writing', 'beginner', 300, NOW() + INTERVAL '10 days', 32);
