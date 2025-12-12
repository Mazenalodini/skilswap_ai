/*
  # Add Community RPCs

  1. New Functions
    - `increment_likes`
    - `decrement_likes`
    - `increment_comments`
    - `decrement_comments`
    - `increment_shares`
    
  2. Purpose
    - To atomically update counters on community_posts table
*/

-- Increment Likes
CREATE OR REPLACE FUNCTION increment_likes(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_posts
  SET likes = likes + 1
  WHERE id = row_id;
END;
$$;

-- Decrement Likes
CREATE OR REPLACE FUNCTION decrement_likes(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_posts
  SET likes = GREATEST(0, likes - 1)
  WHERE id = row_id;
END;
$$;

-- Increment Comments
CREATE OR REPLACE FUNCTION increment_comments(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_posts
  SET comments = comments + 1
  WHERE id = row_id;
END;
$$;

-- Decrement Comments
CREATE OR REPLACE FUNCTION decrement_comments(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_posts
  SET comments = GREATEST(0, comments - 1)
  WHERE id = row_id;
END;
$$;

-- Increment Shares
CREATE OR REPLACE FUNCTION increment_shares(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_posts
  SET shares = shares + 1
  WHERE id = row_id;
END;
$$;
