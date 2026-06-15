
CREATE TABLE IF NOT EXISTS live_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  meet_link text DEFAULT '',
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  recording_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Relevant users can view live classes"
  ON live_classes FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_enrollments ce
      WHERE ce.classroom_id = live_classes.classroom_id AND ce.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can create live classes"
  ON live_classes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE POLICY "Teachers can update own live classes"
  ON live_classes FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  due_date timestamptz,
  max_score integer DEFAULT 100,
  attachment_url text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Relevant users can view assignments"
  ON assignments FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_enrollments ce
      WHERE ce.classroom_id = assignments.classroom_id AND ce.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create assignments"
  ON assignments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE POLICY "Teachers can update own assignments"
  ON assignments FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submission_text text DEFAULT '',
  attachment_url text DEFAULT '',
  score integer,
  feedback text DEFAULT '',
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  UNIQUE(assignment_id, student_id)
);

ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions"
  ON assignment_submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view submissions for their assignments"
  ON assignment_submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.id = assignment_submissions.assignment_id
      AND (a.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  );

CREATE POLICY "Students can submit assignments"
  ON assignment_submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can grade submissions"
  ON assignment_submissions FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.id = assignment_submissions.assignment_id
      AND (a.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assignments a
      WHERE a.id = assignment_submissions.assignment_id
      AND (a.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  );

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  live_class_id uuid REFERENCES live_classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  marked_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE,
  UNIQUE(live_class_id, student_id)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view attendance for their classes"
  ON attendance FOR SELECT TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Teachers can mark attendance"
  ON attendance FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE POLICY "Teachers can update attendance"
  ON attendance FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  time_limit_minutes integer DEFAULT 30,
  total_marks integer DEFAULT 100,
  passing_marks integer DEFAULT 50,
  start_time timestamptz,
  end_time timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Relevant users can view quizzes"
  ON quizzes FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_enrollments ce
      WHERE ce.classroom_id = quizzes.classroom_id AND ce.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create quizzes"
  ON quizzes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE POLICY "Teachers can update own quizzes"
  ON quizzes FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL DEFAULT '',
  option_b text NOT NULL DEFAULT '',
  option_c text DEFAULT '',
  option_d text DEFAULT '',
  correct_answer text NOT NULL,
  marks integer DEFAULT 1,
  order_num integer DEFAULT 0
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Relevant users can view quiz questions"
  ON quiz_questions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_questions.quiz_id
      AND (
        q.teacher_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
        OR EXISTS (
          SELECT 1 FROM classroom_enrollments ce
          WHERE ce.classroom_id = q.classroom_id AND ce.student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Teachers can insert quiz questions"
  ON quiz_questions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_questions.quiz_id
      AND (q.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  );

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  file_url text DEFAULT '',
  file_type text DEFAULT 'pdf',
  is_downloadable boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students and teachers can view notes"
  ON notes FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_enrollments ce
      WHERE ce.classroom_id = notes.classroom_id AND ce.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert notes"
  ON notes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Receivers can mark messages as read"
  ON messages FOR UPDATE TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'announcement')),
  is_read boolean DEFAULT false,
  link text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can create notifications"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE SET NULL,
  issued_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text DEFAULT '',
  issued_at timestamptz DEFAULT now(),
  certificate_url text DEFAULT '',
  score numeric DEFAULT 0
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own certificates"
  ON certificates FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all certificates"
  ON certificates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admin and teachers can issue certificates"
  ON certificates FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher')));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_classroom_enrollments_student ON classroom_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_classroom_enrollments_classroom ON classroom_enrollments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_classroom ON live_classes(classroom_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_teacher ON live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
