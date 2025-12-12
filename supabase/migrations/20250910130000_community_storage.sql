/*
  # Community Storage Setup

  1. Storage Buckets
    - `post-images`: For storing images attached to community posts
    - `community-images`: For storing community/group cover images

  2. Security
    - Enable public access for viewing images
    - Allow authenticated users to upload images
    - Allow users to update/delete their own images
*/

-- Create post-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for post-images
CREATE POLICY "Public can view post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Users can update their own post images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'post-images' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own post images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'post-images' AND auth.uid() = owner);


-- Create community-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('community-images', 'community-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for community-images
CREATE POLICY "Public can view community images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images');

CREATE POLICY "Authenticated users can upload community images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'community-images');

CREATE POLICY "Users can update their own community images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'community-images' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own community images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'community-images' AND auth.uid() = owner);
