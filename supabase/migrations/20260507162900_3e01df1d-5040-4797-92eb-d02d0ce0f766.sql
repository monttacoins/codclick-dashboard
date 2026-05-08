
CREATE TABLE public.ferramentas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  icone_url TEXT,
  link TEXT NOT NULL DEFAULT '',
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ferramentas"
ON public.ferramentas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert ferramentas"
ON public.ferramentas FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update ferramentas"
ON public.ferramentas FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete ferramentas"
ON public.ferramentas FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_ferramentas_updated_at
BEFORE UPDATE ON public.ferramentas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('ferramentas', 'ferramentas', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view ferramentas icons"
ON storage.objects FOR SELECT
USING (bucket_id = 'ferramentas');

CREATE POLICY "Authenticated can upload ferramentas icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ferramentas');

CREATE POLICY "Authenticated can update ferramentas icons"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'ferramentas');

CREATE POLICY "Authenticated can delete ferramentas icons"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ferramentas');
