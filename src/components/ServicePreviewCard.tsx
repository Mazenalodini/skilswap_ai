import { Link } from 'react-router-dom';
import { Star, Heart, User } from 'lucide-react';

interface ServicePreviewCardProps {
    id: string;
    title: string;
    providerName: string;
    providerAvatar?: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
}

export default function ServicePreviewCard({
    id,
    title,
    providerName,
    providerAvatar,
    price,
    rating,
    reviews,
    image,
    category
}: ServicePreviewCardProps) {
    return (
        <Link
            to={`/services/${id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {category}
                </div>
                <button className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 mb-3">
                    {providerAvatar ? (
                        <img src={providerAvatar} alt={providerName} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-500" />
                        </div>
                    )}
                    <span className="text-sm text-gray-600 truncate">{providerName}</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">{rating}</span>
                    <span className="text-gray-500 text-sm">({reviews})</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">يبدأ من</div>
                    <div className="font-bold text-lg text-blue-600">
                        {price} <span className="text-sm font-normal text-gray-500">ريال</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
