import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, ServiceRequest, Service } from '../../contexts/DataContext';
import { Sparkles, ArrowRight, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIProposedMatches() {
    const { user } = useAuth();
    const { serviceRequests, services } = useData();
    const [suggestedRequests, setSuggestedRequests] = useState<ServiceRequest[]>([]);
    const [suggestedServices, setSuggestedServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Simulate AI Matching Algorithm
        // In a real app, this would be an edge function calling OpenAI
        const runAIMatching = () => {
            setLoading(true);

            // 1. Match Requests to User's Skills (What user can DO)
            // Assuming user.bio or level implies skills for now, or fetch from user_skills
            // Simple heuristic: match category or random "smart" selection
            const relevantRequests = serviceRequests.filter(req =>
                req.status === 'open' && req.clientId !== user.id
            ).slice(0, 3); // Get top 3

            // 2. Match Services to User's Needs (What user might WANT)
            // Match high-rated services or trending ones
            const recommendedServices = services.filter(service =>
                service.providerId !== user.id
            ).sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3);

            setTimeout(() => {
                setSuggestedRequests(relevantRequests);
                setSuggestedServices(recommendedServices);
                setLoading(false);
            }, 1500); // Fake "Analysis" delay
        };

        runAIMatching();
    }, [user, serviceRequests, services]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 animate-spin-slow" />
                    <h2 className="text-xl font-bold">جاري تحليل مهاراتك...</h2>
                </div>
                <p className="text-indigo-100">يقوم الذكاء الاصطناعي بالبحث عن أفضل الفرص المناسبة لك الآن.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Opportunities for You (Earn Points) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:bg-indigo-100 transition-colors"></div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">فرص تناسب مهاراتك</h3>
                            <p className="text-xs text-gray-500">منتقاة بواسطة AI</p>
                        </div>
                    </div>
                    <Link to="/requests" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">عرض الكل</Link>
                </div>

                <div className="space-y-4">
                    {suggestedRequests.length > 0 ? (
                        suggestedRequests.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-indigo-200">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{req.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{req.budget} نقطة • {req.category}</p>
                                </div>
                                <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                    تقديم عرض
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            لا توجد فرص مطابقة حالياً. جرب إضافة المزيد من المهارات!
                        </div>
                    )}
                </div>
            </div>

            {/* Recommended Services (Spend Points) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:bg-purple-100 transition-colors"></div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">خدمات قد تهمك</h3>
                            <p className="text-xs text-gray-500">بناءً على نشاطك</p>
                        </div>
                    </div>
                    <Link to="/services" className="text-sm text-purple-600 hover:text-purple-700 font-medium">عرض الكل</Link>
                </div>

                <div className="space-y-4">
                    {suggestedServices.length > 0 ? (
                        suggestedServices.map(service => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-purple-200">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{service.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <span className="text-yellow-500">★ {service.rating}</span> • {service.points} نقطة
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            استكشف الخدمات لنفهم اهتماماتك أكثر.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
