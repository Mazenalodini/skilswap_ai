import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Search, Send } from 'lucide-react';
import RealTimeChat from '../components/RealTimeChat';

export default function Messages() {
  const { user } = useAuth();
  const { users, messages, loading } = useData();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');

  interface Conversation {
    id: string;
    participants: string[];
    lastMessage?: any;
    unreadCount: number;
  }

  // Get conversations for current user
  const conversations = React.useMemo(() => {
    if (!user) return [];

    const userConversations = new Map<string, Conversation>();

    messages.forEach(message => {
      const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
      const conversationId = [user.id, otherUserId].sort().join('-');

      if (!userConversations.has(conversationId)) {
        userConversations.set(conversationId, {
          id: conversationId,
          participants: [user.id, otherUserId],
          unreadCount: 0
        });
      }

      const conversation = userConversations.get(conversationId)!;

      if (!conversation.lastMessage || new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message;
      }

      if (message.receiverId === user.id && !message.read) {
        conversation.unreadCount++;
      }
    });

    return Array.from(userConversations.values()).sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
    });
  }, [messages, user]);

  // Get other user in conversation
  const getOtherUser = (conversation: Conversation) => {
    if (!user) return null;
    const otherUserId = conversation.participants.find(id => id !== user.id);
    return users.find(u => u.id === otherUserId);
  };

  // Handle URL params for auto-selection
  useEffect(() => {
    if (userIdParam && user) {
      const conversationId = [user.id, userIdParam].sort().join('-');
      setSelectedConversation(conversationId);
    }
  }, [userIdParam, user]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && user) {
      // In demo mode, we don't need to mark messages as read
    }
  }, [selectedConversation, user, messages]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation => {
    const otherUser = getOtherUser(conversation);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600">يرجى تسجيل الدخول لعرض الرسائل</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900 mb-4">الرسائل</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث في المحادثات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    لا توجد محادثات
                  </div>
                ) : (
                  filteredConversations.map(conversation => {
                    const otherUser = getOtherUser(conversation);
                    if (!otherUser) return null;

                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-indigo-50 border-r-4 border-r-indigo-500' : ''
                          }`}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="relative">
                            <img
                              src={otherUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=6366f1&color=fff`}
                              alt={otherUser.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {otherUser.name}
                              </h3>
                              {conversation.lastMessage && (
                                <span className="text-xs text-gray-500">
                                  {new Date(conversation.lastMessage.created_at).toLocaleTimeString('ar-SA', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage?.content || 'لا توجد رسائل'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                (() => {
                  const conversation = conversations.find(c => c.id === selectedConversation);
                  const otherUser = conversation ? getOtherUser(conversation) : null;

                  if (!otherUser) return null;

                  return (
                    <div className="h-full">
                      <RealTimeChat
                        conversationId={otherUser.id}
                        participantName={otherUser.name}
                        participantAvatar={otherUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=6366f1&color=fff`}
                        isOnline={otherUser.status === 'online'}
                      />
                    </div>
                  );
                })()
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">اختر محادثة</h3>
                    <p className="text-gray-500">اختر محادثة من القائمة لبدء المراسلة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}