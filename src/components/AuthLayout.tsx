import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-900 flex relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-blue-900/80"></div>
            </div>

            {/* Animated Blobs */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 md:p-8">

                {/* Left Side - Content */}
                <div className="hidden md:flex flex-col justify-center w-1/2 pr-12 text-white space-y-8">
                    <Link to="/" className="flex items-center space-x-3 group w-fit">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="text-3xl font-bold tracking-tight">SkillSwap</span>
                            <span className="text-xl text-blue-400 block leading-none font-medium">AI Platform</span>
                        </div>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            ابدأ رحلتك المهنية <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                بذكاء واحترافية
                            </span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                            انضم إلى مجتمع النخبة من المحترفين. قيم مهاراتك، تبادل الخدمات، وارتقِ بمستواك المهني باستخدام أحدث تقنيات الذكاء الاصطناعي.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-teal-400" />
                            <span>مجتمع موثوق وآمن 100%</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-teal-400" />
                            <span>تقييم مهارات مدعوم بالذكاء الاصطناعي</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-teal-400" />
                            <span>فرص عمل ومشاريع حقيقية</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 max-w-md">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8">
                            <div className="text-center mb-8 md:hidden">
                                <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold text-white">SkillSwap AI</span>
                                </Link>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                                <p className="text-gray-400">{subtitle}</p>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
