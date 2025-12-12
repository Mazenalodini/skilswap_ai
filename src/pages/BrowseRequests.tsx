import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Briefcase } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import RequestCard from '../components/RequestCard';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function BrowseRequests() {
    const { serviceRequests, loading, createOffer } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // newest, budget_high, budget_low

    // Filter requests
    const filteredRequests = serviceRequests.filter(request => {
        if (request.status !== 'open') return false;
        // if (user && request.clientId === user.id) return false; // Uncomment to hide own requests

        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;

        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === 'budget_high') {
            return b.budget - a.budget;
        } else if (sortBy === 'budget_low') {
            return a.budget - b.budget;
        }
        return 0;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerMessage, setOfferMessage] = useState('');

    const openOfferModal = (request: any) => {
        if (!user) {
            toast.error('يرجى تسجيل الدخول أولاً');
            return;
        }
        setSelectedRequest(request);
        setOfferPrice(request.budget.toString());
        setIsModalOpen(true);
    };

    const handleSubmitOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest || !offerPrice || !offerMessage) return;

        try {
            await createOffer({
                requestId: selectedRequest.id,
                price: parseInt(offerPrice),
                message: offerMessage
            });
            setIsModalOpen(false);
            setOfferMessage('');
            setOfferPrice('');
            toast.success('تم إرسال العرض بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء إرسال العرض');
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>تصفح المشاريع | SkillSwap AI</title>
                <meta name="description" content="ابحث عن مشاريع جديدة وفرص عمل حر في مختلف المجالات. قدم عروضك وابدأ العمل فوراً." />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 mb-12 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            ابحث عن مشاريع جديدة <br /> وابدأ العمل فوراً
                        </h1>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl">
                            تصفح مئات الطلبات المفتوحة من عملاء يبحثون عن محترفين مثلك. قدم عروضك ونفذ المشاريع لزيادة دخلك وتقييمك.
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white p-2 rounded-2xl shadow-lg flex flex-col md:flex-row gap-2 max-w-2xl">
                            <div className="flex-grow relative">
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن مشروع، مهارة، أو عميل..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-12 pr-12 pl-4 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                            <div className="md:w-48 relative border-t md:border-t-0 md:border-r border-gray-100">
                                <Briefcase className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full h-12 pr-12 pl-4 bg-transparent border-none focus:ring-0 text-gray-900 appearance-none cursor-pointer"
                                >
                                    <option value="all">جميع الفئات</option>
                                    <option value="programming">برمجة وتطوير</option>
                                    <option value="design">تصميم وجرافيك</option>
                                    <option value="marketing">تسويق إلكتروني</option>
                                    <option value="writing">كتابة وترجمة</option>
                                    <option value="video">فيديو وصوتيات</option>
                                    <option value="business">أعمال واستشارات</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Filter className="w-5 h-5" />
                        <span className="font-medium">عرض {filteredRequests.length} طلب</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 ml-2">ترتيب حسب:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer"
                            >
                                <option value="newest">الأحدث</option>
                                <option value="budget_high">الأعلى ميزانية</option>
                                <option value="budget_low">الأقل ميزانية</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <CardSkeleton key={i} />
                        ))
                    ) : filteredRequests.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات مطابقة</h3>
                            <p className="text-gray-500">جرب تغيير مصطلحات البحث أو الفلاتر للعثور على نتائج</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <RequestCard
                                key={request.id}
                                request={request}
                                onOffer={openOfferModal}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Offer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">تقديم عرض جديد</h3>
                                <p className="text-sm text-gray-500 mt-1">قدم أفضل ما لديك للفوز بهذا المشروع</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitOffer} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    السعر المقترح (نقطة)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-medium"
                                        placeholder="0"
                                    />
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                                        نقطة
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    الميزانية المقترحة من العميل: <span className="font-bold text-gray-900">{selectedRequest?.budget} نقطة</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    رسالة العرض
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={offerMessage}
                                    onChange={(e) => setOfferMessage(e.target.value)}
                                    placeholder="اشرح للعميل لماذا أنت الشخص المناسب لهذه المهمة. اذكر خبراتك السابقة ذات الصلة..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                                >
                                    إرسال العرض
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
