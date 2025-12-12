import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'Invalid login credentials') {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.message.includes('Email not confirmed')) {
        toast.error('الرجاء تأكيد البريد الإلكتروني أو تعطيل خاصية التأكيد في Supabase');
      } else {
        toast.error('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
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

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Left Side - Visuals (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c2236033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-900/90"></div>

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold mb-2">
              <Sparkles className="w-8 h-8 text-blue-300" />
              <span>SkillSwap AI</span>
            </div>
            <p className="text-blue-200">منصة المستقبل للعمل الحر</p>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              أهلاً بك مجدداً في <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200">
                عالم الإبداع الذكي
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-md leading-relaxed">
              استكمل رحلتك المهنية وتواصل مع أفضل العملاء والمحترفين في العالم العربي.
            </p>

            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-4 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i * 10}.jpg`}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                    alt="User"
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <div className="font-bold">25,000+</div>
                <div className="text-sm text-blue-200">مستخدم نشط يثقون بنا</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-blue-300/80">
            <span>© 2024 SkillSwap AI. جميع الحقوق محفوظة.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background Elements for Mobile */}
        <div className="absolute inset-0 lg:hidden bg-[url('https://images.unsplash.com/photo-1551434678-e076c2236033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80')] bg-cover bg-center opacity-5"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-10 lg:text-right">
            <h2 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h2>
            <p className="text-gray-400">أدخل بياناتك للمتابعة إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    كلمة المرور
                  </label>
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    نسيت كلمة المرور؟
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pr-10 pl-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0f172a] text-gray-500 rounded-full">أو</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-white text-gray-900 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              <span>المتابعة باستخدام Google</span>
            </button>

            <p className="text-center text-gray-400 mt-8">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                أنشئ حساباً جديداً
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}