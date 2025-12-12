-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fix service_requests status constraint
DO $$
BEGIN
    -- Drop the constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_requests_status_check') THEN
        ALTER TABLE service_requests DROP CONSTRAINT service_requests_status_check;
    END IF;
    
    -- Add the constraint back with all required statuses
    ALTER TABLE service_requests ADD CONSTRAINT service_requests_status_check 
    CHECK (status IN ('open', 'in-review', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'));
END $$;

-- Create request_offers table
CREATE TABLE IF NOT EXISTS request_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES service_requests(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending', -- pending, accepted, rejected
  price integer NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add provider_id to service_requests if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'provider_id') THEN
        ALTER TABLE service_requests ADD COLUMN provider_id uuid REFERENCES users(id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE request_offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors
DROP POLICY IF EXISTS "Providers can view own offers" ON request_offers;
DROP POLICY IF EXISTS "Clients can view offers for their requests" ON request_offers;
DROP POLICY IF EXISTS "Providers can create offers" ON request_offers;
DROP POLICY IF EXISTS "Clients can update offers" ON request_offers;

-- Policies for request_offers
-- Providers can see their own offers
CREATE POLICY "Providers can view own offers" ON request_offers 
    FOR SELECT TO authenticated 
    USING (auth.uid() = provider_id);

-- Clients can see offers for their requests
CREATE POLICY "Clients can view offers for their requests" ON request_offers 
    FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM service_requests 
        WHERE service_requests.id = request_offers.request_id 
        AND service_requests.client_id = auth.uid()
    ));

-- Providers can create offers
CREATE POLICY "Providers can create offers" ON request_offers 
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = provider_id);

-- Clients can update offers (to accept/reject)
CREATE POLICY "Clients can update offers" ON request_offers 
    FOR UPDATE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM service_requests 
        WHERE service_requests.id = request_offers.request_id 
        AND service_requests.client_id = auth.uid()
    ));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_request_offers_updated_at ON request_offers;
CREATE TRIGGER update_request_offers_updated_at BEFORE UPDATE ON request_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
