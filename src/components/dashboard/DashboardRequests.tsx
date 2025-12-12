import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, X, Users, Star, ExternalLink, MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, ServiceRequest } from '../../contexts/DataContext';

export default function DashboardRequests() {
    const { user } = useAuth();
    const {
        services,
        serviceRequests,
        offers,
        users,
        acceptServiceRequest,
        completeServiceRequest,
        acceptOffer
    } = useData();

    const [selectedRequestForOffers, setSelectedRequestForOffers] = useState<ServiceRequest | null>(null);

    if (!user) return null;

    const userRequests = serviceRequests.filter(request => request.clientId === user.id);
    const incomingRequests = serviceRequests.filter(request =>
        services.some(s => s.id === request.serviceId && s.providerId === user.id)
    );

    const handleAcceptOffer = async (offerId: string) => {
        if (window.confirm('هل أنت متأكد من قبول هذا العرض؟')) {
            try {
                await acceptOffer(offerId);
                setSelectedRequestForOffers(null);
            } catch (error) {
                console.error('Error accepting offer:', error);
                alert('حدث خطأ أثناء قبول العرض');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'in-review': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'مفتوح';
            case 'in-review': return 'قيد المراجعة';
            case 'accepted': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Incoming Requests (For Providers) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">الطلبات الواردة</h3>
                        <p className="text-sm text-gray-500">طلبات تحتاج إلى موافقتك أو تنفيذك</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                        {incomingRequests.length} طلب
                    </span>
                </div>

                {incomingRequests.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات واردة</h4>
                        <p className="text-gray-500">عندما يطلب شخص ما خدماتك، ستظهر الطلبات هنا</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {incomingRequests.map((request) => (
                            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-900">{request.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {getStatusLabel(request.status)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{request.description}</p>
                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <span>العميل: {users.find(u => u.id === request.clientId)?.name || 'مستخدم'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{request.deadline || 'غير محدد'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>الميزانية: {request.budget} نقطة</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {request.status === 'open' && (
                                            <>
                                                <button
                                                    onClick={() => acceptServiceRequest(request.id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    قبول الطلب
                                                </button>
                                                <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                                                    رفض
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'accepted' && (
                                            <button
                                                onClick={() => completeServiceRequest(request.id)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                تحديد كمكتمل
                                            </button>
                                        )}
                                        <Link
                                            to={`/messages`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="مراسلة العميل"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Outgoing Requests (For Clients) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">طلباتي المرسلة</h3>
                        <p className="text-sm text-gray-500">تتبع حالة الطلبات التي قمت بإنشائها</p>
                    </div>
                    <Link
                        to="/request-service"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>طلب جديد</span>
                    </Link>
                </div>

                {userRequests.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">لم تقم بإنشاء أي طلبات بعد</h4>
                        <p className="text-gray-500 mb-6">اطلب خدمة من المحترفين وابدأ مشروعك</p>
                        <Link
                            to="/request-service"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            إنشاء طلب جديد &larr;
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {userRequests.map((request) => {
                            const requestOffers = offers.filter(o => o.requestId === request.id);
                            return (
                                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-semibold text-gray-900">{request.title}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                    {getStatusLabel(request.status)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-4">{request.description}</p>
                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>الميزانية: {request.budget} نقطة</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{requestOffers.length} عروض مقدمة</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setSelectedRequestForOffers(request)}
                                                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium shadow-sm"
                                            >
                                                عرض العروض ({requestOffers.length})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Offers Modal */}
            {selectedRequestForOffers && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">العروض المقدمة</h3>
                                <p className="text-sm text-gray-500 mt-1">{selectedRequestForOffers.title}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRequestForOffers(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1">
                            {offers.filter(o => o.requestId === selectedRequestForOffers.id).length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 text-lg">لا توجد عروض مقدمة لهذا الطلب حتى الآن</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {offers
                                        .filter(o => o.requestId === selectedRequestForOffers.id)
                                        .map(offer => {
                                            const provider = users.find(u => u.id === offer.providerId);
                                            return (
                                                <div key={offer.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <Link
                                                            to={`/profile/${offer.providerId}`}
                                                            className="flex items-center space-x-3 group"
                                                        >
                                                            <img
                                                                src={provider?.avatar_url || 'https://via.placeholder.com/40'}
                                                                alt={provider?.name}
                                                                className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-colors"
                                                            />
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                                    {provider?.name}
                                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </h4>
                                                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                                                    <Star className="w-3 h-3 text-yellow-500 fill-current ml-1" />
                                                                    <span>{provider?.reputation?.toFixed(1) || '0.0'}</span>
                                                                    <span className="mx-1">•</span>
                                                                    <span>{provider?.level || 'مبتدئ'}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold text-blue-600">{offer.price}</div>
                                                            <div className="text-xs text-gray-500">نقطة</div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 text-sm leading-relaxed">
                                                        {offer.message}
                                                    </div>

                                                    {offer.status === 'pending' ? (
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => handleAcceptOffer(offer.id)}
                                                                className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-sm hover:shadow"
                                                            >
                                                                قبول العرض
                                                            </button>
                                                            <Link
                                                                to={`/messages?userId=${offer.providerId}`}
                                                                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center"
                                                            >
                                                                <MessageCircle className="w-4 h-4 ml-2" />
                                                                مراسلة
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-green-50 text-green-700 text-center py-2 rounded-lg text-sm font-medium border border-green-100">
                                                            تم قبول هذا العرض
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
