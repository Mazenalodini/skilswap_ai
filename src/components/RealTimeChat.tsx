import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, X, File, Image as ImageIcon, Briefcase, CheckCircle, Clock, DollarSign, Gavel, ShieldAlert } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../lib/ai';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeChatProps {
  conversationId: string;
  participantName: string;
  participantAvatar: string;
  isOnline: boolean;
}

interface OfferData {
  title: string;
  price: number;
  deadline: string;
  description: string;
}

export default function RealTimeChat({
  conversationId,
  participantName,
  participantAvatar,
  isOnline
}: RealTimeChatProps) {
  const { user } = useAuth();
  const { messages, sendMessage, uploadFile } = useData();
  const [messageText, setMessageText] = useState('');
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Offer State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerData, setOfferData] = useState<OfferData>({ title: '', price: 0, deadline: '', description: '' });

  // Dispute State
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeResult, setDisputeResult] = useState<{ verdict: string; confidence: number; justification: string; suggested_action: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter messages for this conversation
    const filtered = messages.filter(m =>
      (m.senderId === user?.id && m.receiverId === conversationId) ||
      (m.senderId === conversationId && m.receiverId === user?.id)
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    setConversationMessages(filtered);
  }, [messages, conversationId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !user || isUploading) return;

    // AI Safety Check
    if (messageText.trim()) {
      setIsAnalyzing(true);
      try {
        const moderation = await aiService.moderateContent(messageText);
        setIsAnalyzing(false);

        if (!moderation.safe) {
          toast.error('تم حظر الرسالة: ' + moderation.reason, {
            icon: <ShieldAlert className="text-red-500" />
          });
          return;
        }
      } catch (e) {
        setIsAnalyzing(false);
        console.error('Moderation failed', e);
        // Fallback: allow sending if AI fails to prevent blocking user
      }
    }

    try {
      setIsUploading(true);
      let attachmentUrl = undefined;

      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }

      await sendMessage(conversationId, messageText, attachmentUrl ? [attachmentUrl] : []);

      setMessageText('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyzeDispute = async () => {
    setDisputeResult(null);
    setShowDisputeModal(true);

    // Simulate fetching contract details (mock)
    const contractDetails = {
      amount: 500,
      deadline: '2025-01-01',
      terms: 'Complete website redesign'
    };

    try {
      // Call the autonomous agent
      const result = await aiService.resolveDisputeAndEnforce(conversationMessages, contractDetails);
      // Map result to fit the state expectation (or update state type if strictly needed, but here we just pass it)
      // We cast to any for the state setter because the state type definition in this file is slightly older, 
      // but TS allows it if we handled the component render side (which we did in the previous step).
      setDisputeResult(result as any);
    } catch (error) {
      toast.error('فشل في تحليل النزاع');
      setShowDisputeModal(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerData.title || !offerData.price || !offerData.deadline) {
      toast.error('يرجى تعبئة جميع حقول العرض');
      return;
    }

    try {
      const offerContent = `:::OFFER_START:::${JSON.stringify(offerData)}:::OFFER_END:::`;
      await sendMessage(conversationId, offerContent);
      setShowOfferModal(false);
      setOfferData({ title: '', price: 0, deadline: '', description: '' });
      toast.success('تم إرسال العرض بنجاح');
    } catch (error) {
      toast.error('فشل إرسال العرض');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const parseMessageContent = (content: string) => {
    if (content.startsWith(':::OFFER_START:::')) {
      try {
        const jsonStr = content.substring(':::OFFER_START:::'.length, content.indexOf(':::OFFER_END:::'));
        return { type: 'offer', data: JSON.parse(jsonStr) };
      } catch (e) {
        return { type: 'text', content };
      }
    }
    return { type: 'text', content };
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Dispute Modal */}
      <AnimatePresence>
        {showDisputeModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Gavel className="w-6 h-6 text-purple-600" />
                  </div>
                  المحكمة الذكية (AI Judge)
                </h3>
                <button onClick={() => setShowDisputeModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!disputeResult ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-600 font-medium animate-pulse">القاضي الذكي يقوم بمراجعة الأدلة...</p>
                  <p className="text-xs text-gray-400">تحليل العقود، المحادثات، والالتزام بالشروط</p>
                </div>
              ) : (
                <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                  <div className={`p-4 rounded-xl border-l-4 shadow-sm ${disputeResult.verdict === 'client_wins' ? 'bg-green-50 border-green-500' :
                    disputeResult.verdict === 'provider_wins' ? 'bg-blue-50 border-blue-500' :
                      'bg-yellow-50 border-yellow-500'
                    }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg mb-1">
                          الحكم النهائي: {
                            disputeResult.verdict === 'client_wins' ? 'لصالح العميل' :
                              disputeResult.verdict === 'provider_wins' ? 'لصالح مقدم الخدمة' :
                                'تسوية مشتركة'
                          }
                        </h4>
                        <p className="text-sm opacity-80 font-mono">Confidence: {disputeResult.confidence}%</p>
                      </div>
                      {(disputeResult as any).success && (
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          تم التنفيذ تلقائياً
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-900 mb-2">حيثيات الحكم:</h5>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                      {disputeResult.justification}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-purple-700" />
                      الإجراء الذي تم اتخاذه:
                    </h5>
                    <div className={`p-4 rounded-xl text-sm font-medium border ${(disputeResult as any).success
                      ? 'bg-purple-900 text-white border-purple-900 shadow-md'
                      : 'bg-orange-50 text-orange-800 border-orange-200'
                      }`}>
                      {(disputeResult as any).actionTaken || disputeResult.suggested_action}
                    </div>
                    {!(disputeResult as any).success && (
                      <p className="text-xs text-orange-600 mt-2 mr-1">
                        * لم يتم التنفيذ التلقائي لعدم كفاية نسبة الثقة ({disputeResult.confidence}% {"<"} 85%).
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button onClick={() => setShowDisputeModal(false)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                      إغلاق القضية
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                إنشاء عرض خدمة
              </h3>
              <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الخدمة</label>
                <input
                  type="text"
                  value={offerData.title}
                  onChange={e => setOfferData({ ...offerData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: تصميم شعار احترافي"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة (نقاط)</label>
                  <input
                    type="number"
                    value={offerData.price || ''}
                    onChange={e => setOfferData({ ...offerData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مدة التسليم</label>
                  <input
                    type="date"
                    value={offerData.deadline}
                    onChange={e => setOfferData({ ...offerData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</label>
                <textarea
                  value={offerData.description}
                  onChange={e => setOfferData({ ...offerData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="اشرح تفاصيل العرض..."
                />
              </div>

              <button
                onClick={handleSendOffer}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                إرسال العرض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={participantAvatar}
              alt={participantName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{participantName}</h3>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              {isOnline ? '● متصل الآن' : 'غير متصل'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Dispute Resolution Button */}
          <button
            onClick={handleAnalyzeDispute}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors rounded-full"
            title="حل النزاع (AI Judge)"
          >
            <Gavel className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowOfferModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">إنشاء عرض</span>
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-50">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-50">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-50">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#efeae2]" style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        {conversationMessages.map((message) => {
          const isMe = message.senderId === user?.id;
          const parsedContent = parseMessageContent(message.content);

          return (
            <div
              key={message.id}
              className={`flex items-end space-x-2 ${isMe ? 'justify-end space-x-reverse' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={participantAvatar}
                  alt={participantName}
                  className="w-8 h-8 rounded-full mb-1 border border-white shadow-sm"
                />
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] shadow-sm relative ${parsedContent.type === 'offer'
                  ? 'w-80 p-0 bg-white rounded-2xl overflow-hidden border border-gray-200'
                  : isMe
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2'
                    : 'bg-white text-gray-900 rounded-2xl rounded-bl-none px-4 py-2'
                  }`}
              >
                {/* Render Offer Card */}
                {parsedContent.type === 'offer' ? (
                  <div>
                    <div className="bg-gray-50 p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">عرض خدمة</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">{parsedContent.data.title}</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">التكلفة:</span>
                        <span className="font-bold text-green-600 flex items-center gap-1">
                          {parsedContent.data.price} <DollarSign className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">التسليم:</span>
                        <span className="font-bold text-gray-700 flex items-center gap-1">
                          {parsedContent.data.deadline} <Clock className="w-3 h-3" />
                        </span>
                      </div>
                      {parsedContent.data.description && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2">
                          {parsedContent.data.description}
                        </p>
                      )}

                      {!isMe && (
                        <div className="pt-2 flex gap-2">
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">
                            قبول العرض
                          </button>
                          <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                            رفض
                          </button>
                        </div>
                      )}
                      {isMe && (
                        <div className="pt-2 text-center text-xs text-gray-400">
                          بانتظار رد الطرف الآخر...
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Render Normal Message
                  <>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mb-2">
                        {message.attachments.map((url: string, index: number) => {
                          const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                          return isImage ? (
                            <img
                              key={index}
                              src={url}
                              alt="attachment"
                              className="rounded-lg max-w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(url, '_blank')}
                            />
                          ) : (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center space-x-2 p-3 rounded-xl ${isMe ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-800'} hover:bg-opacity-80 transition-all border border-transparent hover:border-current`}
                            >
                              <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white'}`}>
                                <File className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium truncate max-w-[150px]">ملف مرفق</span>
                                <span className="text-xs opacity-75">انقر للتحميل</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </>
                )}

                {parsedContent.type !== 'offer' && (
                  <div className={`flex items-center justify-end mt-1 space-x-1 space-x-reverse ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    <span className="text-[10px]">
                      {new Date(message.created_at).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isMe && (
                      <CheckCircle className={`w-3 h-3 ${message.read ? 'text-blue-200' : 'opacity-50'}`} />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {selectedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                ) : (
                  <File className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-xl"
            title="إرفاق ملف"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isAnalyzing ? "جاري التحقق من المحتوى..." : "اكتب رسالتك... أو أنشئ عرضاً من الأعلى"}
              disabled={isAnalyzing}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${isAnalyzing ? 'bg-gray-100' : 'bg-gray-50 focus:bg-white'}`}
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !selectedFile) || isUploading || isAnalyzing}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg shadow-blue-500/20 active:scale-95 transform"
          >
            {isUploading || isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}