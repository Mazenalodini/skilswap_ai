import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Clock, CheckCircle, X, 
  Brain, Award, BookOpen, AlertCircle, Star 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface AssessmentResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  passed: boolean;
  recommendations: string[];
}

export default function SkillAssessment() {
  const { skill } = useParams();
  const navigate = useNavigate();
  const { user, updateUserProfile, addSkillToUser, addBadgeToUser, updateUserPoints } = useAuth();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock questions - in a real app, these would come from an API
  const questions: Question[] = [
    {
      id: '1',
      question: 'ما هو React؟',
      options: [
        'مكتبة JavaScript لبناء واجهات المستخدم',
        'لغة برمجة جديدة',
        'قاعدة بيانات',
        'خادم ويب'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      points: 10
    },
    {
      id: '2',
      question: 'ما هو الغرض من useState في React؟',
      options: [
        'لإدارة حالة المكون',
        'لإنشاء مكونات جديدة',
        'لربط قاعدة البيانات',
        'لتصميم الواجهة'
      ],
      correctAnswer: 0,
      difficulty: 'medium',
      points: 15
    },
    {
      id: '3',
      question: 'كيف يمكن تمرير البيانات من مكون أب إلى مكون فرعي في React؟',
      options: [
        'باستخدام localStorage',
        'باستخدام Props',
        'باستخدام cookies',
        'باستخدام sessionStorage'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      points: 15
    },
    {
      id: '4',
      question: 'ما هو Virtual DOM في React؟',
      options: [
        'نسخة افتراضية من DOM الحقيقي في الذاكرة',
        'أداة لتصحيح الأخطاء',
        'مكتبة للرسوم المتحركة',
        'نوع من قواعد البيانات'
      ],
      correctAnswer: 0,
      difficulty: 'hard',
      points: 20
    },
    {
      id: '5',
      question: 'متى يتم استدعاء useEffect في React؟',
      options: [
        'فقط عند تحميل المكون',
        'فقط عند تحديث المكون',
        'عند تحميل وتحديث المكون',
        'فقط عند إلغاء تحميل المكون'
      ],
      correctAnswer: 2,
      difficulty: 'hard',
      points: 20
    }
  ];

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmitAssessment();
    }
  }, [timeLeft, isStarted, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartAssessment = () => {
    setIsStarted(true);
    setAnswers(new Array(questions.length).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = (): AssessmentResult => {
    let score = 0;
    let correctAnswers = 0;

    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        score += questions[index].points;
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / questions.length) * 100;
    let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    let passed = false;

    if (percentage >= 90) {
      level = 'expert';
      passed = true;
    } else if (percentage >= 75) {
      level = 'advanced';
      passed = true;
    } else if (percentage >= 60) {
      level = 'intermediate';
      passed = true;
    } else {
      level = 'beginner';
      passed = false;
    }

    const recommendations = passed 
      ? [
          'تهانينا! لقد اجتزت الاختبار بنجاح',
          'تم إضافة المهارة إلى ملفك الشخصي',
          'يمكنك الآن تقديم خدمات في هذا المجال'
        ]
      : [
          'لم تجتز الاختبار هذه المرة',
          'ننصحك بمراجعة المواد التعليمية',
          'يمكنك إعادة الاختبار بعد التعلم أكثر'
        ];

    return {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      level,
      passed,
      recommendations
    };
  };

  const handleSubmitAssessment = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const assessmentResult = calculateResult();
    setResult(assessmentResult);
    setIsCompleted(true);

    // Update user skills if passed
    if (assessmentResult.passed && user) {
      const newSkill = {
        id: Date.now().toString(),
        name: skill || 'General',
        category: 'Technology',
        level: assessmentResult.level,
        verified: true,
        rating: 0,
        completedProjects: 0,
        assessmentDate: new Date().toISOString()
      };

      await addSkillToUser(newSkill);
      
      // إضافة نقاط مكافأة للنجاح في الاختبار
      const bonusPoints = assessmentResult.level === 'expert' ? 100 :
                         assessmentResult.level === 'advanced' ? 75 :
                         assessmentResult.level === 'intermediate' ? 50 : 25;
      
      await updateUserPoints(bonusPoints);
      
      // إضافة شارة للنجاح
      await addBadgeToUser({
        id: Date.now().toString(),
        name: `خبير ${skill}`,
        description: `نجح في اختبار مهارة ${skill}`,
        icon: '🏆',
        earnedAt: new Date().toISOString(),
        rarity: assessmentResult.level === 'expert' ? 'legendary' : 
               assessmentResult.level === 'advanced' ? 'epic' : 'rare'
      });
    }

    setLoading(false);
  };

  const handleRetakeAssessment = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setTimeLeft(1800);
    setIsStarted(false);
    setIsCompleted(false);
    setResult(null);
  };

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            اختبار تقييم المهارة: {skill}
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            هذا الاختبار سيقيم مستوى مهارتك في {skill}. النجاح في الاختبار سيضيف المهارة إلى ملفك الشخصي
            ويمكنك من تقديم خدمات في هذا المجال.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">المدة</h3>
              <p className="text-blue-700 text-sm">30 دقيقة</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">الأسئلة</h3>
              <p className="text-green-700 text-sm">{questions.length} سؤال</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-900">النجاح</h3>
              <p className="text-orange-700 text-sm">60% فأكثر</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">تعليمات مهمة</h4>
            </div>
            <ul className="text-yellow-700 text-sm space-y-1 text-right">
              <li>• اقرأ كل سؤال بعناية قبل الإجابة</li>
              <li>• يمكنك العودة لتعديل إجاباتك قبل التسليم</li>
              <li>• لا يمكن إيقاف المؤقت بعد البدء</li>
              <li>• في حالة عدم النجاح، يمكنك إعادة الاختبار بعد 24 ساعة</li>
            </ul>
          </div>

          <button
            onClick={handleStartAssessment}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
          >
            <span>ابدأ الاختبار</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted && result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            result.passed 
              ? 'bg-gradient-to-r from-green-100 to-teal-100' 
              : 'bg-gradient-to-r from-red-100 to-orange-100'
          }`}>
            {result.passed ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <X className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {result.passed ? 'تهانينا! لقد نجحت' : 'لم تنجح هذه المرة'}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">{result.score}</div>
              <div className="text-sm text-gray-600">النقاط</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">إجابات صحيحة</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-gray-600">النسبة المئوية</div>
            </div>
          </div>

          {result.passed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">
                  مستواك: {
                    result.level === 'expert' ? 'خبير' :
                    result.level === 'advanced' ? 'متقدم' :
                    result.level === 'intermediate' ? 'متوسط' : 'مبتدئ'
                  }
                </h3>
              </div>
              <p className="text-green-700">تم إضافة مهارة {skill} إلى ملفك الشخصي</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">التوصيات</h3>
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="text-blue-700 text-sm">
                  • {recommendation}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {result.passed ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                الذهاب للوحة التحكم
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/learning')}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>ابدأ التعلم</span>
                </button>
                <button
                  onClick={handleRetakeAssessment}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  إعادة الاختبار
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">اختبار {skill}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            السؤال {currentQuestion + 1} من {questions.length}
          </span>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQ.difficulty === 'easy' ? 'سهل' :
               currentQ.difficulty === 'medium' ? 'متوسط' : 'صعب'}
            </span>
            <span className="text-sm text-gray-600">{currentQ.points} نقطة</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                answers[currentQuestion] === index
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  answers[currentQuestion] === index
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>السابق</span>
        </button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[index] !== -1
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmitAssessment}
            disabled={loading || answers.includes(-1)}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>إنهاء الاختبار</span>
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion] === -1}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>التالي</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}