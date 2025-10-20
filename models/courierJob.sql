-- Supabase SQL for courier_jobs table
CREATE TABLE IF NOT EXISTS public.courier_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  courier_id uuid REFERENCES public.couriers(id),
  delivery_request_id uuid REFERENCES public.delivery_requests(id),
  status text NOT NULL,
  accepted_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  location jsonb,
  earnings numeric,
  notes text
);

-- Enable real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.courier_jobs;
