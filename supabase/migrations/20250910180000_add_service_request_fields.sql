/*
  # Add Service Request Fields

  1. Changes
    - Add `service_id` column to `service_requests` table (references `services`)
    - Add `provider_id` column to `service_requests` table (references `users`)
    
  2. Purpose
    - To link service requests to specific services and providers for negotiation
*/

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'service_id') THEN
        ALTER TABLE public.service_requests ADD COLUMN service_id uuid REFERENCES public.services(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_requests' AND column_name = 'provider_id') THEN
        ALTER TABLE public.service_requests ADD COLUMN provider_id uuid REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
END $$;
