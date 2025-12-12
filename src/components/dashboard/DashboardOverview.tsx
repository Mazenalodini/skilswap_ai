import { Link } from 'react-router-dom';
import {
    Zap, Star, CheckCircle,
    TrendingUp, ArrowRight,
    Briefcase, DollarSign, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

import AIProposedMatches from './AIProposedMatches';

export default function DashboardOverview() {
    const { user } = useAuth();
    const { notifications, messages, serviceRequests } = useData();

    if (!user) return null;

    const userNotifications = notifications.filter(n => n.userId === user.id && !n.read);
    const userMessages = messages.filter(m => m.receiverId === user.id && !m.read);

    // Provider Stats
    const activeOrders = serviceRequests.filter(req => req.providerId === user.id && req.status === 'in-progress');

    // Client Stats
    const myRequests = serviceRequests.filter(req => req.clientId === user.id);
    const activeRequests = myRequests.filter(req => req.status === 'in-progress');

    const stats = [
        { label: 'الرصيد الحالي', value: user.points?.toLocaleString() || '0', icon: DollarSign, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
        { label: 'الطلبات النشطة', value: (activeOrders.length + activeRequests.length).toString(), icon: Activity, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
        { label: 'الخدمات المكتملة', value: user.completed_services?.toString() || '0', icon: CheckCircle, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600' },
        { label: 'التقييم العام', value: user.reputation?.toFixed(1) || '0.0', icon: Star, color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* AI Matches */}
            <div className="mb-8">
                <AIProposedMatches />
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold mb-2">مرحباً، {user.name} 👋</h1>
                        <p className="text-blue-100 text-lg">إليك نظرة سريعة على نشاطك اليوم</p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center min-w-[100px]">
                            <div className="text-2xl font-bold">{userNotifications.length}</div>
                            <div className="text-sm text-blue-100">إشعار جديد</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center min-w-[100px]">
                            <div className="text-2xl font-bold">{userMessages.length}</div>
                            <div className="text-sm text-blue-100">رسالة جديدة</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.text}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Orders Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Orders (As Provider) */}
                    {activeOrders.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                    طلبات قيد التنفيذ (كمقدم خدمة)
                                </h3>
                                <Link to="/dashboard?tab=requests" className="text-blue-600 hover:text-blue-700 text-sm font-medium">عرض الكل</Link>
                            </div>
                            <div className="space-y-4">
                                {activeOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{order.title}</h4>
                                            <p className="text-sm text-gray-500">العميل: {order.clientName}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-blue-600">{order.budget} نقطة</span>
                                            <Link to={`/dashboard?tab=requests`} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                                                التفاصيل
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">الأنشطة الأخيرة</h3>
                        </div>
                        <div className="space-y-6">
                            {/* Mocked activities for now, ideally fetch from backend */}
                            <div className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">تم تسجيل الدخول بنجاح</h4>
                                            <p className="text-sm text-gray-600 mt-1">مرحباً بك مجدداً في منصة SkillSwap</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">الآن</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
                        <div className="space-y-3">
                            <Link to="/request-service" className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium">طلب خدمة جديدة</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link to="/profile" className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-teal-50 hover:text-teal-600 transition-colors group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                        <Briefcase className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <span className="font-medium">إضافة خدمة</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h4 className="font-bold">مستواك الحالي</h4>
                                <p className="text-sm text-gray-400">{user.level}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 text-left">750 / 1000 نقطة للمستوى التالي</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
