import React from 'react';
import { Zap, Star, CheckCircle, BookOpen } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface ProfileStatsProps {
    user: User;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">{user.points.toLocaleString()}</span>
                </div>
                <span className="text-sm text-gray-600">النقاط</span>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-gray-900">{user.reputation.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-600">التقييم</span>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">{user.completed_services}</span>
                </div>
                <span className="text-sm text-gray-600">خدمة مكتملة</span>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-teal-600" />
                    <span className="text-2xl font-bold text-gray-900">{user.skills?.length || 0}</span>
                </div>
                <span className="text-sm text-gray-600">مهارة</span>
            </div>
        </div>
    );
}
