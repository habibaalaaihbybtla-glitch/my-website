import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Course = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export type Unit = {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  unit_id: string;
  title: string;
  video_url: string;
  order_index: number;
  created_at: string;
};

export type Quiz = {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  quiz_score: number;
  created_at: string;
};
