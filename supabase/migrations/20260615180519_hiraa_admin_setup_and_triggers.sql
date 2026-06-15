
-- Auto-set admin role for the designated admin email on any signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role text;
  v_status text;
  v_approved boolean;
BEGIN
  -- Determine role: admin email always gets admin
  IF NEW.email = 'riyaskechery777@gmail.com' THEN
    v_role := 'admin';
    v_status := 'active';
    v_approved := true;
  ELSE
    v_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::text,
      'student'
    );
    v_status := CASE WHEN v_role = 'teacher' THEN 'pending' ELSE 'active' END;
    v_approved := (v_role = 'student');
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, status, approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    v_role,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    ),
    v_status,
    v_approved
  )
  ON CONFLICT (id) DO UPDATE SET
    role = CASE WHEN NEW.email = 'riyaskechery777@gmail.com' THEN 'admin' ELSE profiles.role END,
    status = CASE WHEN NEW.email = 'riyaskechery777@gmail.com' THEN 'active' ELSE profiles.status END,
    approved = CASE WHEN NEW.email = 'riyaskechery777@gmail.com' THEN true ELSE profiles.approved END,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Drop old trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- If the admin auth user already exists, ensure their profile is correct
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'riyaskechery777@gmail.com' LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, full_name, role, phone, status, approved)
    VALUES (
      v_user_id,
      'riyaskechery777@gmail.com',
      'Admin',
      'admin',
      '+99 9961814096',
      'active',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      phone = '+99 9961814096',
      status = 'active',
      approved = true,
      updated_at = now();
  END IF;
END;
$$;

-- Admin bypass: allow admin to read/write ALL tables
-- Profiles - admin full access (additional policy for admin delete)
CREATE POLICY "Admin can delete any profile"
  ON profiles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Courses - admin delete
CREATE POLICY "Admin can delete courses"
  ON courses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Classrooms - admin delete
CREATE POLICY "Admin can delete classrooms"
  ON classrooms FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Classroom enrollments - admin delete
CREATE POLICY "Admin can delete enrollments"
  ON classroom_enrollments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Announcements - admin delete
CREATE POLICY "Admin can delete announcements"
  ON announcements FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Live classes - admin delete
CREATE POLICY "Admin can delete live classes"
  ON live_classes FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Assignments - admin delete
CREATE POLICY "Admin can delete assignments"
  ON assignments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Quizzes - admin delete
CREATE POLICY "Admin can delete quizzes"
  ON quizzes FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Notes - admin full access
CREATE POLICY "Admin can manage notes"
  ON notes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Certificates - admin delete
CREATE POLICY "Admin can delete certificates"
  ON certificates FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Notifications - admin full access
CREATE POLICY "Admin can manage all notifications"
  ON notifications FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
