
import { useData } from '../../contexts/DataContext';
import { BookOpen, Award, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardLearning() {
    const { learningPaths, userLearningProgress } = useData();

    const getProgress = (pathId: string) => {
        return userLearningProgress.find(p => p.learning_path_id === pathId);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">التعلم والتطوير</h2>
                    <p className="text-gray-500 mt-1">تابع تقدمك في المسارات التعليمية واحصل على شهادات موثقة</p>
                </div>
                <Link
                    to="/learning"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <BookOpen className="w-4 h-4" />
                    <span>تصفح كل المسارات</span>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{userLearningProgress.length}</h3>
                    <p className="text-gray-500 text-sm">مسارات ملتحق بها</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {userLearningProgress.filter(p => p.completion_rate === 100).length}
                    </h3>
                    <p className="text-gray-500 text-sm">مسارات مكتملة</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {userLearningProgress.reduce((acc, curr) => acc + (curr.completion_rate || 0), 0) / (userLearningProgress.length || 1)}%
                    </h3>
                    <p className="text-gray-500 text-sm">متوسط الإنجاز</p>
                </div>
            </div>

            {/* Active Paths */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">المسارات النشطة</h3>
                </div>

                {userLearningProgress.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مسارات نشطة</h3>
                        <p className="text-gray-500 mb-6">ابدأ رحلة التعلم الخاصة بك اليوم وطور مهاراتك</p>
                        <Link
                            to="/learning"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            استعراض المسارات
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {userLearningProgress.map((progress) => {
                            const path = learningPaths.find(p => p.id === progress.learning_path_id);
                            if (!path) return null;

                            return (
                                <div key={progress.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Award className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{path.title}</h4>
                                                <p className="text-sm text-gray-500">{path.skill} • {path.difficulty}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/learning/${path.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <PlayCircle className="w-6 h-6" />
                                        </Link>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>نسبة الإنجاز</span>
                                            <span className="font-medium">{progress.completion_rate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress.completion_rate}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
