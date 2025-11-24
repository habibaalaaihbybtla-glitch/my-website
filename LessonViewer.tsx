import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { type Lesson } from '../lib/supabase';
import QuizSection from './QuizSection';

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonViewer({ lesson, onBack }: LessonViewerProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          العودة للدورة
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
            </div>

            <div className="p-6">
              {!showQuiz ? (
                <>
                  <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
                    {lesson.video_url ? (
                      <video
                        src={lesson.video_url}
                        controls
                        className="w-full h-full rounded-lg"
                        onEnded={() => setVideoCompleted(true)}
                      >
                        المتصفح لا يدعم تشغيل الفيديو
                      </video>
                    ) : (
                      <div className="text-center text-white p-8">
                        <div className="mb-4">
                          <CheckCircle className="w-16 h-16 mx-auto text-blue-400" />
                        </div>
                        <p className="text-xl font-semibold mb-2">يمكنك إضافة رابط الفيديو هنا</p>
                        <p className="text-gray-400">قم برفع الفيديو على اللاب وأضف الرابط في قاعدة البيانات</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">عن هذا الدرس</h2>
                    <p className="text-gray-700 leading-relaxed">
                      في هذا الدرس سوف تتعلم كل ما يتعلق بـ <span className="font-bold text-blue-700">{lesson.title}</span> في قواعد اللغة العربية.
                      شاهد الفيديو بتمعن ثم أجب على الأسئلة لتختبر فهمك للدرس.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    ابدأ الاختبار
                  </button>
                </>
              ) : (
                <QuizSection
                  lessonId={lesson.id}
                  onBack={() => setShowQuiz(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
