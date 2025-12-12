import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCircle, AlertCircle, Award, MessageCircle,
  Calendar, Filter, MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, loading } = useData();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userNotifications = notifications.filter(n => n.userId === user?.id);

  const filteredNotifications = userNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    if (filter !== 'all') return notification.type === filter;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'service_request': return Calendar;
      case 'service_completed': return CheckCircle;
      case 'skill_verified': return Award;
      case 'badge_earned': return Award;
      case 'message': return MessageCircle;
      case 'dispute': return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'service_request': return 'blue';
      case 'service_completed': return 'green';
      case 'skill_verified': return 'purple';
      case 'badge_earned': return 'yellow';
      case 'message': return 'indigo';
      case 'dispute': return 'red';
      default: return 'gray';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'} `;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'} `;
    if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'} `;
    return 'الآن';
  };

  const navigate = useNavigate();

  const getActionUrl = (notification: any) => {
    if (notification.actionUrl && notification.actionUrl.includes('?')) {
      return notification.actionUrl;
    }

    switch (notification.type) {
      case 'service_request':
      case 'service_completed':
        return '/dashboard?tab=requests';
      case 'offer':
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

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }

    const url = getActionUrl(notification);
    if (url) {
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        navigate(url);
      }
    }
  };

  const handleMarkAllAsRead = () => {
    userNotifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              تحديد الكل كمقروء
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {[
              { id: 'all', label: 'الكل', count: userNotifications.length },
              { id: 'unread', label: 'غير مقروء', count: unreadCount },
              { id: 'service_request', label: 'طلبات الخدمة', count: userNotifications.filter(n => n.type === 'service_request').length },
              { id: 'service_completed', label: 'خدمات مكتملة', count: userNotifications.filter(n => n.type === 'service_completed').length },
              { id: 'skill_verified', label: 'مهارات مؤكدة', count: userNotifications.filter(n => n.type === 'skill_verified').length },
              { id: 'message', label: 'رسائل', count: userNotifications.filter(n => n.type === 'message').length }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`flex items - center space - x - 2 px - 3 py - 2 rounded - lg text - sm font - medium transition - colors whitespace - nowrap ${filter === filterOption.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  } `}
              >
                <span>{filterOption.label}</span>
                {filterOption.count > 0 && (
                  <span className={`text - xs px - 2 py - 1 rounded - full ${filter === filterOption.id
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                    } `}>
                    {filterOption.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'جميع الإشعارات مقروءة' : 'لا توجد إشعارات في هذه الفئة'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            const color = getNotificationColor(notification.type);

            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg - white rounded - lg shadow - sm border p - 6 cursor - pointer hover: shadow - md transition - all ${!notification.read ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''
                  } `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w - 12 h - 12 rounded - full bg - ${color} -100 flex items - center justify - center flex - shrink - 0`}>
                    <IconComponent className={`w - 6 h - 6 text - ${color} -600`} />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more actions
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.created_at)}
                      </span>

                      <div className="flex items-center space-x-2">
                        <span className={`text - xs px - 2 py - 1 rounded - full bg - ${color} -100 text - ${color} -800`}>
                          {notification.type === 'service_request' ? 'طلب خدمة' :
                            notification.type === 'service_completed' ? 'خدمة مكتملة' :
                              notification.type === 'skill_verified' ? 'مهارة مؤكدة' :
                                notification.type === 'badge_earned' ? 'شارة جديدة' :
                                  notification.type === 'message' ? 'رسالة' :
                                    notification.type === 'dispute' ? 'نزاع' : 'إشعار'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>


    </div>
  );
}