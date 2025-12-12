/*
  # AI Challenges Schema

  1. Changes to `challenges`
    - Add `creator_id` (uuid, fk users)
    - Add `conditions` (text array) - Specific requirements for AI to check
    - Add `ai_prompt` (text) - Custom instructions for the AI verifier

  2. New Tables
    - `challenge_submissions`
      - `id` (uuid, primary key)
      - `challenge_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `content` (text) - URL or text submission
      - `status` (text: pending, verified, rejected)
      - `ai_feedback` (text) - Reason for rejection or praise
      - `score` (integer) - AI assigned score (0-100)
      - `created_at` (timestamp)

  3. Security
    - Enable RLS
    - Policies for viewing and submitting
*/

-- 1. Alter challenges table
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS creator_id uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS conditions text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_prompt text;

-- 2. Create challenge_submissions table
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    content text NOT NULL,
    status text CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    ai_feedback text,
    score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for challenge_submissions
CREATE POLICY "Submissions are viewable by everyone" ON public.challenge_submissions
    FOR SELECT USING (true);

CREATE POLICY "Users can create submissions" ON public.challenge_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.challenge_submissions
    FOR UPDATE USING (auth.uid() = user_id);
