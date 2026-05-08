CREATE TABLE public.user_tool_order (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  ferramenta_id uuid NOT NULL REFERENCES public.ferramentas(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, ferramenta_id)
);

ALTER TABLE public.user_tool_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tool order"
ON public.user_tool_order FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tool order"
ON public.user_tool_order FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tool order"
ON public.user_tool_order FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tool order"
ON public.user_tool_order FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_user_tool_order_updated_at
BEFORE UPDATE ON public.user_tool_order
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_user_tool_order_user ON public.user_tool_order(user_id, ordem);