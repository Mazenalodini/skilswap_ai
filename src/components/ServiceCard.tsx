import { Star, Clock, Zap, MessageCircle, Heart, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    skillRequired: string;
    skillLevel: string;
    points: number;
    estimatedTime: string;
    providerId?: string;
    providerName?: string;
    providerAvatar?: string;
    rating?: number;
    tags: string[];
    portfolio: string[];
    reviews?: number;
    status?: string;
    requirements?: string[];
    created_at?: string;
    updated_at?: string;
  };
  onRequest: (serviceId: string) => void;
  onContact: (providerId: string, serviceName: string) => void;
  onSave?: (serviceId: string) => void;
  onShare?: (serviceId: string) => void;
}

export default function ServiceCard({
  service,
  onRequest,
  onContact,
  onSave,
  onShare
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Service Image/Portfolio */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Link to={`/services/${service.id}`} className="block h-full">
          {service.portfolio.length > 0 ? (
            <img
              src={service.portfolio[0]}
              alt={service.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
              <Zap className="w-12 h-12 opacity-20" />
            </div>
          )}
        </Link>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {service.category}
          </span>
        </div>

        {/* Action Buttons (Save/Share) */}
        <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onShare && (
            <button
              onClick={(e) => { e.preventDefault(); onShare(service.id); }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-blue-600 hover:bg-white shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          {onSave && (
            <button
              onClick={(e) => { e.preventDefault(); onSave(service.id); }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-600 hover:bg-white shadow-sm transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Provider Info */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={service.providerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.providerName || 'User')}&background=random`}
            alt={service.providerName}
            loading="lazy"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="flex-grow min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {service.providerName || 'مستخدم مجهول'}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-gray-700">
                {(service.rating || 0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({service.reviews || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          <Link to={`/services/${service.id}`}>
            {service.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
          {service.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${service.skillLevel === 'beginner' ? 'bg-green-50 text-green-700 border border-green-100' :
            service.skillLevel === 'intermediate' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
              service.skillLevel === 'advanced' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                'bg-red-50 text-red-700 border border-red-100'
            }`}>
            {service.skillLevel === 'beginner' ? 'مبتدئ' :
              service.skillLevel === 'intermediate' ? 'متوسط' :
                service.skillLevel === 'advanced' ? 'متقدم' : 'خبير'}
          </span>
          {service.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 text-gray-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">يبدأ من</span>
              <span className="text-lg font-bold text-blue-600">{service.points}</span>
              <span className="text-xs font-medium text-blue-600">نقطة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onContact(service.providerId || '', service.title)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="تواصل مع البائع"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => onRequest(service.id)}
              className="flex-grow bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all flex items-center justify-center group/btn"
            >
              <span>طلب الخدمة</span>
              <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}