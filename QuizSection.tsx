import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';
import { supabase, type Quiz } from '../lib/supabase';

interface QuizSectionProps {
  lessonId: string;
  onBack: () => void;
}

export default function QuizSection({ lessonId, onBack }: QuizSectionProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, [lessonId]);

  async function loadQuizzes() {
    try {
      const { data } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId);

      if (data && data.length > 0) {
        setQuizzes(data);
        setAnsweredQuestions(new Array(data.length).fill(false));
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestionIndex]) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quizzes[currentQuestionIndex].correct_answer;
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(quizzes.length).fill(false));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">جاري تحميل الأسئلة...</div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد أسئلة متاحة</h3>
          <p className="text-gray-600 mb-6">سيتم إضافة الأسئلة قريباً</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            العودة للدرس
          </button>
        </div>
      </div>
    );
  }

  const allQuestionsAnswered = answeredQuestions.every(answered => answered);
  const currentQuiz = quizzes[currentQuestionIndex];
  const isCurrentAnswered = answeredQuestions[currentQuestionIndex];
  const isCorrectAnswer = selectedAnswer === currentQuiz.correct_answer;

  if (allQuestionsAnswered && showResult) {
    const percentage = Math.round((score / quizzes.length) * 100);

    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 max-w-md mx-auto border-2 border-green-200">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">أحسنت!</h2>
          <div className="mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</div>
            <p className="text-xl text-gray-700">
              أجبت بشكل صحيح على {score} من {quizzes.length}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              إعادة الاختبار
            </button>
            <button
              onClick={onBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              العودة للدرس
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            السؤال {currentQuestionIndex + 1} من {quizzes.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            النتيجة: {score} / {quizzes.length}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{currentQuiz.question}</h3>

        <div className="space-y-3">
          {currentQuiz.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuiz.correct_answer;
            const showCorrectAnswer = isCurrentAnswered && isCorrect;
            const showWrongAnswer = isCurrentAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isCurrentAnswered}
                className={`w-full text-right p-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-between ${
                  showCorrectAnswer
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : showWrongAnswer
                    ? 'bg-red-100 border-2 border-red-500 text-red-800'
                    : isSelected
                    ? 'bg-blue-200 border-2 border-blue-500 text-blue-900'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800'
                } ${isCurrentAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{option}</span>
                {showCorrectAnswer && <CheckCircle className="w-6 h-6 text-green-600" />}
                {showWrongAnswer && <XCircle className="w-6 h-6 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        {!isCurrentAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`flex-1 font-bold py-4 px-6 rounded-lg transition-all duration-300 ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
            }`}
          >
            تأكيد الإجابة
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < quizzes.length - 1 ? (
              <>
                السؤال التالي
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              'عرض النتيجة'
            )}
          </button>
        )}
      </div>

      {showResult && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            isCorrectAnswer ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'
          }`}
        >
          <p className={`text-center font-bold ${isCorrectAnswer ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrectAnswer ? 'إجابة صحيحة! ممتاز' : 'إجابة خاطئة. حاول مرة أخرى'}
          </p>
        </div>
      )}
    </div>
  );
}
