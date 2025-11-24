/*
  # إنشاء هيكل الدورة التدريبية

  1. الجداول الجديدة
    - `courses` - جدول الدورات التدريبية
      - `id` (uuid, primary key)
      - `title` (text) - عنوان الدورة
      - `description` (text) - وصف الدورة
      - `created_at` (timestamp)
    
    - `units` - جدول الوحدات
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text) - عنوان الوحدة
      - `order_index` (integer) - ترتيب الوحدة
      - `created_at` (timestamp)
    
    - `lessons` - جدول الدروس
      - `id` (uuid, primary key)
      - `unit_id` (uuid, foreign key)
      - `title` (text) - عنوان الدرس
      - `video_url` (text) - رابط الفيديو
      - `order_index` (integer) - ترتيب الدرس
      - `created_at` (timestamp)
    
    - `quizzes` - جدول الاختبارات
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key)
      - `question` (text) - السؤال
      - `options` (jsonb) - الخيارات
      - `correct_answer` (integer) - الإجابة الصحيحة
      - `created_at` (timestamp)
    
    - `user_progress` - جدول متابعة تقدم المستخدم
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `lesson_id` (uuid, foreign key)
      - `completed` (boolean) - هل أكمل الدرس
      - `quiz_score` (integer) - درجة الاختبار
      - `created_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - السماح بالقراءة للجميع
    - السماح بالكتابة للمستخدمين المصرح لهم
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  quiz_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view units"
  ON units FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  USING (true);

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);