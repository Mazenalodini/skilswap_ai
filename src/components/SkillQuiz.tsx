import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Loader2, Award, BookOpen, ArrowRight, Clock, AlertTriangle, Check } from 'lucide-react';
import { aiService } from '../lib/ai';
import toast from 'react-hot-toast';

interface SkillQuizProps {
  skill: string;
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

export default function SkillQuiz({ skill, onComplete, onClose }: SkillQuizProps) {
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [questions, setQuestions] = useState<{ id: string; question: string; options: string[] }[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; feedback: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60 * 5); // 5 minutes total for the whole quiz
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await aiService.generateSkillQuiz(skill);
        setQuestions(quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('فشل في توليد الاختبار. حاول مرة أخرى.');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [skill, onClose]);

  // Timer Logic
  useEffect(() => {
    if (loading || result || evaluating || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, result, evaluating, questions]);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length && timeLeft > 0) {
      toast.error('يرجى الإجابة على جميع الأسئلة قبل التسليم');

      // Scroll to first unanswered question
      const firstUnanswered = questions.find(q => !answers[q.id]);
      if (firstUnanswered) {
        const element = document.getElementById(`question-${firstUnanswered.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setEvaluating(true);
    try {
      const evaluation = await aiService.evaluateQuiz(skill, answers);
      setResult(evaluation);
      if (evaluation.passed) {
        toast.success('مبروك! لقد اجتزت الاختبار بنجاح.');
        onComplete(true);
      } else {
        toast.error('للأسف، لم تجتز الاختبار هذه المرة.');
        onComplete(false);
      }
    } catch (error) {
      console.error('Error evaluating quiz:', error);
      toast.error('حدث خطأ أثناء التصحيح.');
    } finally {
      setEvaluating(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center relative z-20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">اختبار مهارة: {skill}</h3>
              <p className="text-sm text-gray-400">
                أجب على جميع الأسئلة لإثبات مهارتك
              </p>
            </div>
          </div>

          {!loading && !result && (
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-gray-700/50 border-gray-600 text-gray-300'}`}>
              <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'animate-pulse' : ''}`} />
              <div className="flex flex-col items-end">
                <span className="text-xs opacity-70">الوقت المتبقي</span>
                <span className="font-mono text-xl font-bold leading-none">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Evaluation/Result View */}
        {evaluating || result ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col items-center justify-center">
            {/* Result UI */}
            {evaluating ? (
              <div className="text-center space-y-8">
                <div className="relative w-32 h-32 mx-auto">
                  <Loader2 className="w-full h-full text-purple-500 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-white animate-pulse">جاري تحليل الإجابات...</h3>
              </div>
            ) : result && (
              <div className="text-center w-full max-w-2xl space-y-8 animate-slideUp">
                {result.passed ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/50">
                    <Award className="w-12 h-12 text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-red-500/50">
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  </motion.div>
                )}

                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{result.passed ? 'أحسنت! تم اجتياز الاختبار' : 'لم يتم الاجتياز'}</h2>
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{result.score}%</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-right">
                  <p className="text-gray-300 leading-relaxed">{result.feedback}</p>
                </div>

                {!result.passed && (
                  <button
                    onClick={() => window.location.href = `/learning?search=${encodeURIComponent(skill)}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    <BookOpen className="w-5 h-5" />
                    تعلم {skill} الآن
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Questions List */
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 scroll-smooth" ref={scrollContainerRef}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-gray-400">جاري إعداد الأسئلة...</p>
              </div>
            ) : (
              <>
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    id={`question-${q.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-gray-800/50 border ${answers[q.id] ? 'border-purple-500/30' : 'border-gray-700'} rounded-2xl p-6 hover:bg-gray-800 transition-colors`}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400 shrink-0">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-white leading-relaxed">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-12">
                      {q.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(q.id, option)}
                          className={`p-4 rounded-xl text-right transition-all border relative overflow-hidden group ${answers[q.id] === option
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                              : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                        >
                          <div className="relative z-10 flex items-center justify-between">
                            <span>{option}</span>
                            {answers[q.id] === option && <CheckCircle className="w-5 h-5 text-white" />}
                          </div>
                          {answers[q.id] === option && (
                            <motion.div layoutId={`highlight-${q.id}`} className="absolute inset-0 bg-white/10" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        {!evaluating && !result && !loading && (
          <div className="bg-gray-800 p-6 border-t border-gray-700 relative z-20">
            <div className="flex items-center justify-between gap-6">
              <div className="hidden md:block">
                <p className="text-sm text-gray-400 mb-1">تمت الإجابة</p>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-white font-bold">{answeredCount}/{questions.length}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <span>تسليم الإجابات</span>
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
