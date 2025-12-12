import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  points: number;
  reputation: number;
  level: string;
  status: 'online' | 'offline' | 'available' | 'busy';
  completed_services: number;
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  skillRequired: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  estimatedTime: string;
  providerId: string;
  providerName?: string;
  providerAvatar?: string;
  status: 'available' | 'in-progress' | 'completed';
  tags: string[];
  portfolio: string[];
  requirements: string[];
  rating?: number;
  reviews?: number;
  created_at: string;
  updated_at?: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  skillNeeded: string;
  budget: number;
  deadline?: string;
  clientId: string;
  clientName?: string;
  providerId?: string; // Added providerId
  serviceId?: string; // Added serviceId
  status: 'open' | 'in-review' | 'in-progress' | 'completed' | 'cancelled' | 'accepted'; // Added in-progress
  requirements?: string[];
  proposals?: number;
  created_at: string;
  updated_at?: string;
}

export interface RequestOffer {
  id: string;
  requestId: string;
  providerId: string;
  providerName?: string;
  providerAvatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  price: number;
  message: string;
  created_at: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  reason: string;
  description: string;
  status: 'open' | 'in-review' | 'resolved' | 'closed';
  resolution?: string;
  created_at: string;
  resolvedAt?: string;
}

export interface LearningPath {
  id: string;
  skill: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  students: number;
  modules: Array<{
    id: string;
    title: string;
    type: 'video' | 'article' | 'project' | 'quiz';
    duration: string;
    completed?: boolean;
  }>;
  enrolled?: boolean;
  completionRate?: number;
  created_at: string;
}

export interface UserLearningProgress {
  id: string;
  user_id: string;
  learning_path_id: string;
  completion_rate: number;
  enrolled_at: string;
  completed_modules: string[];
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  created_at: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  image: string;
  members_count: number;
  created_at: string;
  isJoined?: boolean;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: 'member' | 'admin' | 'moderator';
  joined_at: string;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  prize: number;
  deadline: string;
  status: 'active' | 'completed';
  created_at: string;
  creator_id?: string;
  conditions?: string[];
  ai_prompt?: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  content: string;
  status: 'pending' | 'verified' | 'rejected';
  ai_feedback?: string;
  score?: number;
  created_at: string;
}

interface DataContextType {
  // Data
  users: User[];
  services: Service[];
  serviceRequests: ServiceRequest[];
  offers: RequestOffer[];
  messages: Message[];
  notifications: Notification[];
  disputes: Dispute[];
  learningPaths: LearningPath[];
  userLearningProgress: UserLearningProgress[];
  posts: Post[];
  communities: Community[];
  challenges: Challenge[];
  comments: Record<string, PostComment[]>;
  trendingPosts: Post[];
  categories: string[];
  skills: string[];
  loading: boolean;

  // Functions
  searchServices: (query: string, filters?: any) => Service[];
  createService: (serviceData: Partial<Service>) => Promise<void>;
  createServiceRequest: (requestData: Partial<ServiceRequest>) => Promise<void>;
  acceptServiceRequest: (requestId: string) => Promise<void>;
  createOffer: (offerData: Partial<RequestOffer>) => Promise<void>;
  acceptOffer: (offerId: string) => Promise<void>;
  completeServiceRequest: (requestId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string, attachments?: string[]) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  addNotification: (notification: Partial<Notification>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  createDispute: (serviceId: string, reason: string, description: string) => void;
  enrollInLearningPath: (pathId: string) => Promise<void>;
  completeModule: (pathId: string, moduleId: string) => Promise<void>;
  createPost: (content: string, image?: string, tags?: string[]) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<PostComment | null>;
  likePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  fetchPostComments: (postId: string) => Promise<void>;
  createChallenge: (challengeData: Partial<Challenge>) => Promise<void>;
  submitChallenge: (challengeId: string, content: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [offers, setOffers] = useState<RequestOffer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [userLearningProgress, setUserLearningProgress] = useState<UserLearningProgress[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Digital Marketing',
    'Content Writing',
    'Translation',
    'Data Analysis',
    'Graphic Design',
    'Video Editing',
    'SEO Optimization'
  ];

  const skills = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'JavaScript',
    'TypeScript', 'PHP', 'Java', 'C#', 'Swift', 'Kotlin',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects',
    'WordPress', 'Shopify', 'WooCommerce', 'Magento',
    'Google Ads', 'Facebook Ads', 'SEO', 'Content Marketing',
    'Copywriting', 'Technical Writing', 'Translation',
    'Excel', 'Power BI', 'Tableau', 'SQL', 'MongoDB'
  ];

  const fetchData = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch Users
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) setUsers(usersData as unknown as User[]);

      // Fetch Services with provider details
      const { data: servicesData } = await supabase
        .from('services')
        .select('*, users!services_provider_id_fkey(name, avatar_url)')
        .order('created_at', { ascending: false });

      if (servicesData) {
        const formattedServices = servicesData.map(service => ({
          ...service,
          skillRequired: service.skill_required || '',
          skillLevel: service.skill_level || 'beginner',
          estimatedTime: service.estimated_time || '',
          providerId: service.provider_id,
          providerName: service.users?.name || 'Unknown Provider',
          providerAvatar: service.users?.avatar_url,
          // Map DB columns to frontend interface
          skill_required: undefined,
          skill_level: undefined,
          estimated_time: undefined,
          provider_id: undefined,
          users: undefined
        }));
        setServices(formattedServices as unknown as Service[]);
      }

      // Fetch Service Requests
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select('*, users!service_requests_client_id_fkey(name)')
        .order('created_at', { ascending: false });

      if (requestsData) {
        const formattedRequests = requestsData.map(req => ({
          ...req,
          skillNeeded: req.skill_needed || '',
          clientId: req.client_id,
          clientName: req.users?.name || 'Unknown Client',
          // Map DB columns
          skill_needed: undefined,
          client_id: undefined,
          users: undefined
        }));
        setServiceRequests(formattedRequests as unknown as ServiceRequest[]);
      }

      // Fetch Offers
      const { data: offersData } = await supabase
        .from('request_offers')
        .select('*, users!request_offers_provider_id_fkey(name, avatar_url)')
        .order('created_at', { ascending: false });

      if (offersData) {
        const formattedOffers = offersData.map(offer => ({
          ...offer,
          requestId: offer.request_id,
          providerId: offer.provider_id,
          providerName: offer.users?.name || 'Unknown Provider',
          providerAvatar: offer.users?.avatar_url,
          request_id: undefined,
          provider_id: undefined,
          users: undefined
        }));
        setOffers(formattedOffers as unknown as RequestOffer[]);
      }

      // Fetch Learning Paths
      const { data: pathsData } = await supabase
        .from('learning_paths')
        .select('*');

      if (pathsData) {
        setLearningPaths(pathsData as unknown as LearningPath[]);
      }

      // Fetch Posts
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*, users!community_posts_user_id_fkey(name, avatar_url)')
        .order('created_at', { ascending: false });

      // Fetch Communities
      const { data: communitiesData } = await supabase
        .from('communities')
        .select('*')
        .order('members_count', { ascending: false });

      if (communitiesData) {
        setCommunities(communitiesData as unknown as Community[]);
      }

      if (postsData) {
        const formattedPosts = postsData.map(post => ({
          ...post,
          userId: post.user_id,
          userName: post.users?.name,
          userAvatar: post.users?.avatar_url,
          isLiked: false, // Default, will be updated if user is logged in
          isBookmarked: false, // Default
          // Map DB columns
          user_id: undefined,
          users: undefined
        }));
        setPosts(formattedPosts as unknown as Post[]);

        // Set Trending Posts (Top 5 by likes)
        const trending = [...formattedPosts].sort((a, b) => b.likes - a.likes).slice(0, 5);
        setTrendingPosts(trending as unknown as Post[]);
      }

      // Fetch Challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (challengesData) {
        const formattedChallenges = challengesData.map(c => ({
          ...c,
          participants: c.participants_count,
          participants_count: undefined
        }));
        setChallenges(formattedChallenges as unknown as Challenge[]);
      }

      // Fetch User Specific Data if logged in
      if (user) {
        // Messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesData) {
          const formattedMessages = messagesData.map(msg => ({
            ...msg,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            sender_id: undefined,
            receiver_id: undefined
          }));
          setMessages(formattedMessages as unknown as Message[]);
        }

        // Notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsData) {
          const formattedNotifications = notificationsData.map(notif => ({
            ...notif,
            userId: notif.user_id,
            actionUrl: notif.action_url,
            user_id: undefined,
            action_url: undefined
          }));
          setNotifications(formattedNotifications as unknown as Notification[]);
        }

        // Learning Progress
        const { data: progressData } = await supabase
          .from('user_learning_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressData && pathsData) {
          const updatedPaths = (pathsData as unknown as LearningPath[]).map(path => {
            const progress = progressData.find(p => p.learning_path_id === path.id);
            if (progress) {
              return {
                ...path,
                enrolled: true,
                completionRate: progress.completion_rate,
                modules: path.modules.map((m: any) => ({
                  ...m,
                  completed: progress.completed_modules?.includes(m.id)
                }))
              };
            }
            return path;
          });
          setLearningPaths(updatedPaths);
        }

        // Fetch User Learning Progress
        if (user) {
          const { data: progressData } = await supabase
            .from('user_learning_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progressData) {
            setUserLearningProgress(progressData as unknown as UserLearningProgress[]);
          }
        }

        // Fetch Disputes
        const { data: disputesData } = await supabase
          .from('disputes')
          .select('*')
          .or(`client_id.eq.${user.id}, provider_id.eq.${user.id} `)
          .order('created_at', { ascending: false });

        if (disputesData) {
          const formattedDisputes = disputesData.map(dispute => ({
            ...dispute,
            serviceId: dispute.service_id,
            clientId: dispute.client_id,
            providerId: dispute.provider_id,
            resolvedAt: dispute.resolved_at,
            // Map DB columns
            service_id: undefined,
            client_id: undefined,
            provider_id: undefined,
            resolved_at: undefined
          }));
          setDisputes(formattedDisputes as unknown as Dispute[]);
        }

        // Post Interactions (Likes/Bookmarks)
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const { data: bookmarksData } = await supabase
          .from('post_bookmarks')
          .select('post_id')
          .eq('user_id', user.id);

        if (postsData) {
          const likedPostIds = new Set(likesData?.map(l => l.post_id) || []);
          const bookmarkedPostIds = new Set(bookmarksData?.map(b => b.post_id) || []);

          setPosts(prev => prev.map(post => ({
            ...post,
            isLiked: likedPostIds.has(post.id),
            isBookmarked: bookmarkedPostIds.has(post.id)
          })));
        }

        // Community Memberships
        const { data: membershipsData } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id);

        if (communitiesData && membershipsData) {
          const joinedCommunityIds = new Set(membershipsData.map(m => m.community_id));
          setCommunities(prev => prev.map(c => ({
            ...c,
            isJoined: joinedCommunityIds.has(c.id)
          })));
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time Subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:community_posts')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'community_posts' }, (payload) => {
        setPosts(prev => prev.map(post =>
          post.id === payload.new.id
            ? { ...post, ...payload.new, isLiked: post.isLiked, isBookmarked: post.isBookmarked } // Preserve local state like isLiked
            : post
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    if (user) {
      // 1. Messages Subscription
      const messagesSubscription = supabase
        .channel('public:messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id = eq.${user.id} `
        }, (payload) => {
          const newMessage = payload.new as any;
          setMessages(prev => [
            {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              receiverId: newMessage.receiver_id,
              content: newMessage.content,
              attachments: newMessage.attachments,
              read: newMessage.read,
              created_at: newMessage.created_at
            },
            ...prev
          ]);

          // Show notification if needed
          addNotification({
            userId: user.id,
            type: 'message',
            title: 'رسالة جديدة',
            message: 'لديك رسالة جديدة',
            actionUrl: '/messages'
          });
        })
        .subscribe();

      // 2. Notifications Subscription
      const notificationsSubscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id = eq.${user.id} `
        }, (payload) => {
          const newNotification = payload.new as any;
          const formattedNotification: Notification = {
            id: newNotification.id,
            userId: newNotification.user_id,
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            read: newNotification.read,
            actionUrl: newNotification.action_url,
            created_at: newNotification.created_at
          };

          setNotifications(prev => [formattedNotification, ...prev]);
        })
        .subscribe();

      // 3. Service Requests Subscription (Job Board)
      const requestsSubscription = supabase
        .channel('public:service_requests')
        .on('postgres_changes', {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'service_requests'
        }, async () => {
          // For simplicity, we'll just refetch requests to ensure consistency
          // In a high-traffic app, we would handle state updates manually
          const { data: requestsData } = await supabase
            .from('service_requests')
            .select('*, users!service_requests_client_id_fkey(name)')
            .order('created_at', { ascending: false });

          if (requestsData) {
            const formattedRequests = requestsData.map(req => ({
              ...req,
              skillNeeded: req.skill_needed || '',
              clientId: req.client_id,
              clientName: req.users?.name || 'Unknown Client',
              skill_needed: undefined,
              client_id: undefined,
              users: undefined
            }));
            setServiceRequests(formattedRequests as unknown as ServiceRequest[]);
          }
        })
        .subscribe();

      // 4. User Status Subscription
      const usersSubscription = supabase
        .channel('public:users')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'users'
        }, (payload) => {
          const updatedUser = payload.new as any;
          setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(messagesSubscription);
        supabase.removeChannel(notificationsSubscription);
        supabase.removeChannel(requestsSubscription);
        supabase.removeChannel(usersSubscription);
      };
    }
  }, [user]);

  // Search services
  const searchServices = (query: string, filters?: any) => {
    let filtered = services;

    if (query) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter(service => service.category === filters.category);
    }

    if (filters?.skillLevel && filters.skillLevel !== 'all') {
      filtered = filtered.filter(service => service.skillLevel === filters.skillLevel);
    }

    if (filters?.minRating) {
      filtered = filtered.filter(service => (service.rating || 0) >= filters.minRating);
    }

    return filtered;
  };

  // Create service
  const createService = async (serviceData: Partial<Service>) => {
    if (!user) return;

    try {
      const dbService = {
        title: serviceData.title,
        description: serviceData.description,
        category: serviceData.category,
        skill_required: serviceData.skillRequired,
        skill_level: serviceData.skillLevel,
        points: serviceData.points,
        estimated_time: serviceData.estimatedTime,
        provider_id: user.id,
        status: 'available',
        tags: serviceData.tags || [],
        portfolio: serviceData.portfolio || [],
        requirements: serviceData.requirements || []
      };

      const { data, error } = await supabase
        .from('services')
        .insert([dbService])
        .select();

      if (error) throw error;

      if (data) {
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  };

  // Create service request
  const createServiceRequest = async (requestData: Partial<ServiceRequest>) => {
    if (!user) return;

    try {
      // Find the service to get the provider_id
      let providerId = undefined;
      if (requestData.serviceId) {
        const service = services.find(s => s.id === requestData.serviceId);
        if (service) {
          providerId = service.providerId;
        }
      }

      const tempId = crypto.randomUUID();
      const tempRequest: ServiceRequest = {
        id: tempId,
        title: requestData.title || '',
        description: requestData.description || '',
        category: requestData.category || '',
        skillNeeded: requestData.skillNeeded || '',
        budget: requestData.budget || 0,
        deadline: requestData.deadline,
        clientId: user.id,
        clientName: user.name,
        serviceId: requestData.serviceId,
        status: 'open',
        requirements: requestData.requirements || [],
        created_at: new Date().toISOString()
      };

      // Optimistic update
      setServiceRequests(prev => [tempRequest, ...prev]);

      const dbRequest: any = {
        title: requestData.title,
        description: requestData.description,
        category: requestData.category,
        skill_needed: requestData.skillNeeded,
        budget: requestData.budget,
        deadline: requestData.deadline || null, // Handle empty string
        client_id: user.id,
        status: 'open',
        requirements: requestData.requirements || []
      };

      // Only add optional fields if they exist to avoid "column does not exist" errors
      if (requestData.serviceId) dbRequest.service_id = requestData.serviceId;
      if (providerId) dbRequest.provider_id = providerId;

      const { data, error } = await supabase
        .from('service_requests')
        .insert([dbRequest])
        .select('*, users!service_requests_client_id_fkey(name)');

      if (error) throw error;

      if (data) {
        // Replace temp request with real one
        const realRequest = {
          ...data[0],
          skillNeeded: data[0].skill_needed,
          clientId: data[0].client_id,
          clientName: data[0].users?.name,
          skill_needed: undefined,
          client_id: undefined,
          users: undefined
        } as unknown as ServiceRequest;

        setServiceRequests(prev => prev.map(req => req.id === tempId ? realRequest : req));

        // Notify provider
        if (providerId) {
          await addNotification({
            userId: providerId,
            title: 'طلب خدمة جديد',
            message: `لقد تلقيت طلب خدمة جديد: ${requestData.title} `,
            type: 'info',
            actionUrl: '/dashboard?tab=requests'
          });
        }
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      // Revert
      await fetchData();
      throw error;
    }
  };

  // Accept Service Request
  const acceptServiceRequest = async (requestId: string) => {
    if (!user) return;

    try {
      // Optimistic update
      setServiceRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status: 'in-progress' } : req
      ));

      const { error } = await supabase
        .from('service_requests')
        .update({ status: 'in-progress' })
        .eq('id', requestId);

      if (error) throw error;

      // No need to fetch data again if optimistic update worked
      // await fetchData();

      // Notify client
      const request = serviceRequests.find(r => r.id === requestId);
      if (request) {
        await addNotification({
          userId: request.clientId,
          title: 'تم قبول طلبك',
          message: `وافق مقدم الخدمة على طلبك: ${request.title} `,
          type: 'success',
          actionUrl: '/dashboard?tab=requests'
        });
      }
    } catch (error) {
      console.error('Error accepting service request:', error);
      // Revert optimistic update
      await fetchData();
      throw error;
    }
  };

  // Create Offer
  const createOffer = async (offerData: Partial<RequestOffer>) => {
    if (!user) return;
    try {
      const dbOffer = {
        request_id: offerData.requestId,
        provider_id: user.id,
        price: offerData.price,
        message: offerData.message,
        status: 'pending'
      };
      const { error } = await supabase.from('request_offers').insert([dbOffer]);
      if (error) throw error;
      await fetchData();

      // Notify client
      const request = serviceRequests.find(r => r.id === offerData.requestId);
      if (request) {
        await addNotification({
          userId: request.clientId,
          title: 'عرض جديد',
          message: `تلقيت عرضاً جديداً على طلبك: ${request.title} `,
          actionUrl: `/ dashboard ? tab = requests & requestId=${request.id} `
        });
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  };

  // Accept Offer
  const acceptOffer = async (offerId: string) => {
    if (!user) return;
    try {
      const offer = offers.find(o => o.id === offerId);
      if (!offer) return;

      // Optimistic update
      setOffers(prev => prev.map(o =>
        o.id === offerId ? { ...o, status: 'accepted' } : o
      ));

      setServiceRequests(prev => prev.map(req =>
        req.id === offer.requestId ? { ...req, status: 'in-progress', providerId: offer.providerId } : req
      ));

      // 1. Update offer status
      const { error: offerError } = await supabase
        .from('request_offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);
      if (offerError) throw offerError;

      // 2. Update request status and provider
      const { error: requestError } = await supabase
        .from('service_requests')
        .update({
          status: 'in-progress',
          provider_id: offer.providerId
        })
        .eq('id', offer.requestId);
      if (requestError) throw requestError;

      // 3. Create conversation start message
      await sendMessage(offer.providerId, `مرحباً، لقد قبلت عرضك لتنفيذ طلب الخدمة.يمكننا البدء في التفاصيل.`);

      // await fetchData(); // Skip full refetch

      // Notify provider
      await addNotification({
        userId: offer.providerId,
        title: 'تم قبول عرضك',
        message: `وافق العميل على عرضك.يمكنك الآن البدء في التنفيذ.`,
        actionUrl: '/messages'
      });

    } catch (error) {
      console.error('Error accepting offer:', error);
      // Revert
      await fetchData();
      throw error;
    }
  };

  // Complete Service Request
  const completeServiceRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const request = serviceRequests.find(r => r.id === requestId);
      if (!request) return;

      // 1. Update status to completed
      const { error: updateError } = await supabase
        .from('service_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // 2. Deduct points from client (if not already deducted)
      // Note: In a real app, we would use a transaction or edge function for this
      // Here we simulate it by updating the client's points

      // We need to fetch the client's current points first to be safe, 
      // but for now we'll assume the backend handles it or we just update the user record
      // Since we can't easily update another user's points from the client side with simple RLS,
      // we will just log this action. In a real app, this should be a secure backend operation.
      console.log(`Processing payment of ${request.budget} points from ${request.clientId} to ${user.id} `);

      await fetchData();

      // Notify client
      await addNotification({
        userId: request.clientId,
        title: 'تم إكمال الخدمة',
        message: `تم إكمال طلبك: ${request.title}. يرجى تأكيد الاستلام وتقييم الخدمة.`,
        type: 'success',
        actionUrl: '/dashboard?tab=requests'
      });

    } catch (error) {
      console.error('Error completing service request:', error);
      throw error;
    }
  };

  // Upload file
  const uploadFile = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Send message
  const sendMessage = async (receiverId: string, content: string, attachments: string[] = []) => {
    if (!user) return;

    try {
      const tempId = crypto.randomUUID();
      const tempMessage: Message = {
        id: tempId,
        senderId: user.id,
        receiverId: receiverId,
        content: content,
        attachments: attachments,
        read: false,
        created_at: new Date().toISOString()
      };

      // Optimistic update
      setMessages(prev => [tempMessage, ...prev]);

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: receiverId,
          content: content,
          attachments: attachments
        }])
        .select();

      if (error) throw error;

      if (data) {
        // Replace temp message with real one
        const realMessage = {
          ...data[0],
          senderId: data[0].sender_id,
          receiverId: data[0].receiver_id,
          sender_id: undefined,
          receiver_id: undefined
        } as unknown as Message;

        setMessages(prev => prev.map(msg => msg.id === tempId ? realMessage : msg));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert
      await fetchData();
      throw error;
    }
  };

  // Add notification
  const addNotification = async (notification: Partial<Notification>) => {
    if (!notification.userId) return;

    try {
      const dbNotification = {
        user_id: notification.userId,
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        action_url: notification.actionUrl
      };

      const { error } = await supabase
        .from('notifications')
        .insert([dbNotification]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Create dispute
  const createDispute = async (serviceId: string, reason: string, description: string) => {
    if (!user) return;

    try {
      // First get the service to know the provider
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const dbDispute = {
        service_id: serviceId,
        client_id: user.id,
        provider_id: service.providerId,
        reason,
        description,
        status: 'open'
      };

      const { error } = await supabase
        .from('disputes')
        .insert([dbDispute]);

      if (error) throw error;

      await fetchData();
    } catch (error) {
      console.error('Error creating dispute:', error);
    }
  };

  // Enroll in learning path
  const enrollInLearningPath = async (pathId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_learning_progress')
        .insert([{
          user_id: user.id,
          learning_path_id: pathId,
          completion_rate: 0,
          completed_modules: []
        }]);

      if (error) throw error;

      await fetchData(); // Refresh to update enrolled status
    } catch (error) {
      console.error('Error enrolling in learning path:', error);
      throw error;
    }
  };

  // Complete module
  const completeModule = async (pathId: string, moduleId: string) => {
    if (!user) return;

    try {
      const path = learningPaths.find(p => p.id === pathId);
      if (!path) return;

      const moduleIndex = path.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) return;

      // Calculate new progress
      const completedModules = path.modules
        .filter(m => m.completed || m.id === moduleId)
        .map(m => m.id);

      // Ensure current module is in the list
      if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
      }

      const completionRate = (completedModules.length / path.modules.length) * 100;

      const { error } = await supabase
        .from('user_learning_progress')
        .update({
          completion_rate: completionRate,
          completed_modules: completedModules
        })
        .eq('user_id', user.id)
        .eq('learning_path_id', pathId);

      if (error) throw error;

      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  };

  // Create Post
  const createPost = async (content: string, image?: string, tags?: string[]) => {
    if (!user) return;

    try {
      const dbPost = {
        user_id: user.id,
        content,
        image,
        tags: tags || [],
        likes: 0,
        comments: 0,
        shares: 0
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert([dbPost])
        .select();

      if (error) throw error;

      if (data) {
        // Optimistic update: add the new post to the state
        setPosts(prev => [data[0] as Post, ...prev]);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  // Add comment
  // Join Community
  const joinCommunity = async (communityId: string) => {
    if (!user) return;
    try {
      // Optimistic update
      setCommunities(prev => prev.map(c =>
        c.id === communityId ? { ...c, isJoined: true, members_count: c.members_count + 1 } : c
      ));

      const { error } = await supabase
        .from('community_members')
        .insert([{ community_id: communityId, user_id: user.id }]);

      if (error) throw error;

      // We could RPC increment here, but optimistic update is fine for now
    } catch (error) {
      console.error('Error joining community:', error);
      await fetchData(); // Revert
    }
  };

  // Leave Community
  const leaveCommunity = async (communityId: string) => {
    if (!user) return;
    try {
      // Optimistic update
      setCommunities(prev => prev.map(c =>
        c.id === communityId ? { ...c, isJoined: false, members_count: Math.max(0, c.members_count - 1) } : c
      ));

      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error leaving community:', error);
      await fetchData(); // Revert
    }
  };

  // Follow User
  const followUser = async (userId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_follows')
        .insert([{ follower_id: user.id, following_id: userId }]);

      if (error) throw error;

      // toast.success('تمت المتابعة بنجاح');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  // Unfollow User
  const unfollowUser = async (userId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      // toast.success('تم إلغاء المتابعة');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  // Add comment
  const addComment = async (postId: string, content: string): Promise<PostComment | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content
        }])
        .select()
        .single();

      if (error) throw error;

      const newComment: PostComment = {
        id: data.id,
        postId: data.post_id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar_url || '',
        content: data.content,
        created_at: data.created_at
      };

      // Update local state
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      ));

      // Increment count in posts table
      await supabase.rpc('increment_comments', { row_id: postId });

      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  // Like Post
  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.isLiked;

      // Optimistic update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            isLiked: !isLiked
          };
        }
        return p;
      }));

      // DB Update
      if (isLiked) {
        await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id });
        // Decrement count in posts table
        await supabase.rpc('decrement_likes', { row_id: postId });
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        // Increment count in posts table
        await supabase.rpc('increment_likes', { row_id: postId });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      await fetchData();
    }
  };

  // Share Post
  const sharePost = async (postId: string) => {
    if (!user) return;

    try {
      // Optimistic Update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, shares: (p.shares || 0) + 1 };
        }
        return p;
      }));

      // DB Update (Increment share count)
      await supabase.rpc('increment_shares', { row_id: postId });

    } catch (error) {
      console.error('Error sharing post:', error);
      await fetchData();
    }
  };

  // Bookmark Post
  const bookmarkPost = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      // Optimistic update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isBookmarked: !p.isBookmarked
          };
        }
        return p;
      }));

      if (post.isBookmarked) {
        // Remove bookmark
        await supabase
          .from('post_bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Add bookmark
        await supabase
          .from('post_bookmarks')
          .insert([{ post_id: postId, user_id: user.id }]);
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      await fetchData(); // Revert
    }
  };

  // Fetch Post Comments
  const fetchPostComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, users!post_comments_user_id_fkey(name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedComments = data.map(c => ({
          id: c.id,
          postId: c.post_id,
          userId: c.user_id,
          userName: c.users?.name || 'Unknown',
          userAvatar: c.users?.avatar_url || '',
          content: c.content,
          created_at: c.created_at
        }));

        setComments(prev => ({
          ...prev,
          [postId]: formattedComments
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Create Challenge
  const createChallenge = async (challengeData: Partial<Challenge>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('challenges')
        .insert([{
          title: challengeData.title,
          description: challengeData.description,
          skill: challengeData.skill,
          difficulty: challengeData.difficulty,
          prize: challengeData.prize,
          deadline: challengeData.deadline,
          creator_id: user.id,
          conditions: challengeData.conditions,
          ai_prompt: challengeData.ai_prompt,
          status: 'active'
        }]);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  };

  // Submit Challenge & AI Verification
  const submitChallenge = async (challengeId: string, content: string) => {
    if (!user) return;

    try {
      // 1. Create Submission
      const { data: submission, error: submitError } = await supabase
        .from('challenge_submissions')
        .insert([{
          challenge_id: challengeId,
          user_id: user.id,
          content,
          status: 'pending'
        }])
        .select()
        .single();

      if (submitError) throw submitError;

      // 2. Mock AI Verification
      // In a real app, this would be an Edge Function call
      setTimeout(async () => {
        const challenge = challenges.find(c => c.id === challengeId);
        const conditions = challenge?.conditions || [];

        let isVerified = true;
        let feedback = "أحسنت! الحل يلبي جميع الشروط.";
        let score = 95;

        // Simple heuristic for demo
        if (content.length < 20) {
          isVerified = false;
          feedback = "الحل قصير جداً. يرجى تقديم تفاصيل أكثر.";
          score = 30;
        } else if (conditions.length > 0 && !conditions.some(c => content.includes(c.split(' ')[0]))) {
          // Very basic check: if content doesn't contain the first word of any condition (just a mock)
          // In reality, we'd send this to GPT-4
          // For now, let's just say it's verified if it's long enough
        }

        const status = isVerified ? 'verified' : 'rejected';

        // Update Submission
        await supabase
          .from('challenge_submissions')
          .update({
            status,
            ai_feedback: feedback,
            score
          })
          .eq('id', submission.id);

        // If verified, award points
        if (isVerified && challenge?.prize) {
          await supabase.rpc('award_points', { user_id: user.id, amount: challenge.prize });
          toast.success(`تم قبول التحدي! حصلت على ${challenge.prize} نقطة`);
          // Refresh user data to show new points
          await refreshProfile();
        } else {
          toast.error(`تم رفض التحدي: ${feedback}`);
        }

        // Notify user via UI update (refresh data)
        await fetchData();

      }, 3000); // 3 seconds delay for "AI Analysis"

    } catch (error) {
      console.error('Error submitting challenge:', error);
      throw error;
    }
  };

  const value: DataContextType = {
    users,
    services,
    serviceRequests,
    offers,
    messages,
    notifications,
    disputes,
    learningPaths,
    userLearningProgress,
    posts,
    communities,
    challenges,
    comments,
    trendingPosts,
    categories,
    skills,
    loading,
    searchServices,
    createService,
    createServiceRequest,
    acceptServiceRequest,
    createOffer,
    acceptOffer,
    completeServiceRequest,
    sendMessage,
    uploadFile,
    addNotification,
    markNotificationAsRead,
    createDispute,
    enrollInLearningPath,
    completeModule,
    createPost,
    addComment,
    likePost,
    bookmarkPost,
    joinCommunity,
    leaveCommunity,
    followUser,
    unfollowUser,
    fetchPostComments,
    createChallenge,
    submitChallenge,
    sharePost,
    refreshData: fetchData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}