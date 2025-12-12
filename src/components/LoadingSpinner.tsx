import React from 'react';
import { Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  showSkipButton?: boolean;
  onSkip?: () => void;
}

export default function LoadingSpinner({ 
  message = 'جاري التحميل...'
}: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full animate-spin"></div>
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">SkillSwap AI</h2>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}