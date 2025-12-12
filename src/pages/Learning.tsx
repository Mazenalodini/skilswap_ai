import React, { useState } from 'react';
import { BookOpen, Play, FileText, Award, Clock, Users, Star, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

export default function Learning() {
  const { learningPaths, userLearningProgress, enrollInLearningPath, completeModule } = useData();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Merge progress data with paths
  const enrichedPaths = learningPaths.map(path => {
    const progress = userLearningProgress.find(p => p.learning_path_id === path.id);
    return {
      ...path,
      enrolled: !!progress,
      completionRate: progress?.completion_rate || 0,
      modules: path.modules.map(m => ({
        ...m,
        completed: progress?.completed_modules?.includes(m.id) || false
      }))
    };
  });

  const selectedLearningPath = selectedPath ? enrichedPaths.find(path => path.id === selectedPath) : null;
  const displayPaths = enrichedPaths;

  // Auto-select first module if enrolled and none selected
  React.useEffect(() => {
    if (selectedLearningPath?.enrolled && !activeModuleId && selectedLearningPath.modules.length > 0) {
      // Find first uncompleted module or just the first one
      const firstUncompleted = selectedLearningPath.modules.find(m => !m.completed);
      setActiveModuleId(firstUncompleted?.id || selectedLearningPath.modules[0].id);
    }
  }, [selectedLearningPath, activeModuleId]);

  const activeModule = selectedLearningPath?.modules.find(m => m.id === activeModuleId);



  // Helper functions
  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'article': return FileText;
      case 'project': return Award;
      case 'quiz': return CheckCircle;
      default: return BookOpen;
    }
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case 'video': return 'blue';
      case 'article': return 'green';
      case 'project': return 'purple';
      case 'quiz': return 'orange';
      default: return 'gray';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const handleEnroll = (pathId: string) => {
    enrollInLearningPath(pathId)
      .then(() => {
        toast.success('تم التسجيل في المسار بنجاح! يمكنك البدء في التعلم الآن.');
      })
      .catch((error) => {
        toast.error('حدث خطأ أثناء التسجيل في المسار');
      });
  };

  const handleCompleteModule = (pathId: string, moduleId: string) => {
    completeModule(pathId, moduleId)
      .then(() => {
        const path = learningPaths.find(p => p.id === pathId);
        if (path) {
          const completedModules = path.modules.filter(m => m.completed).length + 1;

          if (completedModules === path.modules.length) {
            toast.success('تهانينا! لقد أكملت المسار التعليمي وحصلت على شارة جديدة!');
          } else {
            toast.success('تم إكمال الوحدة بنجاح! +10 نقاط');
          }
        }
      })
      .catch((error) => {
        toast.error('حدث خطأ أثناء إكمال الوحدة');
      });
  };

  const handleDownloadCertificate = (pathTitle: string) => {
    toast.loading('جاري إصدار الشهادة...');
    setTimeout(() => {
      toast.dismiss();
      toast.success(`تم تحميل شهادة "${pathTitle}" بنجاح!`);
    }, 2000);
  };

  if (selectedLearningPath) {
    if (selectedLearningPath.enrolled) {
      // ENROLLED VIEW (Video Player + Sidebar)
      return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
          {/* Main Content Area (Player) */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <button
              onClick={() => setSelectedPath(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>العودة للمسارات</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
              {/* Video Player */}
              {/* Video Player */}
              <div className="aspect-video bg-black w-full relative group">
                {(activeModule?.type === 'video' || activeModule?.type === 'project') && (activeModule as any).video_url ? (
                  <>
                    <iframe
                      key={activeModule.id} // Force re-render on change
                      src={`${(activeModule as any).video_url}?autoplay=0&controls=1&loading=lazy&rel=0`}
                      title={activeModule.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />

                    {/* Controls & Help Overlay */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                      <a
                        href={(activeModule as any).video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/80 text-white px-4 py-2 rounded-full text-xs hover:bg-red-600 transition-colors flex items-center gap-2 backdrop-blur-sm shadow-lg"
                      >
                        <Play className="w-3 h-3" />
                        <span>فتح في YouTube</span>
                      </a>
                    </div>

                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs text-center">
                        إذا لم يعمل الفيديو، انقر على زر "فتح في YouTube" في الأعلى
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center bg-gray-900">
                    {getModuleIcon(activeModule?.type || 'article') && React.createElement(getModuleIcon(activeModule?.type || 'article'), { className: "w-16 h-16 mb-4 opacity-50" })}
                    <h3 className="text-xl font-bold">{activeModule?.title || 'اختر وحدة للبدء'}</h3>
                    <p className="text-gray-400 mt-2">
                      {(activeModule as any)?.resource_url ? (
                        <a href={(activeModule as any).resource_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          انقر هنا لفتح الموارد التعليمية
                        </a>
                      ) : 'هذا المحتوى نصي أو تفاعلي'}
                    </p>
                  </div>
                )}
              </div>

              {/* Content Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeModule?.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeModule?.duration}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {activeModule?.type === 'video' ? 'فيديو' : activeModule?.type === 'project' ? 'مشروع' : activeModule?.type === 'quiz' ? 'اختبار' : 'مقال'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => activeModule && handleCompleteModule(selectedLearningPath.id, activeModule.id)}
                    disabled={activeModule?.completed}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${activeModule?.completed
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                  >
                    {activeModule?.completed ? (
                      <> <CheckCircle className="w-5 h-5" /> مكتمل </>
                    ) : (
                      <> تحديد كمكتمل <ArrowRight className="w-4 h-4 rotate-180" /> </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 prose max-w-none text-gray-600 leading-relaxed">
                <h3 className="text-lg font-bold text-gray-900 mb-2">عن هذا المسار</h3>
                <p>
                  {selectedLearningPath.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar (Playlist) */}
          <div className="w-full lg:w-96 bg-white border-r overflow-y-auto h-full">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-900 mb-2">{selectedLearningPath.title}</h3>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${selectedLearningPath.completionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{Math.round(selectedLearningPath.completionRate)}% مكتمل</p>
            </div>

            <div className="divide-y divide-gray-100">
              {selectedLearningPath.modules.map((module, index) => {
                const ModuleIcon = getModuleIcon(module.type);
                const isActive = activeModuleId === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModuleId(module.id)}
                    className={`w-full text-right p-4 flex items-start gap-4 transition-colors ${isActive ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-gray-50'
                      }`}
                  >
                    <div className="pt-1">
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-blue-600' : 'border-gray-300'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-transparent'}`} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-medium mb-1 ${isActive ? 'text-blue-900' : module.completed ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                        {index + 1}. {module.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ModuleIcon className="w-3 h-3" />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // PREVIEW MODE (Not Enrolled) -> Use existing layout or slightly modified
    return (
      // ... existing code for preview ...
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPath(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span>العودة لمسارات التعلم</span>
        </button>

        {/* Path Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          {/* ... existing header content ... */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedLearningPath.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {selectedLearningPath.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedLearningPath.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{selectedLearningPath.students.toLocaleString()} طالب</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{selectedLearningPath.rating.toFixed(1)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getDifficultyColor(selectedLearningPath.difficulty)}-100 text-${getDifficultyColor(selectedLearningPath.difficulty)}-800`}>
                  {selectedLearningPath.difficulty === 'beginner' ? 'مبتدئ' :
                    selectedLearningPath.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleEnroll(selectedLearningPath.id)}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              التسجيل في المسار
            </button>
          </div>
        </div>

        {/* Modules List (Preview) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">محتوى المسار</h2>
          {selectedLearningPath.modules.map((module, index) => {
            const ModuleIcon = getModuleIcon(module.type);
            const moduleColor = getModuleColor(module.type);
            return (
              <div key={module.id} className="bg-white rounded-xl shadow-sm border p-6 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                    <ModuleIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{module.title}</h3>
                    <span className="text-sm text-gray-500">يجب التسجيل للوصول لهذا المحتوى</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">مسارات التعلم</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          طور مهاراتك الجديدة مع مسارات تعليمية مخصصة ومصممة بعناية من قبل خبراء المجال
        </p>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPaths.map((path) => (
          <div
            key={path.id}
            className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPath(path.id)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getDifficultyColor(path.difficulty)}-100 text-${getDifficultyColor(path.difficulty)}-800`}>
                  {path.difficulty === 'beginner' ? 'مبتدئ' :
                    path.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                </span>
                {path.enrolled && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    مُسجل
                  </span>
                )}
              </div>

              {/* Skill Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {path.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {path.description}
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{path.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{path.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{path.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Progress or Modules Count */}
              {path.enrolled ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">التقدم</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(path.completionRate)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${path.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 mb-4">
                  {path.modules.length} وحدة تعليمية
                </div>
              )}

              {/* CTA Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  مهارة: <span className="font-medium text-gray-900">{path.skill}</span>
                </div>

                <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all group">
                  {path.enrolled ? 'متابعة' : 'ابدأ الآن'}
                  <ArrowRight className="w-4 h-4 inline mr-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State or Additional Content */}
      {displayPaths.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مسارات تعلم حالياً</h3>
          <p className="text-gray-600">سنقوم بإضافة مسارات تعليمية جديدة قريباً</p>
        </div>
      )}
    </div>
  );
}