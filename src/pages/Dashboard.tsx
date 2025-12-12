import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, MessageCircle } from 'lucide-react';

// Components
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import DashboardRequests from '../components/dashboard/DashboardRequests';
import DashboardServices from '../components/dashboard/DashboardServices';
import ProviderAnalytics from '../components/dashboard/ProviderAnalytics';
import DashboardLearning from '../components/dashboard/DashboardLearning';

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, messages } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  // Handle deep linking and tab synchronization
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userMessages = messages.filter(m => m.receiverId === user.id && !m.read);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'requests':
        return <DashboardRequests />;
      case 'services':
        return <DashboardServices />;
      case 'learning':
        return <DashboardLearning />;
      case 'analytics':
        return <ProviderAnalytics />;
      case 'messages':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">الرسائل</h2>
              <Link to="/messages" className="text-blue-600 hover:text-blue-700 font-medium">
                عرض الكل &larr;
              </Link>
            </div>
            {userMessages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">لا توجد رسائل جديدة</h3>
                <p className="text-gray-500">صندوق الوارد الخاص بك فارغ حالياً</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {userMessages.map(msg => (
                  <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">رسالة جديدة</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{msg.content}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
}