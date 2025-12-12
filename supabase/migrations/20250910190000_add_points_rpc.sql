/*
  # Add Award Points RPC

  1. New Functions
    - `award_points`
    
  2. Purpose
    - To securely increment user points when a challenge is completed.
*/

CREATE OR REPLACE FUNCTION award_points(user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET points = points + amount
  WHERE id = user_id;
END;
$$;
