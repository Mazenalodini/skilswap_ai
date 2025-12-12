import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, Star, DollarSign, ArrowUp, Briefcase } from 'lucide-react';

export default function ProviderAnalytics() {
    const { user } = useAuth();
    const { services, serviceRequests } = useData();

    if (!user) return null;

    // Calculate Real Earnings from Completed Requests
    const completedRequests = serviceRequests.filter(req =>
        req.providerId === user.id && req.status === 'completed'
    );

    const totalEarnings = completedRequests.reduce((sum, req) => sum + req.budget, 0);

    // Group earnings by month for the chart
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d;
    }).reverse();

    const earningsData = last6Months.map(date => {
        const monthName = date.toLocaleString('ar-SA', { month: 'long' });
        const monthEarnings = completedRequests
            .filter(req => {
                const reqDate = new Date(req.updated_at || req.created_at);
                return reqDate.getMonth() === date.getMonth() && reqDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, req) => sum + req.budget, 0);

        return { month: monthName, amount: monthEarnings };
    });

    const maxEarnings = Math.max(...earningsData.map(d => d.amount), 100); // Ensure at least 100 for scale

    const topServices = services
        .filter(s => s.providerId === user.id)
        .slice(0, 3)
        .map(s => {
            // Calculate real earnings for this service
            const serviceEarnings = serviceRequests
                .filter(req => req.serviceId === s.id && req.status === 'completed')
                .reduce((sum, req) => sum + req.budget, 0);

            return {
                ...s,
                views: Math.floor(Math.random() * 1000) + 100, // Mock views (not in DB yet)
                conversion: (Math.random() * 5 + 1).toFixed(1), // Mock conversion (not in DB yet)
                points: serviceEarnings // Use real earnings
            };
        });

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">التحليلات والأداء</h2>
                    <p className="text-gray-500 mt-1">تتبع أرباحك وأداء خدماتك لتحسين نتائجك</p>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
                    <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-900 rounded-md">آخر 6 أشهر</button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">آخر سنة</button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            +12.5%
                        </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">إجمالي الأرباح</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{totalEarnings.toLocaleString()} نقطة</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="flex items-center text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            +5.2%
                        </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">مشاهدات الملف الشخصي</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-1">1,234</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded-full">
                            0.0%
                        </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">متوسط التقييم</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{user.reputation?.toFixed(1) || '0.0'}</div>
                </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">نمو الأرباح</h3>
                <div className="h-64 flex items-end justify-between gap-4">
                    {earningsData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                            <div
                                className="w-full bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-all duration-300"
                                style={{ height: `${(data.amount / maxEarnings) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {data.amount} نقطة
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Services */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">أفضل خدماتك أداءً</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الخدمة</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشاهدات</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">معدل التحويل</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأرباح</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topServices.length > 0 ? (
                                topServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Briefcase className="h-5 w-5 text-gray-500" />
                                                </div>
                                                <div className="mr-4">
                                                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                                                    <div className="text-sm text-gray-500">{service.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.views}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.conversion}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {service.points} نقطة
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        لا توجد خدمات كافية لعرض التحليلات
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
