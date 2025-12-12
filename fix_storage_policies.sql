-- RLS is enabled by default on storage.objects, so we skip the ALTER command to avoid permission errors.

-- 1. Create Buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('portfolio', 'portfolio', true),
  ('attachments', 'attachments', true) -- General purpose attachments (chat, services)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop Existing Policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access to Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

DROP POLICY IF EXISTS "Public Access to Portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own portfolio" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;

-- 3. Create Policies for 'avatars'
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- 4. Create Policies for 'portfolio'
CREATE POLICY "Public Access to Portfolio"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Users can upload own portfolio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND auth.uid() = owner);

CREATE POLICY "Users can update own portfolio"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio' AND auth.uid() = owner);

CREATE POLICY "Users can delete own portfolio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio' AND auth.uid() = owner);

-- 5. Create Policies for 'attachments' (General purpose)
-- We allow any authenticated user to read attachments for now (simplification).
-- In a stricter system, we would check if the user is part of the chat/request.
CREATE POLICY "Authenticated users can view attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can upload attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'attachments' AND auth.uid() = owner);

CREATE POLICY "Users can update their own attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'attachments' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'attachments' AND auth.uid() = owner);
