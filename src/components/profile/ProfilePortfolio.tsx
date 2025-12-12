import React from 'react';
import { Plus, ExternalLink, Star, BookOpen } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface ProfilePortfolioProps {
    user: User;
    isOwnProfile: boolean;
    showPortfolioForm: boolean;
    setShowPortfolioForm: (show: boolean) => void;
    newPortfolioForm: any;
    setNewPortfolioForm: (form: any) => void;
    handleAddPortfolio: () => void;
}

export default function ProfilePortfolio({
    user,
    isOwnProfile,
    showPortfolioForm,
    setShowPortfolioForm,
    newPortfolioForm,
    setNewPortfolioForm,
    handleAddPortfolio
}: ProfilePortfolioProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">معرض الأعمال</h3>
                {isOwnProfile && (
                    <button
                        onClick={() => setShowPortfolioForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة عمل</span>
                    </button>
                )}
            </div>

            {showPortfolioForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">إضافة عمل جديد</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان العمل</label>
                            <input
                                type="text"
                                value={newPortfolioForm.title}
                                onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="مثال: تطبيق إدارة المهام"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">رابط المشروع</label>
                            <input
                                type="url"
                                value={newPortfolioForm.projectUrl}
                                onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, projectUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">وصف العمل</label>
                            <textarea
                                value={newPortfolioForm.description}
                                onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="اشرح تفاصيل العمل والتقنيات المستخدمة..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية</label>
                            <input
                                type="text"
                                value={newPortfolioForm.tags}
                                onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, tags: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="React, Node.js, MongoDB (مفصولة بفاصلة)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
                            <input
                                type="url"
                                value={newPortfolioForm.images[0]}
                                onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, images: [e.target.value] })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                        <button
                            onClick={handleAddPortfolio}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            إضافة العمل
                        </button>
                        <button
                            onClick={() => setShowPortfolioForm(false)}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(user.portfolio || []).map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {item.images.length > 0 && (
                            <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                {item.project_url && (
                                    <a
                                        href={item.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {item.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-gray-600">{item.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-500">
                                    {new Date(item.completed_at).toLocaleDateString('ar-SA')}
                                </span>
                            </div>

                            {item.client_feedback && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 italic">"{item.client_feedback}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(user.portfolio?.length || 0) === 0 && !showPortfolioForm && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد أعمال في المعرض</h4>
                    <p className="text-gray-600 mb-6">ابدأ بإضافة أعمالك ومشاريعك لعرضها للعملاء</p>
                    {isOwnProfile && (
                        <button
                            onClick={() => setShowPortfolioForm(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            أضف عملك الأول
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
