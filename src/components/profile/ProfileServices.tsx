import React from 'react';
import { Plus, Users } from 'lucide-react';
import { User } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import ServiceCard from '../ServiceCard';
import { useNavigate } from 'react-router-dom';

interface ProfileServicesProps {
    user: User;
    isOwnProfile: boolean;
    showServiceForm: boolean;
    setShowServiceForm: (show: boolean) => void;
    newServiceForm: any;
    setNewServiceForm: (form: any) => void;
    handleCreateService: () => void;
}

export default function ProfileServices({
    user,
    isOwnProfile,
    showServiceForm,
    setShowServiceForm,
    newServiceForm,
    setNewServiceForm,
    handleCreateService
}: ProfileServicesProps) {
    const { services, createServiceRequest, sendMessage } = useData();
    const navigate = useNavigate();

    // Filter services for this user
    const userServices = services.filter(service => service.providerId === user.id);

    const handleRequestService = (serviceId: string) => {
        navigate(`/services/${serviceId}`);
    };

    const handleContactProvider = (providerId: string, serviceName: string) => {
        if (!user) {
            alert('يرجى تسجيل الدخول أولاً');
            return;
        }
        const message = `مرحباً، أنا مهتم بخدمة "${serviceName}". هل يمكننا مناقشة التفاصيل؟`;
        sendMessage(providerId, message);
        navigate('/messages');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">الخدمات المقدمة</h3>
                {isOwnProfile && (
                    <button
                        onClick={() => setShowServiceForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة خدمة</span>
                    </button>
                )}
            </div>

            {showServiceForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">إضافة خدمة جديدة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الخدمة</label>
                            <input
                                type="text"
                                value={newServiceForm.title}
                                onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="مثال: تطوير موقع إلكتروني"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">النقاط المطلوبة</label>
                            <input
                                type="number"
                                value={newServiceForm.points}
                                onChange={(e) => setNewServiceForm({ ...newServiceForm, points: parseInt(e.target.value) || 100 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">وصف الخدمة</label>
                            <textarea
                                value={newServiceForm.description}
                                onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="اشرح تفاصيل الخدمة التي تقدمها..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الوقت المتوقع</label>
                            <input
                                type="text"
                                value={newServiceForm.estimatedTime}
                                onChange={(e) => setNewServiceForm({ ...newServiceForm, estimatedTime: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="مثال: 3-5 أيام"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية</label>
                            <input
                                type="text"
                                value={newServiceForm.tags}
                                onChange={(e) => setNewServiceForm({ ...newServiceForm, tags: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="React, JavaScript, تطوير ويب (مفصولة بفاصلة)"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                        <button
                            onClick={handleCreateService}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            إنشاء الخدمة
                        </button>
                        <button
                            onClick={() => setShowServiceForm(false)}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            )}

            {userServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={{
                                ...service,
                                providerName: user.name,
                                providerAvatar: user.avatar_url,
                                rating: user.reputation, // Using user reputation as service rating for now
                                reviews: user.completed_services // Using completed services count as reviews count for now
                            }}
                            onRequest={handleRequestService}
                            onContact={handleContactProvider}
                        />
                    ))}
                </div>
            ) : (
                !showServiceForm && (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h4>
                        <p className="text-gray-600">هذا المستخدم لم يقم بإضافة أي خدمات بعد.</p>
                    </div>
                )
            )}
        </div>
    );
}
