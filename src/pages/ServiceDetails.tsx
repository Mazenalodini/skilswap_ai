import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Star, Clock, Zap, MessageCircle, Heart, Share2,
    ArrowRight, CheckCircle, Calendar, Shield, Award, ThumbsUp
} from 'lucide-react';
import { useData, ServiceRequest } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { DetailSkeleton } from '../components/ui/Skeleton';

export default function ServiceDetails() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { services, createServiceRequest, sendMessage } = useData();
    const { user } = useAuth();

    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showNegotiateModal, setShowNegotiateModal] = useState(false);

    // Negotiation Form State
    const [negotiationForm, setNegotiationForm] = useState({
        budget: 0,
        deadline: '',
        notes: ''
    });

    useEffect(() => {
        if (serviceId) {
            const foundService = services.find(s => s.id === serviceId);
            if (foundService) {
                setService(foundService);
                setNegotiationForm(prev => ({
                    ...prev,
                    budget: foundService.points
                }));
            }
            setLoading(false);
        }
    }, [serviceId, services]);

    const handleContactProvider = () => {
        if (!user) {
            toast.error('يرجى تسجيل الدخول أولاً');
            return;
        }
        if (!service) return;

        const message = `مرحباً، أنا مهتم بخدمة "${service.title}". هل يمكننا مناقشة التفاصيل؟`;
        sendMessage(service.providerId, message);
        navigate('/messages');
    };

    const handleRequestService = (isNegotiation = false) => {
        if (!user) {
            toast.error('يرجى تسجيل الدخول أولاً');
            return;
        }
        if (!service) return;

        const requestData: Partial<ServiceRequest> = {
            title: `طلب خدمة: ${service.title}`,
            description: isNegotiation
                ? `طلب مخصص لخدمة "${service.title}". \n\nملاحظات: ${negotiationForm.notes}`
                : `أرغب في الحصول على خدمة "${service.title}" من فئة ${service.category}`,
            category: service.category,
            skillNeeded: service.skillRequired,
            budget: isNegotiation ? negotiationForm.budget : service.points,
            deadline: isNegotiation ? negotiationForm.deadline : undefined,
            clientId: user.id,
            serviceId: service.id, // Pass serviceId
            status: 'open',
            requirements: service.requirements || []
        };

        createServiceRequest(requestData)
            .then(() => {
                toast.success('تم إرسال الطلب بنجاح!');
                setShowNegotiateModal(false);
                navigate('/dashboard');
            })
            .catch((error) => {
                toast.error('حدث خطأ أثناء إرسال الطلب');
                console.error(error);
            });
    };

    // Mock Reviews Data (since we don't have a reviews table yet)
    const mockReviews = [
        {
            id: 1,
            user: "أحمد محمد",
            avatar: "https://ui-avatars.com/api/?name=Ahmed+Mohamed&background=random",
            rating: 5,
            date: "منذ يومين",
            comment: "خدمة ممتازة وسرعة في التنفيذ. أنصح بالتعامل معه."
        },
        {
            id: 2,
            user: "سارة علي",
            avatar: "https://ui-avatars.com/api/?name=Sara+Ali&background=random",
            rating: 4.5,
            date: "منذ أسبوع",
            comment: "عمل رائع، لكن تأخر قليلاً في التسليم. النتيجة النهائية مرضية جداً."
        },
        {
            id: 3,
            user: "خالد عمر",
            avatar: "https://ui-avatars.com/api/?name=Khaled+Omar&background=random",
            rating: 5,
            date: "منذ أسبوعين",
            comment: "محترف جداً وفهم المطلوب من أول مرة. شكراً لك!"
        }
    ];


    // ... existing imports

    // ... inside component
    if (loading) {
        return <DetailSkeleton />;
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">الخدمة غير موجودة</h2>
                    <Link to="/services" className="text-blue-600 hover:underline">
                        العودة للخدمات
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
                    <span className="mx-2">/</span>
                    <Link to="/services" className="hover:text-blue-600 transition-colors">الخدمات</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-xs">{service.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-full opacity-50"></div>

                            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-blue-100">
                                    {service.category}
                                </span>
                                <span className={`text-sm font-medium px-4 py-1.5 rounded-full border ${service.skillLevel === 'beginner' ? 'bg-green-50 text-green-700 border-green-100' :
                                    service.skillLevel === 'intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        service.skillLevel === 'advanced' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {service.skillLevel === 'beginner' ? 'مبتدئ' :
                                        service.skillLevel === 'intermediate' ? 'متوسط' :
                                            service.skillLevel === 'advanced' ? 'متقدم' : 'خبير'}
                                </span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">{service.title}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-center space-x-1.5 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="font-bold text-gray-900">{(service.rating || 0).toFixed(1)}</span>
                                    <span className="text-gray-500">({service.reviews || 0} تقييم)</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span>مدة التنفيذ: <span className="font-medium text-gray-900">{service.estimatedTime}</span></span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span><span className="font-medium text-gray-900">{service.completedOrders || 0}</span> طلب مكتمل</span>
                                </div>
                            </div>

                            {service.portfolio && service.portfolio.length > 0 && (
                                <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                                    <img
                                        src={service.portfolio[0]}
                                        alt={service.title}
                                        className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-blue-600" />
                                وصف الخدمة
                            </h3>
                            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                {service.description}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">ماذا ستحصل عليه</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {(service.requirements || ['تسليم الملفات المصدرية', 'دعم فني لمدة أسبوع', 'تعديلات غير محدودة']).map((req: string, index: number) => (
                                    <li key={index} className="flex items-center space-x-3 text-gray-700 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="bg-green-100 p-1 rounded-full">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-900">التقييمات والمراجعات</h3>
                                <div className="flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                    <span className="text-2xl font-bold text-gray-900">{(service.rating || 0).toFixed(1)}</span>
                                    <span className="text-gray-500">/ 5</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <div className="font-bold text-gray-900">{review.user}</div>
                                                    <div className="text-xs text-gray-500">{review.date}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                <span className="text-sm font-bold text-gray-900 mr-1">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed pr-14">{review.comment}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition-colors border border-blue-100">
                                عرض المزيد من التقييمات
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">سعر الخدمة</span>
                                <div className="flex items-center space-x-1">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                    <span className="text-4xl font-bold text-gray-900">{service.points}</span>
                                    <span className="text-gray-500 font-medium mt-2">نقطة</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => handleRequestService(false)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 group"
                                >
                                    <span>شراء الخدمة</span>
                                    <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => setShowNegotiateModal(true)}
                                    className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                                >
                                    تفاوض على السعر / الوقت
                                </button>

                                <button
                                    onClick={handleContactProvider}
                                    className="w-full bg-gray-50 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>تواصل مع البائع</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm pt-2">
                                <button className="flex items-center space-x-1.5 hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                    <span>إضافة للمفضلة</span>
                                </button>
                                <button className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    <span>مشاركة</span>
                                </button>
                            </div>
                        </div>

                        {/* Provider Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                عن البائع
                            </h3>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative">
                                    <img
                                        src={service.providerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.providerName || 'User')}&background=random`}
                                        alt={service.providerName}
                                        className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-50"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <Link to={`/profile/${service.providerId}`} className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                                        {service.providerName}
                                    </Link>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        عضو موثوق منذ 2023
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-center text-sm mb-6">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="font-bold text-gray-900 text-lg">100%</div>
                                    <div className="text-gray-500 text-xs">سرعة الرد</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="font-bold text-gray-900 text-lg">100%</div>
                                    <div className="text-gray-500 text-xs">تسليم في الموعد</div>
                                </div>
                            </div>

                            <Link
                                to={`/profile/${service.providerId}`}
                                className="block w-full text-center py-2.5 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm"
                            >
                                زيارة الملف الشخصي
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Negotiation Modal */}
            {showNegotiateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl transform transition-all scale-100">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ThumbsUp className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">تفاوض على الخدمة</h3>
                            <p className="text-gray-600">
                                يمكنك اقتراح ميزانية أو وقت تسليم مختلف لهذه الخدمة.
                            </p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الميزانية المقترحة (نقطة)</label>
                                <div className="relative">
                                    <Zap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        value={negotiationForm.budget}
                                        onChange={(e) => setNegotiationForm({ ...negotiationForm, budget: parseInt(e.target.value) })}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">موعد التسليم المقترح</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        value={negotiationForm.deadline}
                                        onChange={(e) => setNegotiationForm({ ...negotiationForm, deadline: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                                <textarea
                                    value={negotiationForm.notes}
                                    onChange={(e) => setNegotiationForm({ ...negotiationForm, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="اشرح سبب طلبك للتعديل..."
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleRequestService(true)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                            >
                                إرسال العرض
                            </button>
                            <button
                                onClick={() => setShowNegotiateModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
