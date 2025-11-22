-- Ensure RLS is enabled on all three tables
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Add SELECT policies to restrict viewing to admins only
CREATE POLICY "Only admins can view demo requests"
ON public.demo_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can view quote requests"
ON public.quote_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can view leads"
ON public.leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));