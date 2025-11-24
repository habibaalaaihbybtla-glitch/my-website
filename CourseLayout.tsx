import { useState, useEffect } from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';
import { supabase, type Unit, type Lesson } from '../lib/supabase';
import LessonViewer from './LessonViewer';

export default function CourseLayout() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, []);

  async function loadCourseData() {
    try {
      const { data: unitsData } = await supabase
        .from('units')
        .select('*')
        .order('order_index');

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      if (unitsData) setUnits(unitsData);
      if (lessonsData) setLessons(lessonsData);
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getLessonsByUnit = (unitId: string) => {
    return lessons.filter(lesson => lesson.unit_id === unitId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">دورة اللغة العربية</h1>
          <p className="text-lg text-gray-600">تعلم قواعد اللغة العربية بطريقة مبسطة وممتعة</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {units.map((unit) => {
            const unitLessons = getLessonsByUnit(unit.id);

            return (
              <div key={unit.id} className="mb-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                    <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {unitLessons.map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className="w-full bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-100 hover:to-blue-200 rounded-lg p-5 transition-all duration-300 flex items-center gap-4 group border border-gray-200 hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 group-hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                            <PlayCircle className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1 text-right">
                            <div className="text-sm text-blue-600 font-medium mb-1">
                              الدرس {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                              {lesson.title}
                            </h3>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
