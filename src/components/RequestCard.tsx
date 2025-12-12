import { Clock, DollarSign, Calendar, ArrowRight, User } from 'lucide-react';

interface RequestCardProps {
    request: {
        id: string;
        title: string;
        description: string;
        category: string;
        budget: number;
        deadline?: string;
        clientId: string;
        clientName?: string;
        clientAvatar?: string;
        status: string;
        created_at: string;
    };
    onOffer: (request: any) => void;
}

export default function RequestCard({ request, onOffer }: RequestCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
            <div className="p-6 flex flex-col flex-grow">
                {/* Header: Category & Date */}
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                        {request.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 ml-1" />
                        {new Date(request.created_at).toLocaleDateString('ar-SA')}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {request.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {request.description}
                </p>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                            <DollarSign className="w-3.5 h-3.5 ml-1" />
                            <span>الميزانية</span>
                        </div>
                        <div className="font-bold text-gray-900 text-lg">
                            {request.budget} <span className="text-xs font-normal text-gray-500">نقطة</span>
                        </div>
                    </div>
                    {request.deadline && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center text-gray-500 text-xs mb-1">
                                <Calendar className="w-3.5 h-3.5 ml-1" />
                                <span>الموعد النهائي</span>
                            </div>
                            <div className="font-bold text-gray-900 text-sm mt-1">
                                {request.deadline}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer: Client Info & Action */}
                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            {request.clientAvatar ? (
                                <img src={request.clientAvatar} alt={request.clientName} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">العميل</span>
                            <span className="text-sm font-semibold text-gray-900 max-w-[100px] truncate">
                                {request.clientName || 'مستخدم'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onOffer(request)}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all flex items-center group/btn shadow-sm hover:shadow-md"
                    >
                        <span>تقديم عرض</span>
                        <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
