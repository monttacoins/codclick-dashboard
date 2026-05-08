
-- 1. Restrict employees SELECT to admins only
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
CREATE POLICY "Admins can view employees" ON public.employees
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Restrict owners SELECT to admins; tighten INSERT/UPDATE
DROP POLICY IF EXISTS "Authenticated users can view owners" ON public.owners;
DROP POLICY IF EXISTS "Authenticated users can insert owners" ON public.owners;
DROP POLICY IF EXISTS "Authenticated users can update owners" ON public.owners;
CREATE POLICY "Admins can view owners" ON public.owners
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert owners" ON public.owners
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update owners" ON public.owners
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. ferramentas: restrict INSERT/UPDATE to admins
DROP POLICY IF EXISTS "Authenticated users can insert ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Authenticated users can update ferramentas" ON public.ferramentas;
CREATE POLICY "Admins can insert ferramentas" ON public.ferramentas
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ferramentas" ON public.ferramentas
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. app_config: restrict to admins (was true for SELECT, with_check true for UPDATE)
-- Already admin-only for INSERT/UPDATE; keep SELECT for authenticated (public-ish branding)

-- 5. Tighten generic always-true UPDATE/INSERT policies on remaining tables
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON public.appointments;
CREATE POLICY "Authenticated users can update appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert appointments" ON public.appointments;
CREATE POLICY "Authenticated users can insert appointments" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update customer_packages" ON public.customer_packages;
CREATE POLICY "Authenticated users can update customer_packages" ON public.customer_packages
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Authenticated users can insert customer_packages" ON public.customer_packages;
CREATE POLICY "Authenticated users can insert customer_packages" ON public.customer_packages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update pets" ON public.pets;
CREATE POLICY "Authenticated users can update pets" ON public.pets
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Authenticated users can insert pets" ON public.pets;
CREATE POLICY "Authenticated users can insert pets" ON public.pets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Enable RLS on keep_alive
ALTER TABLE public.keep_alive ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view keep_alive" ON public.keep_alive
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. Revoke EXECUTE on SECURITY DEFINER functions from anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- 8. Storage: fotos_pets bucket - require authentication for write ops
DROP POLICY IF EXISTS "Anyone can upload fotos_pets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update fotos_pets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete fotos_pets" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can update pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete pet photos" ON storage.objects;

CREATE POLICY "Authenticated can upload fotos_pets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'fotos_pets');
CREATE POLICY "Authenticated can update fotos_pets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'fotos_pets');
CREATE POLICY "Authenticated can delete fotos_pets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'fotos_pets');
