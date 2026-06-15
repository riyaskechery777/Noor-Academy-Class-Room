
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  avatar_url text DEFAULT '',
  phone text DEFAULT '',
  bio text DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin and teachers can read all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  price numeric DEFAULT 0,
  is_free boolean DEFAULT true,
  level text DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category text DEFAULT 'general',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  enrolled_count integer DEFAULT 0,
  duration_hours integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active courses"
  ON courses FOR SELECT TO authenticated
  USING (status = 'active' OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin can insert courses"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin or teacher can update courses"
  ON courses FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  max_students integer DEFAULT 30,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS classroom_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(classroom_id, student_id)
);

ALTER TABLE classroom_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view classrooms"
  ON classrooms FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_enrollments ce
      WHERE ce.classroom_id = classrooms.id AND ce.student_id = auth.uid()
    )
  );

CREATE POLICY "Admin can insert classrooms"
  ON classrooms FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin can update classrooms"
  ON classrooms FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Students can view own enrollments"
  ON classroom_enrollments FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers and admins can view all enrollments"
  ON classroom_enrollments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE POLICY "Admin can manage enrollments"
  ON classroom_enrollments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin can update enrollments"
  ON classroom_enrollments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  is_global boolean DEFAULT false,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view relevant announcements"
  ON announcements FOR SELECT TO authenticated
  USING (
    is_global = true
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_enrollments ce
      WHERE ce.classroom_id = announcements.classroom_id AND ce.student_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM classrooms c
      WHERE c.id = announcements.classroom_id AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Admin and teachers can create announcements"
  ON announcements FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE POLICY "Authors can update announcements"
  ON announcements FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());
