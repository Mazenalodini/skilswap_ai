/*
  # Fix Challenges RLS Policy

  1. Changes
    - Add INSERT policy for `challenges` table to allow authenticated users to create challenges.
    - Add UPDATE policy for `challenges` table to allow creators to update their challenges.
*/

-- Allow authenticated users to create challenges
CREATE POLICY "Users can create challenges" ON public.challenges
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow creators to update their own challenges
CREATE POLICY "Creators can update their challenges" ON public.challenges
    FOR UPDATE USING (auth.uid() = creator_id);
