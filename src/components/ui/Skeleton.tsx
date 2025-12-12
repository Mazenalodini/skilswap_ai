import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );
};

export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 animate-pulse" />

            {/* Title Skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />

            {/* Description Skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>

            {/* Footer Skeleton */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
        </div>
    );
};

export const DetailSkeleton: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 animate-pulse" />
                        <div className="flex gap-4 mb-8">
                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                        </div>
                        <div className="w-full h-96 bg-gray-200 rounded-xl mb-8 animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6 animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                            <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProfileSkeleton: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white animate-pulse" />
                        <div className="flex space-x-3">
                            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                        <div className="flex space-x-4 pt-4">
                            <div className="h-16 w-24 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-16 w-24 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="h-16 w-24 bg-gray-200 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="border-b px-6 py-4 flex space-x-8">
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="p-6 space-y-6">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
            </div>
        </div>
    );
};
