import React, { useState } from 'react';
import {
  AlertTriangle, Clock, CheckCircle, XCircle, FileText,
  MessageCircle, Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

export default function Disputes() {
  const { user } = useAuth();
  const { disputes, createDispute, services } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  const userDisputes = disputes.filter(d =>
    d.clientId === user?.id || d.providerId === user?.id
  );

  const filteredDisputes = userDisputes.filter(dispute => {
    if (activeTab === 'all') return true;
    return dispute.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'orange';
      case 'in-review': return 'blue';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'in-review': return 'قيد المراجعة';
      case 'resolved': return 'محلول';
      case 'closed': return 'مغلق';
      default: return status;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisputeAdvice = (reason: string) => {
    switch (reason) {
      case 'quality':
        return 'نصيحة الذكاء الاصطناعي: تأكد من إرفاق صور أو أمثلة توضح الفرق بين المتفق عليه والنتيجة المستلمة.';
      case 'delay':
        return 'نصيحة الذكاء الاصطناعي: راجع شروط التسليم في العقد وتأكد من توثيق جميع المراسلات المتعلقة بالتأخير.';
      case 'no-delivery':
        return 'نصيحة الذكاء الاصطناعي: إذا لم تستلم أي شيء، تأكد من عدم تأكيد الاستلام في النظام حتى يتم حل النزاع.';
      case 'communication':
        return 'نصيحة الذكاء الاصطناعي: حافظ على لغة احترافية في جميع المراسلات، وتجنب الانفعال لضمان حقك.';
      case 'requirements':
        return 'نصيحة الذكاء الاصطناعي: قم بإعداد قائمة بالمتطلبات المفقودة ومقارنتها بوصف الخدمة الأصلي.';
      default:
        return 'نصيحة الذكاء الاصطناعي: قدم وصفاً دقيقاً وموضوعياً للمشكلة لضمان سرعة الحل.';
    }
  };

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !disputeReason || !disputeDescription) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }



    createDispute(selectedService, disputeReason, disputeDescription);

    setIsCreateModalOpen(false);
    setSelectedService('');
    setDisputeReason('');
    setDisputeDescription('');
    toast.success('تم إنشاء النزاع بنجاح. سيتم مراجعته من قبل فريق الدعم خلال 24 ساعة.');
  };

  const userServices = services.filter(s => s.providerId === user?.id || s.status === 'completed');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مركز النزاعات</h1>
            <p className="text-gray-600 mt-1">إدارة ومتابعة النزاعات والشكاوى</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء نزاع</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userDisputes.filter(d => d.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600">نزاعات مفتوحة</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userDisputes.filter(d => d.status === 'in-review').length}
                </div>
                <div className="text-sm text-gray-600">قيد المراجعة</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userDisputes.filter(d => d.status === 'resolved').length}
                </div>
                <div className="text-sm text-gray-600">محلولة</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userDisputes.filter(d => d.status === 'closed').length}
                </div>
                <div className="text-sm text-gray-600">مغلقة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
        <div className="flex border-b">
          {[
            { id: 'all', label: 'جميع النزاعات', count: userDisputes.length },
            { id: 'open', label: 'مفتوحة', count: userDisputes.filter(d => d.status === 'open').length },
            { id: 'in-review', label: 'قيد المراجعة', count: userDisputes.filter(d => d.status === 'in-review').length },
            { id: 'resolved', label: 'محلولة', count: userDisputes.filter(d => d.status === 'resolved').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-red-50 text-red-700 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-6">
        {filteredDisputes.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نزاعات</h3>
            <p className="text-gray-600">
              {activeTab === 'all' ? 'لم تقم بإنشاء أي نزاعات بعد' : `لا توجد نزاعات ${getStatusLabel(activeTab)}`}
            </p>
          </div>
        ) : (
          filteredDisputes.map((dispute) => {
            const service = services.find(s => s.id === dispute.serviceId);
            const statusColor = getStatusColor(dispute.status);

            return (
              <div key={dispute.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        نزاع حول: {service?.title || 'خدمة محذوفة'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                        {getStatusLabel(dispute.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">السبب:</span>
                        <p className="text-gray-600">{dispute.reason}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">تاريخ الإنشاء:</span>
                        <p className="text-gray-600">{formatTime(dispute.created_at)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">الوصف:</span>
                      <p className="text-gray-600 mt-1">{dispute.description}</p>
                    </div>

                    {/* Timeline */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        {['open', 'in-review', 'resolved', 'closed'].map((step, index) => {
                          const steps = ['open', 'in-review', 'resolved', 'closed'];
                          const currentStepIndex = steps.indexOf(dispute.status);
                          const stepIndex = steps.indexOf(step);
                          const isCompleted = stepIndex <= currentStepIndex;
                          const isCurrent = stepIndex === currentStepIndex;

                          return (
                            <div key={step} className="flex flex-col items-center flex-1 relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                              </div>
                              <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-green-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                {getStatusLabel(step)}
                              </span>
                              {index < steps.length - 1 && (
                                <div className={`absolute top-4 left-0 w-full h-0.5 -ml-[50%] -z-0 ${stepIndex < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                                  }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {dispute.resolution && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <span className="text-sm font-medium text-green-800">القرار:</span>
                        <p className="text-green-700 mt-1">{dispute.resolution}</p>
                        {dispute.resolvedAt && (
                          <p className="text-green-600 text-sm mt-2">
                            تم الحل في: {formatTime(dispute.resolvedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>رقم النزاع: #{dispute.id}</span>
                    <span>•</span>
                    <span>الخدمة: #{dispute.serviceId}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>تواصل مع الدعم</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>عرض التفاصيل</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Dispute Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إنشاء نزاع جديد</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الخدمة المتنازع عليها
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">اختر الخدمة</option>
                    {userServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سبب النزاع
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">اختر السبب</option>
                    <option value="quality">جودة العمل غير مرضية</option>
                    <option value="delay">تأخير في التسليم</option>
                    <option value="no-delivery">عدم التسليم</option>
                    <option value="communication">مشاكل في التواصل</option>
                    <option value="requirements">عدم تطبيق المتطلبات</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                {disputeReason && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-800 text-sm mb-1">مستشار النزاعات الذكي</h4>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {getDisputeAdvice(disputeReason)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف المشكلة
                  </label>
                  <textarea
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="اشرح المشكلة بالتفصيل..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateDispute}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  إنشاء النزاع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}