import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Bell, User, LogOut, Settings, Zap, MessageCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id);

  const handleNotificationClick = (notification: any) => {
    if (markNotificationAsRead) {
      markNotificationAsRead(notification.id);
    }
    setIsNotificationOpen(false);
    if (notification.actionUrl) {
      // Navigate to action URL
    }
  };

  const formatNotificationTime = (timestamp: string) => {
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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">SkillSwap</span>
              <span className="text-sm text-blue-600 block leading-none">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/services"
              className={`text-sm font-medium transition-colors ${isActive('/services') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              الخدمات
            </Link>
            {user && (
              <>
                <Link
                  to="/learning"
                  className={`text-sm font-medium transition-colors ${isActive('/learning') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                >
                  التعلم
                </Link>
                <Link
                  to="/community"
                  className={`text-sm font-medium transition-colors ${isActive('/community') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                >
                  المجتمع
                </Link>
                <Link
                  to="/browse-requests"
                  className={`text-sm font-medium transition-colors ${isActive('/browse-requests') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                >
                  تصفح الطلبات
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">{user.points.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">نقطة</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
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
                                      {formatNotificationTime(notification.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="p-3 border-t">
                        <Link
                          to="/notifications"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => setIsNotificationOpen(false)}
                        >
                          عرض جميع الإشعارات
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={user.avatar_url || 'https://via.placeholder.com/150'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        to="/messages"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>الرسائل</span>
                      </Link>
                      <Link
                        to="/disputes"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>النزاعات</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/services"
              className="block text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              الخدمات
            </Link>
            {user && (
              <>
                <Link
                  to="/learning"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  التعلم
                </Link>
                <Link
                  to="/community"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  المجتمع
                </Link>
                <Link
                  to="/browse-requests"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تصفح الطلبات
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
              </>
            )}
            {!user && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block text-center py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}