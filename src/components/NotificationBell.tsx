import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id);

  const navigate = useNavigate();

  const getActionUrl = (notification: any) => {
    // If we have a specific actionUrl that includes query params, use it
    if (notification.actionUrl && notification.actionUrl.includes('?')) {
      return notification.actionUrl;
    }

    // Otherwise, derive it from the type
    switch (notification.type) {
      case 'service_request':
      case 'service_completed':
        return '/dashboard?tab=requests';
      case 'offer':
        // We might need to extract requestId from message or other fields if not available
        // But ideally, new notifications will have the correct URL.
        // For old ones, just going to requests tab is safer than doing nothing.
        return '/dashboard?tab=requests';
      case 'message':
        return '/messages';
      case 'dispute':
        return '/disputes';
      case 'skill_verified':
      case 'badge_earned':
        return '/profile';
      default:
        return notification.actionUrl || '/dashboard';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    setIsOpen(false);

    const url = getActionUrl(notification);
    if (url) {
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        navigate(url);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    return 'الآن';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">الإشعارات</h3>
          </div>
          {notifications.filter(n => n.userId === user?.id).length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              لا توجد إشعارات
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications
                .filter(n => n.userId === user?.id)
                .slice(0, 10)
                .map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                      }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-600' : 'bg-gray-300'
                        }`}></div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}