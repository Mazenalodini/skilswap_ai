import React from 'react';
import { Mail, Phone, MapPin, TrendingUp, CheckCircle, Star } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface ProfileOverviewProps {
    user: User;
}

export default function ProfileOverview({ user }: ProfileOverviewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">نبذة شخصية</h3>
                <p className="text-gray-600 leading-relaxed">
                    {user.bio || 'لم يتم إضافة نبذة شخصية بعد.'}
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الاتصال</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.email}</span>
                    </div>
                    {user.phone && (
                        <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{user.phone}</span>
                        </div>
                    )}
                    {user.location && (
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{user.location}</span>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                            <div>
                                <div className="text-lg font-bold text-blue-900">المستوى {user.level}</div>
                                <div className="text-sm text-blue-600">مستوى الخبرة</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <div className="text-lg font-bold text-green-900">{user.completed_services}</div>
                                <div className="text-sm text-green-600">خدمة مكتملة</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <Star className="w-8 h-8 text-yellow-600" />
                            <div>
                                <div className="text-lg font-bold text-yellow-900">{user.reputation.toFixed(1)}</div>
                                <div className="text-sm text-yellow-600">متوسط التقييم</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
