// Type definitions for the SkillSwap AI platform

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  points: number;
  reputation: number;
  level: string;
  status: 'online' | 'available' | 'busy' | 'offline';
  completed_services: number;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  skill_required: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  estimated_time: string;
  provider_id: string;
  status: 'available' | 'in-progress' | 'completed' | 'cancelled';
  tags: string[];
  portfolio: string[];
  requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  rating: number;
  completed_projects: number;
  assessment_date: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned_at: string;
}

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  project_url?: string;
  rating: number;
  client_feedback?: string;
  completed_at: string;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  skill_needed: string;
  budget: number;
  deadline?: string;
  client_id: string;
  status: 'open' | 'in-review' | 'assigned' | 'completed';
  requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachments?: string[];
  read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'service_request' | 'service_completed' | 'skill_verified' | 'badge_earned' | 'message' | 'dispute';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  service_id: string;
  client_id: string;
  provider_id: string;
  reason: string;
  description: string;
  status: 'open' | 'in-review' | 'resolved' | 'closed';
  resolution?: string;
  created_at: string;
  resolved_at?: string;
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
  modules: LearningModule[];
  created_at: string;
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'video' | 'article' | 'project' | 'quiz';
  duration: string;
  completed?: boolean;
  url?: string;
  content?: string;
}

export interface UserLearningProgress {
  id: string;
  user_id: string;
  learning_path_id: string;
  completion_rate: number;
  enrolled_at: string;
  completed_modules: string[];
}

export interface SearchFilters {
  category?: string;
  skillLevel?: string;
  minRating?: number;
  maxPoints?: number;
  minPoints?: number;
  location?: string;
  availability?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}