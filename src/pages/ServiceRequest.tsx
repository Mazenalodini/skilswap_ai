import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, Calendar, Zap,
  Plus, X, Sparkles, AlertCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { ServiceRequest } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../lib/ai';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { createServiceRequest, categories, skills, loading } = useData();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillNeeded: '',
    budget: 100,
    deadline: '',
    requirements: [''],
    attachments: []
  });

  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ qualityScore: number; strengths: string[]; weaknesses: string[]; improvementTips: string[] } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleAIAnalysis = async () => {
    if (!formData.title || !formData.description) {
      toast.error('أدخل العنوان والوصف أولاً لتحليل الجودة');
      return;
    }

    setAnalyzing(true);
    try {
      const feedback = await aiService.evaluateService({
        title: formData.title,
        description: formData.description,
        // Pass just the count or basic info safely
        budget: formData.budget
      });
      setAiFeedback(feedback);
      setShowFeedbackModal(true);
    } catch (error) {
      toast.error('فشل التحليل الذكي');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      if (formData.budget < 50) {
        toast.error('الحد الأدنى للميزانية هو 50 نقطة');
        return;
      }

      if ((user.points || 0) < formData.budget) {
        toast.error('ليس لديك نقاط كافية لهذا الطلب');
        return;
      }

      const requestData = {
        ...formData,
        clientId: user.id,
        clientName: user.name,
        status: 'open' as const,
        requirements: formData.requirements.filter(req => req.trim() !== '')
      };

      await createServiceRequest(requestData);
      toast.success('تم إنشاء طلب الخدمة بنجاح!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* AI Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && aiFeedback && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  تقرير الجودة الذكي
                </h3>
                <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                    <circle
                      cx="48" cy="48" r="40"
                      stroke={aiFeedback.qualityScore > 80 ? '#22c55e' : aiFeedback.qualityScore > 50 ? '#eab308' : '#ef4444'}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={251}
                      strokeDashoffset={251 - (251 * aiFeedback.qualityScore) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
                    {aiFeedback.qualityScore}%
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
                {aiFeedback.strengths.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-700 text-sm mb-2">نقاط القوة:</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      {aiFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {aiFeedback.weaknesses.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-700 text-sm mb-2">نقاط الضعف:</h4>
                    <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                      {aiFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
                {aiFeedback.improvementTips.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">نصائح للتحسين:</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      {aiFeedback.improvementTips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowFeedbackModal(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                فهمت، سأقوم بالتعديل
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">طلب خدمة جديدة</h1>
        <p className="text-gray-600">
          اطلب الخدمة التي تحتاجها من مقدمي الخدمات المتخصصين
        </p>
      </div>

      {/* User Points Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <div>
            <div className="font-semibold text-blue-900">نقاطك الحالية: {user?.points || 0}</div>
            <div className="text-sm text-blue-600">تأكد من أن لديك نقاط كافية لطلب الخدمة</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-900">معلومات أساسية</h2>
              <button
                type="button"
                onClick={handleAIAnalysis}
                disabled={analyzing}
                className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                {analyzing ? (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>تحليل الجودة بالذكاء الاصطناعي</span>
              </button>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الطلب *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: تصميم شعار احترافي لشركتي"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                وصف تفصيلي للخدمة المطلوبة *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="اشرح بالتفصيل ما تحتاجه، المواصفات المطلوبة، والنتيجة المتوقعة..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="skillNeeded" className="block text-sm font-medium text-gray-700 mb-2">
                  المهارة المطلوبة *
                </label>
                <select
                  id="skillNeeded"
                  name="skillNeeded"
                  required
                  value={formData.skillNeeded}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر المهارة</option>
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Budget and Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">الميزانية والجدول الزمني</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  الميزانية (بالنقاط) *
                </label>
                <div className="relative">
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    min="50"
                    max={user?.points || 1000}
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Zap className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">الحد الأدنى: 50 نقطة</p>
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  الموعد النهائي المطلوب
                </label>
                <div className="relative">
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">المتطلبات والتفاصيل</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                متطلبات إضافية
              </label>
              <div className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`متطلب ${index + 1}`}
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة متطلب آخر</span>
                </button>
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">المرفقات (اختياري)</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">رفع الملفات</h3>
              <p className="text-gray-600 mb-4">
                يمكنك رفع ملفات مرجعية، صور، أو أي مواد تساعد في توضيح طلبك
              </p>
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                اختر الملفات
              </button>
              <p className="text-xs text-gray-500 mt-2">
                الحد الأقصى: 10 ملفات، 5MB لكل ملف
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-600">
              <p>سيتم خصم {formData.budget} نقطة عند قبول العرض</p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>نشر الطلب</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}