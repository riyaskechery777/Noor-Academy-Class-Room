
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 'avatars', true, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-materials', 'course-materials', false, 52428800,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assignments', 'assignments', false, 26214400,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png', 'image/webp', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates', 'certificates', true, 10485760,
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Teachers and admins can manage course materials"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'course-materials'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

CREATE POLICY "Students can view course materials"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-materials'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authenticated users can manage assignment submissions"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'assignments'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Anyone can view certificates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

CREATE POLICY "Admins and teachers can manage certificates"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'certificates'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attempt_number integer NOT NULL DEFAULT 1,
  score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  UNIQUE(quiz_id, student_id, attempt_number)
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own quiz attempts"
  ON quiz_attempts FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view quiz attempts for their quizzes"
  ON quiz_attempts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_attempts.quiz_id
      AND (q.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  );

CREATE POLICY "Students can insert own quiz attempts"
  ON quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own quiz attempts"
  ON quiz_attempts FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE TABLE IF NOT EXISTS quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id uuid NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  selected_answer text NOT NULL,
  is_correct boolean DEFAULT false,
  marks_earned integer DEFAULT 0,
  answered_at timestamptz DEFAULT now(),
  UNIQUE(quiz_attempt_id, question_id)
);

ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own quiz submissions"
  ON quiz_submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view quiz submissions for their quizzes"
  ON quiz_submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = quiz_submissions.quiz_attempt_id
      AND (q.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  );

CREATE POLICY "Students can insert own quiz submissions"
  ON quiz_submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_attempt ON quiz_submissions(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_question ON quiz_submissions(question_id);

CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_num integer DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  video_url text DEFAULT '',
  content text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active course modules"
  ON course_modules FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_modules.course_id
      AND (c.status = 'active' OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    )
  );

CREATE POLICY "Admins can manage course modules"
  ON course_modules FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  progress_percent integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_accessed_at timestamptz DEFAULT now(),
  UNIQUE(student_id, module_id)
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON student_progress FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view progress of enrolled students"
  ON student_progress FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'teacher'))
  );

CREATE POLICY "Students can insert own progress"
  ON student_progress FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own progress"
  ON student_progress FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_course ON student_progress(course_id);
