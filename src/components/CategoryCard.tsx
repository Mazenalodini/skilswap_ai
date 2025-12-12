import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
    title: string;
    icon: LucideIcon;
    count: string;
    color: string;
    slug: string;
}

export default function CategoryCard({ title, icon: Icon, count, color, slug }: CategoryCardProps) {
    return (
        <Link
            to={`/services?category=${slug}`}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

            <div className="relative z-10">
                <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                    {count} خدمة
                </p>

                <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span>تصفح</span>
                    <ArrowRight className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
