import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowRight, Shield, TrendingUp, CheckCircle, Brain, Search,
  Code, Palette, Megaphone, PenTool, Smartphone, Video,
  Database, Briefcase, Sparkles, Zap, Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CategoryCard from '../components/CategoryCard';
import ServicePreviewCard from '../components/ServicePreviewCard';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
      }, 1500);
    }
  };

  const categories = [
    { title: 'تطوير البرمجيات', icon: Code, count: '120+', color: 'blue', slug: 'development' },
    { title: 'التصميم والإبداع', icon: Palette, count: '85+', color: 'purple', slug: 'design' },
    { title: 'التسويق الرقمي', icon: Megaphone, count: '60+', color: 'green', slug: 'marketing' },
    { title: 'الكتابة والترجمة', icon: PenTool, count: '90+', color: 'orange', slug: 'writing' },
    { title: 'تطبيقات الجوال', icon: Smartphone, count: '45+', color: 'pink', slug: 'mobile' },
    { title: 'الفيديو والأنيميشن', icon: Video, count: '30+', color: 'red', slug: 'video' },
    { title: 'علوم البيانات', icon: Database, count: '25+', color: 'indigo', slug: 'data' },
    { title: 'الأعمال والاستشارات', icon: Briefcase, count: '50+', color: 'teal', slug: 'business' },
  ];

  const featuredServices = [
    {
      id: '1',
      title: 'تطوير موقع إلكتروني متكامل باستخدام React و Node.js',
      providerName: 'أحمد محمد',
      providerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      price: 500,
      rating: 4.9,
      reviews: 24,
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'تطوير البرمجيات'
    },
    {
      id: '2',
      title: 'تصميم هوية بصرية كاملة للشركات الناشئة',
      providerName: 'سارة علي',
      providerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      price: 300,
      rating: 5.0,
      reviews: 18,
      image: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'التصميم'
    },
    {
      id: '3',
      title: 'خطة تسويقية شاملة وإدارة منصات التواصل',
      providerName: 'خالد عمر',
      providerAvatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=100',
      price: 250,
      rating: 4.8,
      reviews: 32,
      image: 'https://images.pexels.com/photos/905164/pexels-photo-905164.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'التسويق'
    },
    {
      id: '4',
      title: 'ترجمة احترافية للمقالات والمحتوى التقني',
      providerName: 'منى سعيد',
      providerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      price: 50,
      rating: 4.7,
      reviews: 56,
      image: 'https://images.pexels.com/photos/3747463/pexels-photo-3747463.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'الترجمة'
    }
  ];

  const stats = [
    { label: 'مستخدم نشط', value: '25,000+' },
    { label: 'خدمة مكتملة', value: '100,000+' },
    { label: 'مهارة متاحة', value: '500+' },
    { label: 'معدل الرضا', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>SkillSwap AI | منصة المستقبل للعمل الحر</title>
        <meta name="description" content="اكتشف قوة الذكاء الاصطناعي في العمل الحر. منصة SkillSwap AI تربطك بأفضل المحترفين وتساعدك على إنجاز مشاريعك بذكاء وسرعة." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-[#0f172a] text-white overflow-hidden min-h-[85vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-blue-200">الجيل القادم من العمل الحر</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
            >
              أنجز مشاريعك بذكاء <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                SkillSwap AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              المنصة الأولى التي تستخدم الذكاء الاصطناعي لمطابقة مهاراتك مع أفضل الفرص، وضمان جودة التنفيذ لكل مشروع.
            </motion.p>

            {/* AI Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-3xl mx-auto mb-16 relative z-20"
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20">
                  <div className="flex-grow flex items-center px-4">
                    {isAnalyzing ? (
                      <div className="w-6 h-6 ml-3 relative">
                        <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <Brain className="w-6 h-6 text-purple-500 ml-3" />
                    )}
                    <input
                      type="text"
                      placeholder={isAnalyzing ? "جاري تحليل طلبك..." : "صف مشروعك وسيقوم الذكاء الاصطناعي باقتراح الأفضل..."}
                      className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 text-lg py-3"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isAnalyzing}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isAnalyzing ? 'تحليل...' : 'بحث ذكي'}
                    {!isAnalyzing && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>

              {/* Quick Tags */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-400">
                <span>رائج الآن:</span>
                {['تطوير React', 'تصميم UI/UX', 'ترجمة قانونية', 'تحليل بيانات'].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/services?search=${tag}`)}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">استكشف المهارات المطلوبة</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">تصفح مئات الفئات واعثر على الخبراء المناسبين لمشروعك القادم</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us (AI Features) */}
      <section className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6">
                لماذا نحن؟
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                قوة الذكاء الاصطناعي <br />
                <span className="text-blue-400">في خدمتك</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                نحن لا نوفر منصة للعمل الحر فحسب، بل نقدم مساعداً ذكياً يعمل معك طوال الوقت لضمان نجاح مشاريعك.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Brain,
                    title: 'مطابقة ذكية للمواهب',
                    desc: 'خوارزمياتنا تحلل متطلباتك وتقترح عليك أفضل المستقلين بدقة تصل إلى 98%.'
                  },
                  {
                    icon: Shield,
                    title: 'نظام ضمان وحماية',
                    desc: 'أموالك محمية بنظام الضمان (Escrow) ولا يتم تحريرها إلا بعد استلام العمل كاملاً.'
                  },
                  {
                    icon: Zap,
                    title: 'إنجاز أسرع',
                    desc: 'أدوات ذكية تساعد المستقلين على العمل بكفاءة أعلى، مما يعني تسليم مشاريعك في وقت قياسي.'
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 transform rotate-3"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                {/* Mock UI of AI Matching */}
                <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-auto text-xs text-gray-500">AI Analysis Module</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>جاري تحليل متطلبات المشروع...</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">أفضل مطابقة</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">98% توافق</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" className="w-10 h-10 rounded-full" alt="User" />
                      <div>
                        <div className="text-sm font-bold text-white">أحمد محمد</div>
                        <div className="text-xs text-gray-400">مطور Full Stack</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">خدمات مميزة</h2>
              <p className="text-gray-600">أفضل الخدمات المختارة لك من محترفين موثوقين</p>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700">
              عرض الكل <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map((service) => (
              <ServicePreviewCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <h2 className="text-4xl font-bold mb-6 relative z-10">جاهز لبدء رحلتك؟</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
              انضم إلى آلاف المبدعين والمحترفين الذين يغيرون طريقة العمل في العالم العربي.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-lg transition-all"
                >
                  ابدأ الآن مجاناً
                </Link>
                <Link
                  to="/services"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  تصفح الخدمات
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-lg transition-all inline-flex items-center relative z-10"
              >
                الذهاب للوحة التحكم
                <ArrowRight className="w-5 h-5 mr-2" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}