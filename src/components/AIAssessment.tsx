import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, X, Clock, Award, ChevronRight, AlertCircle } from 'lucide-react';

interface AIAssessmentProps {
  skill: string;
  onComplete: (result: AssessmentResult) => void;
  onCancel: () => void;
}

export interface AssessmentResult {
  passed: boolean;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  feedback: string;
  recommendations: string[];
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const MOCK_QUESTIONS: Record<string, Question[]> = {
  'React': [
    {
      id: 1,
      text: 'ما هو الـ Hook المستخدم لإدارة الحالة (State) في المكونات الوظيفية؟',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswer: 1
    },
    {
      id: 2,
      text: 'ما هي الطريقة الصحيحة لتمرير البيانات من الأب إلى الابن؟',
      options: ['State', 'Props', 'Context', 'Redux'],
      correctAnswer: 1
    },
    {
      id: 3,
      text: 'ماذا يفعل useEffect؟',
      options: ['يدير الحالة', 'ينفذ تأثيرات جانبية', 'يحسن الأداء', 'ينشئ سياق'],
      correctAnswer: 1
    }
  ],
  'JavaScript': [
    {
      id: 1,
      text: 'ما هو الفرق بين let و var؟',
      options: ['لا يوجد فرق', 'let للنطاق الكتلي (Block Scope)', 'var للنطاق الكتلي', 'let لا يمكن إعادة تعيينها'],
      correctAnswer: 1
    },
    {
      id: 2,
      text: 'كيف تقوم بتحويل نص JSON إلى كائن JavaScript؟',
      options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.convert()'],
      correctAnswer: 1
    }
  ],
  'UI/UX': [
    {
      id: 1,
      text: 'ما هو الهدف الأساسي من Wireframe؟',
      options: ['التصميم النهائي', 'هيكلية الصفحة', 'اختيار الألوان', 'كتابة المحتوى'],
      correctAnswer: 1
    },
    {
      id: 2,
      text: 'ماذا يعني التباين (Contrast) في التصميم؟',
      options: ['حجم الخط', 'الفرق بين العناصر', 'نوع الخط', 'تخطيط الصفحة'],
      correctAnswer: 1
    }
  ]
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'سؤال افتراضي 1: ما هو أفضل ممارسة لهذا المفهوم؟',
    options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'],
    correctAnswer: 0
  },
  {
    id: 2,
    text: 'سؤال افتراضي 2: كيف تتعامل مع هذه الحالة؟',
    options: ['خيار A', 'خيار B', 'خيار C', 'خيار D'],
    correctAnswer: 1
  },
  {
    id: 3,
    text: 'سؤال افتراضي 3: لماذا نستخدم هذه التقنية؟',
    options: ['السبب الأول', 'السبب الثاني', 'السبب الثالث', 'السبب الرابع'],
    correctAnswer: 2
  }
];

export default function AIAssessment({ skill, onComplete, onCancel }: AIAssessmentProps) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState(0);

  // Get questions for the skill or fallback to default
  const questions = MOCK_QUESTIONS[skill] || DEFAULT_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'quiz') {
      handleNextQuestion(-1); // Time out, wrong answer
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    if (step === 'analyzing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('result');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStart = () => {
    setStep('quiz');
    setTimeLeft(30);
  };

  const handleNextQuestion = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      setStep('analyzing');
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    let correctCount = 0;
    finalAnswers.forEach((ans, index) => {
      if (ans === questions[index].correctAnswer) correctCount++;
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 60;

    let level: AssessmentResult['level'] = 'beginner';
    if (score >= 90) level = 'expert';
    else if (score >= 80) level = 'advanced';
    else if (score >= 60) level = 'intermediate';

    const result: AssessmentResult = {
      passed,
      score,
      level,
      feedback: passed
        ? `أداء ممتاز! لقد أظهرت فهماً قوياً لأساسيات ومفاهيم ${skill}.`
        : `تحتاج إلى مزيد من التدريب في ${skill}. ركز على المفاهيم الأساسية وحاول مرة أخرى.`,
      recommendations: passed
        ? ['المشاركة في مشاريع مفتوحة المصدر', 'تدريس المهارة لآخرين', 'استكشاف مواضيع متقدمة']
        : ['مراجعة الوثائق الرسمية', 'بناء مشاريع صغيرة', 'حل تحديات برمجية يومية']
    };

    // Delay calling onComplete until animation finishes (handled in useEffect via step change, 
    // but here we just prepare data. Ideally we pass it when 'result' step is done or user clicks 'Finish')
    // For this UI, we show the result first.
    // We'll store the result in a ref or state to display it, then call onComplete when user closes.
    setAssessmentResult(result);
  };

  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleFinish = () => {
    if (assessmentResult) {
      onComplete(assessmentResult);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">تقييم مهارة {skill}</h3>
              <p className="text-blue-100 text-sm">المدعوم بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {step === 'intro' && (
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">هل أنت مستعد لاختبار مهاراتك؟</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                سيقوم الذكاء الاصطناعي بطرح {questions.length} أسئلة دقيقة لقياس مستواك في {skill}.
                لديك 30 ثانية لكل سؤال.
              </p>
              <button
                onClick={handleStart}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2 mx-auto"
              >
                <span>ابدأ التقييم الآن</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-gray-500">
                  السؤال {currentQuestionIndex + 1} من {questions.length}
                </span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${timeLeft < 10 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft} ثانية</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {currentQuestion.text}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleNextQuestion(index)}
                      className="w-full text-right p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 hover:text-blue-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-blue-600 progress-ring__circle stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${progress * 2.51} 251.2`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">جاري تحليل إجاباتك...</h3>
              <p className="text-gray-500">يقوم الذكاء الاصطناعي بتقييم أدائك ومقارنته بالمعايير العالمية</p>
            </div>
          )}

          {step === 'result' && assessmentResult && (
            <div className="text-center animate-fadeIn">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${assessmentResult.passed ? 'bg-green-100' : 'bg-orange-100'}`}>
                {assessmentResult.passed ? (
                  <Award className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-orange-600" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {assessmentResult.passed ? 'تهانينا! لقد اجتزت التقييم' : 'لم تجتز التقييم هذه المرة'}
              </h2>

              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-gray-500">المستوى:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${assessmentResult.passed ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {assessmentResult.level === 'beginner' ? 'مبتدئ' :
                    assessmentResult.level === 'intermediate' ? 'متوسط' :
                      assessmentResult.level === 'advanced' ? 'متقدم' : 'خبير'}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">النتيجة:</span>
                <span className="font-bold text-gray-900">{assessmentResult.score}%</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-right">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  تحليل الذكاء الاصطناعي
                </h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {assessmentResult.feedback}
                </p>

                <h5 className="font-semibold text-gray-900 mb-2 text-sm">توصيات للتحسين:</h5>
                <ul className="space-y-2">
                  {assessmentResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                {assessmentResult.passed ? 'إضافة المهارة للملف الشخصي' : 'حاول مرة أخرى لاحقاً'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}