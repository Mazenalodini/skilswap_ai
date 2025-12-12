import { Link } from 'react-router-dom';
import { Plus, Users, Clock, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export default function DashboardServices() {
    const { user } = useAuth();
    const { services } = useData();

    if (!user) return null;

    const userServices = services.filter(service => service.providerId === user.id);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">خدماتي</h2>
                    <p className="text-gray-500 mt-1">إدارة الخدمات التي تقدمها للمجتمع</p>
                </div>
                <Link
                    to="/profile"
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium shadow-sm hover:shadow"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة خدمة جديدة</span>
                </Link>
            </div>

            {userServices.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد خدمات حالياً</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        ابدأ رحلتك كمقدم خدمات من خلال إضافة أول خدمة لك. يمكنك تقديم مهاراتك في البرمجة، التصميم، الترجمة، وغيرها.
                    </p>
                    <Link
                        to="/profile"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                        إضافة خدمة الآن
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userServices.map((service) => (
                        <div key={service.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.status === 'available' ? 'bg-green-100 text-green-700' :
                                        service.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {service.status === 'available' ? 'متاح' :
                                            service.status === 'in-progress' ? 'قيد التنفيذ' : 'مكتمل'}
                                    </span>
                                    <div className="relative">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{service.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{service.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{service.estimatedTime}</span>
                                    </div>
                                    <div className="font-bold text-blue-600">
                                        {service.points} نقطة
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="عرض">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors" title="تعديل">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="حذف">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
