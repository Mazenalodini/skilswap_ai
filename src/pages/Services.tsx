import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useData, ServiceRequest } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../lib/ai';
import ServiceCard from '../components/ServiceCard';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const { services, categories, sendMessage, createServiceRequest, loading: dataLoading } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Smart Search State
  const [isSearching, setIsSearching] = useState(false);
  const [smartResults, setSmartResults] = useState<string[] | null>(null);
  const [searchReasoning, setSearchReasoning] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSmartResults(null);
      setSearchReasoning(null);
      return;
    }

    setIsSearching(true);
    try {
      // Use the new Smart Search Agent
      const result = await aiService.searchServicesSmart(searchQuery, services);
      setSmartResults(result.matchedServiceIds);
      setSearchReasoning(result.reasoning);
    } catch (error) {
      console.error('Smart search failed', error);
      toast.error('حدث خطأ في البحث الذكي، جاري الانتقال للبحث التقليدي');
      setSmartResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Filter services calculation
  const displayedServices = useMemo(() => {
    let filtered = services;

    // 1. If Smart Results exist, strictly use them (they are already sorted by relevance)
    if (smartResults) {
      filtered = smartResults
        .map(id => services.find(s => s.id === id))
        .filter(Boolean) as any[];

      // If categories/filters are ALSO selected, apply them as secondary filters
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(s => s.category === selectedCategory);
      }
      return filtered;
    }

    // 2. Normal Filtering (Fallback or manual browsing)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(s => s.skillLevel === selectedLevel);
    }
    if (minRating > 0) {
      filtered = filtered.filter(s => (s.rating || 0) >= minRating);
    }

    // 3. Sorting (only if NOT smart searching, as smart search does its own relevance sort)
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.points - b.points;
        case 'price_desc': return b.points - a.points;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'newest': default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  }, [services, smartResults, selectedCategory, selectedLevel, minRating, sortBy]);

  const handleContactProvider = (providerId: string, serviceName: string) => {
    if (!user) return;
    const message = `مرحباً، أنا مهتم بخدمة "${serviceName}". هل يمكننا مناقشة التفاصيل؟`;
    sendMessage(providerId, message);
    toast.success('تم إرسال الرسالة بنجاح! يمكنك متابعة المحادثة من صفحة الرسائل.');
  };

  const handleRequestService = (serviceId: string) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) {
      toast.error('الخدمة غير موجودة');
      return;
    }

    const serviceRequest: Partial<ServiceRequest> = {
      title: `طلب خدمة: ${service.title}`,
      description: `أرغب في الحصول على خدمة "${service.title}" من فئة ${service.category}`,
      category: service.category,
      skillNeeded: service.skillRequired,
      budget: service.points,
      clientId: user.id,
      status: 'open'
    };

    createServiceRequest(serviceRequest)
      .then(() => {
        toast.success('تم إرسال طلب الخدمة بنجاح! ستجد الطلب في لوحة التحكم.');
      })
      .catch((error) => {
        toast.error(error.message || 'حدث خطأ أثناء طلب الخدمة');
      });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setMinRating(0);
    setSearchQuery('');
    setSmartResults(null);
    setSearchReasoning(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>تصفح الخدمات | SkillSwap AI</title>
        <meta name="description" content="تصفح مئات الخدمات الاحترافية في مجالات البرمجة، التصميم، التسويق، والمزيد. اختر الخبير المناسب لمشروعك." />
      </Helmet>
      {/* Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          استكشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">الخدمات الاحترافية</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          اكتشف مجموعة واسعة من الخدمات المهنية المقدمة من خبراء مؤهلين لإنجاز مشاريعك بكفاءة عالية
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12 relative overflow-hidden transition-all hover:shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50"></div>

        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-end relative z-10">
          <div className="flex-grow w-full">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              البحث الذكي (AI Search)
            </label>
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جرب أن تكتب: أريد تصميم شعار رخيص وسريع..."
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center space-x-2 px-6 py-4 border rounded-xl transition-all font-medium min-w-[120px] ${isFilterOpen
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
          >
            <Filter className="w-5 h-5" />
            <span>فلتر</span>
          </button>

          <button
            type="submit"
            disabled={isSearching}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2 min-w-[140px] disabled:opacity-70"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>بحث ذكي</span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Filter Options */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'mt-8 opacity-100 max-h-96' : 'mt-0 opacity-0 max-h-0'}`}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">الفئة</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">مستوى المهارة</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value="all">جميع المستويات</option>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
              <option value="expert">خبير</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">التقييم</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            >
              <option value={0}>أي تقييم</option>
              <option value={4}>4 نجوم فأكثر</option>
              <option value={4.5}>4.5 نجوم فأكثر</option>
              <option value={5}>5 نجوم فقط</option>
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              مسح جميع الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {displayedServices.length} خدمة متاحة
          </h2>
          {searchReasoning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 bg-purple-50 text-purple-800 p-3 rounded-xl text-sm border border-purple-100 flex items-start gap-2"
            >
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{searchReasoning}</p>
            </motion.div>
          )}
        </div>

        {!smartResults && (
          <div className="flex items-center space-x-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-500 px-3">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-none bg-transparent text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer py-2 pl-8 pr-2"
            >
              <option value="newest">الأحدث</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        )}
      </div>

      {/* Services Grid */}
      {dataLoading || isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : displayedServices.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">لم نجد أي خدمات</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            جرب تغيير كلمات البحث أو تعديل الفلاتر للعثور على ما تبحث عنه
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onRequest={handleRequestService}
              onContact={handleContactProvider}
              onSave={(serviceId) => { }}
              onShare={(serviceId) => { }}
            />
          ))}
        </div>
      )}
    </div>
  );
}