import React from 'react';
import { Award } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface ProfileBadgesProps {
    user: User;
}

export default function ProfileBadges({ user }: ProfileBadgesProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">الشارات والإنجازات</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges?.map((badge) => (
                    <div key={badge.id} className={`border rounded-lg p-4 text-center ${badge.rarity === 'legendary' ? 'border-yellow-300 bg-yellow-50' :
                        badge.rarity === 'epic' ? 'border-purple-300 bg-purple-50' :
                            badge.rarity === 'rare' ? 'border-blue-300 bg-blue-50' :
                                'border-gray-300 bg-gray-50'
                        }`}>
                        <div className="text-4xl mb-3">{badge.badge_icon}</div>
                        <h4 className="font-semibold text-gray-900 mb-2">{badge.badge_name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{badge.badge_description}</p>
                        <div className="text-xs text-gray-500">
                            حصل عليها في {new Date(badge.earned_at).toLocaleDateString('ar-SA')}
                        </div>
                    </div>
                ))}
            </div>

            {(user.badges?.length || 0) === 0 && (
                <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد شارات بعد</h4>
                    <p className="text-gray-600">اكمل المهام والتحديات لكسب شارات جديدة</p>
                </div>
            )}
        </div>
    );
}
