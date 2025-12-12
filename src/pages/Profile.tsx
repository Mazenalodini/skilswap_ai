import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { User, Award, BookOpen, Star, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { uploadImage } from '../lib/storage';
import { supabase } from '../lib/supabase';
import type { User as AuthUser } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ProfileSkeleton } from '../components/ui/Skeleton';

// Import Profile Components
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileSkills from '../components/profile/ProfileSkills';
import ProfilePortfolio from '../components/profile/ProfilePortfolio';
import ProfileServices from '../components/profile/ProfileServices';
import ProfileBadges from '../components/profile/ProfileBadges';

export default function Profile() {
  const { userId } = useParams();
  const { user, updateUserProfile, updateUserStatus, addPortfolioItem } = useAuth();
  const { createService, addNotification } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [otherUserProfile, setOtherUserProfile] = useState<AuthUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch other user profile if userId is present
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId && userId !== user?.id) {
        setLoadingProfile(true);
        try {
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

          if (profileError) throw profileError;

          const [skillsResult, badgesResult, portfolioResult] = await Promise.all([
            supabase.from("user_skills").select("*").eq("user_id", userId),
            supabase.from("user_badges").select("*").eq("user_id", userId),
            supabase.from("portfolio_items").select("*").eq("user_id", userId)
          ]);

          setOtherUserProfile({
            ...profile,
            skills: skillsResult.data || [],
            badges: badgesResult.data || [],
            portfolio: portfolioResult.data || []
          });
        } catch (err) {
          console.error("Error fetching user profile:", err);
          toast.error('فشل تحميل الملف الشخصي');
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setOtherUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [userId, user]);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.social_links?.linkedin || '',
    github: user?.social_links?.github || '',
    twitter: user?.social_links?.twitter || ''
  });

  // Update edit form when user changes
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        linkedin: user.social_links?.linkedin || '',
        github: user.social_links?.github || '',
        twitter: user.social_links?.twitter || ''
      });
    }
  }, [user]);

  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    skillRequired: 'React',
    skillLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    points: 100,
    estimatedTime: '',
    tags: ''
  });

  const [newPortfolioForm, setNewPortfolioForm] = useState({
    title: '',
    description: '',
    tags: '',
    projectUrl: '',
    images: ['']
  });

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which profile to show
  const enhancedProfileUser = userId && userId !== user?.id ? otherUserProfile : user;

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingAvatar(true);
      try {
        const avatarUrl = await uploadImage(file, 'avatars');
        await updateUserProfile({ avatar_url: avatarUrl });
        toast.success('تم تحديث الصورة الشخصية بنجاح');
      } catch (error: any) {
        console.error('Failed to upload avatar:', error);
        toast.error(`فشل تحديث الصورة الشخصية: ${error.message || 'خطأ غير معروف'}`);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };


  // ... existing imports

  // ... inside component
  if (loadingProfile) {
    return <ProfileSkeleton />;
  }

  if (!enhancedProfileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">المستخدم غير موجود</h3>
          <p className="text-gray-600">لم نتمكن من العثور على هذا المستخدم</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = !!(user && enhancedProfileUser && user.id === enhancedProfileUser.id);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editForm.name,
      bio: editForm.bio,
      phone: editForm.phone,
      location: editForm.location,
      website: editForm.website,
      social_links: {
        linkedin: editForm.linkedin,
        github: editForm.github,
        twitter: editForm.twitter
      }
    });
    setIsEditing(false);
    toast.success('تم حفظ التغييرات بنجاح');

    // Add notification
    addNotification({
      userId: enhancedProfileUser.id,
      type: 'service_completed',
      title: 'تم تحديث الملف الشخصي',
      message: 'تم حفظ التغييرات على ملفك الشخصي بنجاح',
      read: false
    });
  };

  const handleCreateService = () => {
    if (!newServiceForm.title || !newServiceForm.description) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const tagsArray = newServiceForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    createService({
      title: newServiceForm.title,
      description: newServiceForm.description,
      category: newServiceForm.category,
      skillRequired: newServiceForm.skillRequired,
      skillLevel: newServiceForm.skillLevel,
      points: newServiceForm.points,
      estimatedTime: newServiceForm.estimatedTime,
      providerId: enhancedProfileUser.id,
      status: 'available',
      tags: tagsArray,
      portfolio: [],
      requirements: ['تفاصيل المشروع', 'الملفات المطلوبة']
    }).then(() => {
      setNewServiceForm({
        title: '',
        description: '',
        category: 'Web Development',
        skillRequired: 'React',
        skillLevel: 'intermediate',
        points: 100,
        estimatedTime: '',
        tags: ''
      });
      setShowServiceForm(false);
      toast.success('تم إنشاء الخدمة بنجاح!');
    }).catch((error) => {
      toast.error('حدث خطأ أثناء إنشاء الخدمة');
    });
  };


  const handleAddPortfolio = () => {
    if (!newPortfolioForm.title || !newPortfolioForm.description) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const tagsArray = newPortfolioForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    // Add to portfolio
    if (enhancedProfileUser) {
      addPortfolioItem({
        title: newPortfolioForm.title,
        description: newPortfolioForm.description,
        images: newPortfolioForm.images.filter(img => img.trim()),
        tags: tagsArray,
        completed_at: new Date().toISOString(),
        rating: 5,
        project_url: newPortfolioForm.projectUrl
      }).then(() => {
        setNewPortfolioForm({
          title: '',
          description: '',
          tags: '',
          projectUrl: '',
          images: ['']
        });
        setShowPortfolioForm(false);
        toast.success('تم إضافة العمل لمعرض الأعمال بنجاح!');
      }).catch(() => {
        toast.error('حدث خطأ أثناء إضافة العمل');
      });
    }
  };


  const handleStatusChange = (newStatus: string) => {
    updateUserStatus(newStatus as any).then(() => {
      toast.success('تم تحديث الحالة بنجاح');
    }).catch(() => {
      toast.error('حدث خطأ أثناء تحديث الحالة');
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
        <ProfileHeader
          user={enhancedProfileUser}
          isOwnProfile={isOwnProfile}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleSaveProfile={handleSaveProfile}
          setIsEditing={setIsEditing}
          handleAvatarClick={handleAvatarClick}
          handleAvatarChange={handleAvatarChange}
          fileInputRef={fileInputRef}
          isUploadingAvatar={isUploadingAvatar}
          handleStatusChange={handleStatusChange}
        >
          <ProfileStats user={enhancedProfileUser} />
        </ProfileHeader>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: User },
            { id: 'skills', label: 'المهارات', icon: Award },
            { id: 'portfolio', label: 'الأعمال', icon: BookOpen },
            { id: 'badges', label: 'الشارات', icon: Star },
            { id: 'services', label: 'الخدمات', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <ProfileOverview user={enhancedProfileUser} />
          )}

          {activeTab === 'skills' && (
            <ProfileSkills user={enhancedProfileUser} isOwnProfile={isOwnProfile} />
          )}

          {activeTab === 'portfolio' && (
            <ProfilePortfolio
              user={enhancedProfileUser}
              isOwnProfile={isOwnProfile}
              showPortfolioForm={showPortfolioForm}
              setShowPortfolioForm={setShowPortfolioForm}
              newPortfolioForm={newPortfolioForm}
              setNewPortfolioForm={setNewPortfolioForm}
              handleAddPortfolio={handleAddPortfolio}
            />
          )}

          {activeTab === 'badges' && (
            <ProfileBadges user={enhancedProfileUser} />
          )}

          {activeTab === 'services' && (
            <ProfileServices
              user={enhancedProfileUser}
              isOwnProfile={isOwnProfile}
              showServiceForm={showServiceForm}
              setShowServiceForm={setShowServiceForm}
              newServiceForm={newServiceForm}
              setNewServiceForm={setNewServiceForm}
              handleCreateService={handleCreateService}
            />
          )}
        </div>
      </div>
    </div>
  );
}