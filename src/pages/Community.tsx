import { useState, useRef } from 'react';
import {
  Users, MessageCircle, Heart, Share2, Plus, Search,
  TrendingUp, Award, Calendar,
  MessageSquare, Bookmark, MoreHorizontal, X, Image as ImageIcon, Loader, Sparkles, Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { uploadImage } from '../lib/storage';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  prize: number;
  deadline: string;
  status: 'active' | 'completed';
}

export default function Community() {
  const { user } = useAuth();
  const { posts, communities, challenges, comments, trendingPosts, createPost, likePost, bookmarkPost, addComment, joinCommunity, leaveCommunity, followUser, fetchPostComments, createChallenge, submitChallenge, sharePost } = useData();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);
  const [showSubmitChallengeModal, setShowSubmitChallengeModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    skill: '',
    difficulty: 'beginner',
    prize: 100,
    deadline: '',
    conditions: [''],
    ai_prompt: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);



  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return 'منذ ' + days + (days === 1 ? ' يوم' : ' أيام');
    if (hours > 0) return 'منذ ' + hours + (hours === 1 ? ' ساعة' : ' ساعات');
    if (minutes > 0) return 'منذ ' + minutes + (minutes === 1 ? ' دقيقة' : ' دقائق');
    return 'منذ قليل';
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.title || !newChallenge.description || !newChallenge.skill || !newChallenge.deadline) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await createChallenge({
        ...newChallenge,
        prize: Number(newChallenge.prize),
        conditions: newChallenge.conditions.filter(c => c.trim() !== ''),
        difficulty: newChallenge.difficulty as any
      });
      setShowCreateChallengeModal(false);
      setNewChallenge({
        title: '',
        description: '',
        skill: '',
        difficulty: 'beginner',
        prize: 100,
        deadline: '',
        conditions: [''],
        ai_prompt: ''
      });
      toast.success('تم إنشاء التحدي بنجاح!');
    } catch (error) {
      toast.error('فشل إنشاء التحدي');
    }
  };

  const handleSubmitChallenge = async () => {
    if (!selectedChallengeId || !submissionContent.trim()) return;

    try {
      await submitChallenge(selectedChallengeId, submissionContent);
      setShowSubmitChallengeModal(false);
      setSubmissionContent('');
      setSelectedChallengeId(null);
      toast.success('تم إرسال الحل! جاري التحقق بواسطة الذكاء الاصطناعي...');
    } catch (error) {
      toast.error('فشل إرسال الحل');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;

    setIsUploading(true);
    try {
      let imageUrl = undefined;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, 'post-images');
      }

      const tags = newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag);

      await createPost(newPostContent, imageUrl, tags);

      setNewPostContent('');
      setNewPostTags('');
      setSelectedImage(null);
      setShowCreatePostModal(false);
      toast.success('تم نشر المنشور بنجاح!');
    } catch (error: any) {
      console.error('Failed to create post:', error);
      toast.error(`فشل إنشاء المنشور: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const analyzePostContent = (content: string) => {
    if (content.length < 10) return null;

    const suggestions = [];
    if (content.toLowerCase().includes('react') || content.toLowerCase().includes('hook')) {
      suggestions.push('React');
      suggestions.push('Frontend');
    }
    if (content.toLowerCase().includes('design') || content.toLowerCase().includes('ui') || content.toLowerCase().includes('ux')) {
      suggestions.push('UI/UX');
      suggestions.push('Design');
    }
    if (content.toLowerCase().includes('error') || content.toLowerCase().includes('bug') || content.toLowerCase().includes('help')) {
      suggestions.push('Help');
      suggestions.push('Debug');
    }
    if (content.toLowerCase().includes('job') || content.toLowerCase().includes('hiring')) {
      suggestions.push('Career');
      suggestions.push('Jobs');
    }

    return suggestions.length > 0 ? suggestions : null;
  };

  const aiSuggestions = analyzePostContent(newPostContent);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    await likePost(postId);
  };

  const handleBookmark = async (postId: string) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    await bookmarkPost(postId);
  };



  const handleShare = async (postId: string) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }
    try {
      await sharePost(postId);
      toast.success('تم مشاركة المنشور بنجاح');
    } catch (error) {
      toast.error('فشل مشاركة المنشور');
    }
  };

  const handleToggleComments = async (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    if (!expandedComments[postId]) {
      await fetchPostComments(postId);
    }
  };

  const handleSubmitComment = async (postId: string) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    const content = commentContent[postId];
    if (!content?.trim()) return;

    try {
      await addComment(postId, content);
      setCommentContent(prev => ({ ...prev, [postId]: '' }));
      toast.success('تم إضافة التعليق بنجاح');
    } catch (error) {
      toast.error('فشل إضافة التعليق');
    }
  };



  // Filter posts based on search and filter selection
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Implement other filters if needed
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">مجتمع SkillSwap</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          تواصل مع المحترفين، شارك خبراتك، وتعلم من الآخرين في مجتمع نشط ومتفاعل
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
        <div className="flex border-b">
          {[
            { id: 'feed', label: 'التغذية', icon: MessageCircle },
            { id: 'challenges', label: 'التحديات', icon: Award },
            { id: 'groups', label: 'المجموعات', icon: Users },
            { id: 'trending', label: 'الشائع', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المجتمع..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع المنشورات</option>
                <option value="popular">الأكثر شعبية</option>
                <option value="recent">الأحدث</option>
                <option value="following">المتابعون</option>
              </select>
              {activeTab === 'challenges' ? (
                <button
                  onClick={() => user ? setShowCreateChallengeModal(true) : toast.error('يرجى تسجيل الدخول أولاً')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>تحدي جديد</span>
                </button>
              ) : (
                <button
                  onClick={() => user ? setShowCreatePostModal(true) : toast.error('يرجى تسجيل الدخول أولاً')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>منشور جديد</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'feed' && (
            <>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-sm border p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName || 'User')}`}
                          alt={post.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                            {/* Verification badge logic could be added here if available in user data */}
                          </div>
                          <p className="text-sm text-gray-500">{formatTime(post.created_at)}</p>
                        </div>
                      </div >
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div >

                    {/* Post Content */}
                    < div className="mb-4" >
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {
                        post.image && (
                          <div className="mt-4">
                            <img
                              src={post.image}
                              alt="Post image"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )
                      }

                      {/* Tags */}
                      {
                        post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )
                      }
                    </div >

                    {/* Post Stats */}
                    < div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b" >
                      <div className="flex items-center space-x-4">
                        <span>{post.likes} إعجاب</span>
                        <span>{post.comments} تعليق</span>
                        <span>{post.shares} مشاركة</span>
                      </div>
                      {/* Views logic could be added if tracked */}
                    </div >

                    {/* Post Actions */}
                    < div className="flex items-center justify-between" >
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                            }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>إعجاب</span>
                        </button>
                        <button
                          onClick={() => handleToggleComments(post.id)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>تعليق</span>
                        </button>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span>{post.shares || 0}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className={`transition-colors ${post.isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                          }`}
                      >
                        <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div >

                    {/* Comments Section */}
                    {expandedComments[post.id] && (
                      <div className="mt-6 pt-6 border-t animate-fadeIn">
                        <div className="flex gap-3 mb-6">
                          <img
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                            alt="User"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              value={commentContent[post.id] || ''}
                              onChange={(e) => setCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="اكتب تعليقاً..."
                              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSubmitComment(post.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleSubmitComment(post.id)}
                              disabled={!commentContent[post.id]?.trim()}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-300 transition-colors"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                          {comments[post.id]?.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <img
                                src={comment.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}`}
                                alt={comment.userName}
                                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                              />
                              <div className="bg-gray-50 rounded-2xl rounded-tr-none p-3 flex-grow">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-sm">{comment.userName}</span>
                                  <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                          {(!comments[post.id] || comments[post.id].length === 0) && (
                            <p className="text-center text-gray-500 text-sm py-4">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div >
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منشورات</h3>
                  <p className="text-gray-600">كن أول من يشارك في المجتمع!</p>
                </div>
              )}
            </>
          )}

          {
            activeTab === 'challenges' && (
              <div className="space-y-6">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {challenge.difficulty === 'beginner' ? 'مبتدئ' :
                              challenge.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{challenge.description}</p>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{challenge.participants} مشارك</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>{challenge.prize} نقطة</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>ينتهي في {new Date(challenge.deadline).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>

                        <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full inline-block">
                          {challenge.skill}
                        </div>

                        {challenge.conditions && challenge.conditions.length > 0 && (
                          <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                            <h4 className="text-sm font-bold text-yellow-800 mb-2">شروط التحدي (يتحقق منها الذكاء الاصطناعي):</h4>
                            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                              {challenge.conditions.map((condition, idx) => (
                                <li key={idx}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (!user) {
                            toast.error('يرجى تسجيل الدخول أولاً');
                            return;
                          }
                          setSelectedChallengeId(challenge.id);
                          setShowSubmitChallengeModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        شارك الآن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }

          {
            activeTab === 'groups' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communities.map((community) => (
                  <div key={community.id} className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={community.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=random`}
                        alt={community.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{community.name}</h3>
                        <p className="text-sm text-gray-500">{community.members_count} عضو</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{community.description}</p>
                    <button
                      onClick={() => community.isJoined ? leaveCommunity(community.id) : joinCommunity(community.id)}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${community.isJoined
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {community.isJoined ? 'مغادرة' : 'انضمام'}
                    </button>
                  </div>
                ))}
                {communities.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مجموعات حالياً</h3>
                  </div>
                )}
              </div>
            )
          }

          {
            activeTab === 'trending' && (
              <div className="space-y-6">
                {trendingPosts.length > 0 ? (
                  trendingPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm border p-6">
                      {/* Simplified Post View for Trending */}
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={post.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName || 'User')}`}
                          alt={post.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                          <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-4 line-clamp-3">{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded-lg mb-4" />
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">لا يوجد محتوى شائع حالياً</h3>
                    <p className="text-gray-600">تفاعل مع المنشورات لتظهر هنا!</p>
                  </div>
                )}
              </div>
            )
          }
        </div >

        {/* Sidebar */}
        < div className="space-y-6" >
          {/* User Stats */}
          {
            user && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">إحصائياتك</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المنشورات</span>
                    <span className="font-semibold">{posts.filter(p => p.userId === user.id).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المتابعون</span>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المتابعين</span>
                    <span className="font-semibold">36</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الإعجابات</span>
                    <span className="font-semibold">{posts.filter(p => p.userId === user.id).reduce((acc, curr) => acc + curr.likes, 0)}</span>
                  </div>
                </div>
              </div>
            )
          }

          {/* Trending Topics */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">المواضيع الشائعة</h3>
            <div className="space-y-3">
              {[
                { tag: 'React', posts: 45 },
                { tag: 'UI/UX Design', posts: 32 },
                { tag: 'Node.js', posts: 28 },
                { tag: 'Digital Marketing', posts: 24 },
                { tag: 'Python', posts: 19 }
              ].map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    #{topic.tag}
                  </span>
                  <span className="text-sm text-gray-500">{topic.posts} منشور</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Users */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">اقتراحات للمتابعة</h3>
            <div className="space-y-4">
              {[
                {
                  id: 'mock-1',
                  name: 'سارة أحمد',
                  avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
                  skill: 'مصممة UI/UX',
                  mutual: 5
                },
                {
                  id: 'mock-2',
                  name: 'محمد علي',
                  avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
                  skill: 'مطور Full Stack',
                  mutual: 3
                }
              ].map((suggestedUser, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={suggestedUser.avatar}
                    alt={suggestedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">{suggestedUser.name}</h4>
                    <p className="text-sm text-gray-600">{suggestedUser.skill}</p>
                    <p className="text-xs text-gray-500">{suggestedUser.mutual} أصدقاء مشتركون</p>
                  </div>
                  <button
                    onClick={() => followUser(suggestedUser.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    متابعة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div >
      </div >

      {/* Create Post Modal */}
      {
        showCreatePostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">إنشاء منشور جديد</h3>
                <button onClick={() => setShowCreatePostModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="شارك أفكارك، أسئلتك، أو إنجازاتك..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوسوم (اختياري)</label>
                  <input
                    type="text"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="مثال: React, Design, Help (افصل بفاصلة)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {aiSuggestions && (
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-bold text-purple-800">اقتراحات الذكاء الاصطناعي</span>
                    </div>
                    <p className="text-sm text-purple-700 mb-2">بناءً على محتوى منشورك، نقترح إضافة هذه الوسوم:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            const currentTags = newPostTags ? newPostTags.split(',').map(t => t.trim()) : [];
                            if (!currentTags.includes(tag)) {
                              setNewPostTags(currentTags.length > 0 ? `${newPostTags}, ${tag}` : tag);
                            }
                          }}
                          className="bg-white text-purple-600 text-xs px-2 py-1 rounded border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                          #{tag} +
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedImage && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>إضافة صورة</span>
                  </button>

                  <button
                    onClick={handleCreatePost}
                    disabled={(!newPostContent.trim() && !selectedImage) || isUploading}
                    className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors flex items-center space-x-2 ${(newPostContent.trim() || selectedImage) && !isUploading
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                      }`}
                  >
                    {isUploading && <Loader className="w-4 h-4 animate-spin" />}
                    <span>نشر</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Create Challenge Modal */}
      {showCreateChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">إنشاء تحدي جديد</h3>
              <button onClick={() => setShowCreateChallengeModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان التحدي</label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المهارة المطلوبة</label>
                  <input
                    type="text"
                    value={newChallenge.skill}
                    onChange={(e) => setNewChallenge({ ...newChallenge, skill: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
                  <select
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نقاط الجائزة</label>
                  <input
                    type="number"
                    value={newChallenge.prize}
                    onChange={(e) => setNewChallenge({ ...newChallenge, prize: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={newChallenge.deadline}
                    onChange={(e) => setNewChallenge({ ...newChallenge, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">شروط التحقق (للذكاء الاصطناعي)</label>
                {newChallenge.conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => {
                        const newConditions = [...newChallenge.conditions];
                        newConditions[index] = e.target.value;
                        setNewChallenge({ ...newChallenge, conditions: newConditions });
                      }}
                      placeholder={`شرط ${index + 1}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {index === newChallenge.conditions.length - 1 && (
                      <button
                        onClick={() => setNewChallenge({ ...newChallenge, conditions: [...newChallenge.conditions, ''] })}
                        className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">سيقوم الذكاء الاصطناعي بالتحقق من هذه الشروط عند تقديم الحلول.</p>
              </div>

              <button
                onClick={handleCreateChallenge}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                إنشاء التحدي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Challenge Modal */}
      {showSubmitChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">تقديم الحل</h3>
              <button onClick={() => setShowSubmitChallengeModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                يرجى تقديم الحل الخاص بك (كود، رابط، أو نص). سيقوم الذكاء الاصطناعي بتحليله فوراً.
              </p>
              <textarea
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="اكتب الحل هنا..."
                className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                onClick={handleSubmitChallenge}
                disabled={!submissionContent.trim()}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                إرسال للتحقق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}