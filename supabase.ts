// Supabase disabled – working in local mode only
console.warn("Supabase is disabled – running in demo mode");

export const supabase = {
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ error: null }),
    update: () => ({ error: null }),
  }),
};

// باقي الـ types خليها زي ما هي عادي
export type Course = { id: string; title: string; description: string; created_at: string; };
export type Unit = { id: string; course_id: string; title: string; order_index: number; created_at: string; };
export type Lesson = { id: string; unit_id: string; title: string; video_url: string; order_index: number; created_at: string; };
export type Quiz = { id: string; lesson_id: string; question: string; options: string[]; correct_answer: number; created_at: string; };
export type UserProgress = { id: string; user_id: string; lesson_id: string; completed: boolean; quiz_score: number; created_at: string; };
