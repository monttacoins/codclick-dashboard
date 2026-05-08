CREATE TABLE public.empresa_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL DEFAULT '',
  logo text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.empresa_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view empresa_config"
  ON public.empresa_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert empresa_config"
  ON public.empresa_config FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update empresa_config"
  ON public.empresa_config FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete empresa_config"
  ON public.empresa_config FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_empresa_config_updated_at
  BEFORE UPDATE ON public.empresa_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.empresa_config (nome, logo)
SELECT
  COALESCE((SELECT value FROM public.app_config WHERE key = 'company_name'), 'CodClick Marketing'),
  COALESCE((SELECT value FROM public.app_config WHERE key = 'company_logo'), '');