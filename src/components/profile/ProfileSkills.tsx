import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle, Star, Award } from 'lucide-react';
import { User } from '../../contexts/AuthContext';

interface ProfileSkillsProps {
    user: User;
    isOwnProfile: boolean;
}

export default function ProfileSkills({ user, isOwnProfile }: ProfileSkillsProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">المهارات المؤكدة</h3>
                {isOwnProfile && (
                    <Link
                        to="/skill-assessment/general"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة مهارة</span>
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                {(user.skills || []).map((skill) => (
                    <div key={skill.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-900">{skill.skill_name}</h4>
                                <p className="text-sm text-gray-600">{skill.category}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {skill.verified && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                    skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        skill.level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {skill.level === 'beginner' ? 'مبتدئ' :
                                        skill.level === 'intermediate' ? 'متوسط' :
                                            skill.level === 'advanced' ? 'متقدم' : 'خبير'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{skill.rating.toFixed(1)}</span>
                            </div>
                            <span>•</span>
                            <span>{skill.completed_projects} مشروع مكتمل</span>
                            <span>•</span>
                            <span>تم التقييم في {new Date(skill.assessment_date).toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                ))}
            </div>

            {(user.skills?.length || 0) === 0 && (
                <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">لا توجد مهارات مؤكدة</h4>
                    <p className="text-gray-600 mb-6">ابدأ بإضافة مهاراتك واجتياز اختبارات التقييم</p>
                    {isOwnProfile && (
                        <Link
                            to="/skill-assessment/general"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                        >
                            اختبر مهاراتك الآن
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
