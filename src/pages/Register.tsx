import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Loader2, Search, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import SkillQuiz from '../components/SkillQuiz';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'provider' as 'client' | 'provider', // Default to provider (Skill Swapper)
    selectedSkills: [] as string[]
  });
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [activeQuizSkill, setActiveQuizSkill] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  const { register } = useAuth();
  const { skills } = useData();
  const navigate = useNavigate();

  const filteredSkills = skills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('كلمات المرور غير متطابقة');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }
      setStep(2);
      return;
    }

    if (formData.selectedSkills.length === 0) {
      toast.error('يرجى اختيار مهارة واحدة على الأقل');
      return;
    }

    setLoading(true);

    try {
      // Register user with verified skills
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        verifiedSkills // Pass the verified skills here
      );

      toast.success('تم إنشاء الحساب بنجاح!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message === 'User already registered') {
        toast.error('هذا البريد الإلكتروني مسجل بالفعل. الرجاء تسجيل الدخول.');
      } else {
        toast.error('حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed && activeQuizSkill) {
      setVerifiedSkills(prev => [...prev, activeQuizSkill]);
    }
    setActiveQuizSkill(null);
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Quiz Modal */}
      <AnimatePresence>
        {activeQuizSkill && (
          <SkillQuiz
            skill={activeQuizSkill}
            onComplete={handleQuizComplete}
            onClose={() => setActiveQuizSkill(null)}
          />
        )}
      </AnimatePresence>

      {/* Left Side - Visuals (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-purple-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90"></div>

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold mb-2">
              <Sparkles className="w-8 h-8 text-purple-300" />
              <span>SkillSwap AI</span>
            </div>
            <p className="text-purple-200">انضم لمجتمع النخبة</p>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              ابدأ رحلتك نحو <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                النجاح المهني
              </span>
            </h1>
            <p className="text-xl text-purple-100 max-w-md leading-relaxed">
              سواء كنت تبحث عن خدمات احترافية أو تريد تقديم مهاراتك للعالم، مكانك هنا.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm text-purple-200">نسبة رضا العملاء</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-purple-200">دعم فني متواصل</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-purple-300/80">
            <span>© 2024 SkillSwap AI. جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background Elements for Mobile */}
        <div className="absolute inset-0 lg:hidden bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8 lg:text-right">
            <h2 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h2>
            <p className="text-gray-400">سجل الآن واستمتع بجميع مميزات المنصة</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= 1 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-600 text-gray-400'}`}>
                1
              </div>
              <div className={`w-16 h-1 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-600 text-gray-400'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-12">
              <span>البيانات الأساسية</span>
              <span>المهارات</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                    الاسم الكامل
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="الاسم الكامل"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="name@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                      كلمة المرور
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pr-10 pl-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="••••••••"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pr-10 pl-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="••••••••"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">ما هي مهاراتك؟</h3>
                  <p className="text-gray-400 text-sm">اختر المهارات التي تجيدها وقم بتوثيقها الآن</p>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="ابحث عن مهارة..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSkills.map((skill, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${formData.selectedSkills.includes(skill)
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className="flex-grow text-right text-gray-200 text-sm font-medium"
                      >
                        {skill}
                      </button>

                      {formData.selectedSkills.includes(skill) && (
                        <div className="flex items-center gap-2">
                          {verifiedSkills.includes(skill) ? (
                            <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                              <Award className="w-3 h-3" />
                              موثقة
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveQuizSkill(skill)}
                              className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              توثيق بالذكاء الاصطناعي
                            </button>
                          )}
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  تم توثيق {verifiedSkills.length} من {formData.selectedSkills.length} مهارة مختارة
                </p>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/5 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  السابق
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>{step === 1 ? 'التالي' : 'إنشاء الحساب'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {step === 1 && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#1a202c] text-gray-500 rounded-full">أو</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white text-gray-900 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                  <span>المتابعة باستخدام Google</span>
                </button>

                <p className="text-center text-gray-400 mt-8">
                  لديك حساب بالفعل؟{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    سجل دخولك
                  </Link>
                </p>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}