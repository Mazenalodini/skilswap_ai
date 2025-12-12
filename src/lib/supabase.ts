import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use fallback values if environment variables are not set
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== defaultUrl &&
    supabaseAnonKey !== defaultKey;
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
          status: string;
          completed_services: number;
          social_links?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          bio?: string;
          phone?: string;
          location?: string;
          website?: string;
          points?: number;
          reputation?: number;
          level?: string;
          status?: string;
          completed_services?: number;
          social_links?: any;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          bio?: string;
          phone?: string;
          location?: string;
          website?: string;
          points?: number;
          reputation?: number;
          level?: string;
          status?: string;
          completed_services?: number;
          social_links?: any;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          skill_required: string;
          skill_level: string;
          points: number;
          estimated_time: string;
          provider_id: string;
          status: string;
          tags: string[];
          portfolio: string[];
          requirements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          skill_required: string;
          skill_level: string;
          points: number;
          estimated_time: string;
          provider_id: string;
          status?: string;
          tags?: string[];
          portfolio?: string[];
          requirements?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          skill_required?: string;
          skill_level?: string;
          points?: number;
          estimated_time?: string;
          provider_id?: string;
          status?: string;
          tags?: string[];
          portfolio?: string[];
          requirements?: string[];
          updated_at?: string;
        };
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          category: string;
          level: string;
          verified: boolean;
          rating: number;
          completed_projects: number;
          assessment_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          category: string;
          level: string;
          verified?: boolean;
          rating?: number;
          completed_projects?: number;
          assessment_date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_name?: string;
          category?: string;
          level?: string;
          verified?: boolean;
          rating?: number;
          completed_projects?: number;
          assessment_date?: string;
        };
      };
      service_requests: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          skill_needed: string;
          budget: number;
          deadline?: string;
          client_id: string;
          status: string;
          requirements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          skill_needed: string;
          budget: number;
          deadline?: string;
          client_id: string;
          status?: string;
          requirements?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          skill_needed?: string;
          budget?: number;
          deadline?: string;
          client_id?: string;
          status?: string;
          requirements?: string[];
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          attachments?: string[];
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          attachments?: string[];
          read?: boolean;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          attachments?: string[];
          read?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          action_url?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          action_url?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          action_url?: string;
        };
      };
      disputes: {
        Row: {
          id: string;
          service_id: string;
          client_id: string;
          provider_id: string;
          reason: string;
          description: string;
          status: string;
          resolution?: string;
          created_at: string;
          resolved_at?: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          client_id: string;
          provider_id: string;
          reason: string;
          description: string;
          status?: string;
          resolution?: string;
          resolved_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          client_id?: string;
          provider_id?: string;
          reason?: string;
          description?: string;
          status?: string;
          resolution?: string;
          resolved_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_name: string;
          badge_description: string;
          badge_icon: string;
          rarity: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_name: string;
          badge_description: string;
          badge_icon: string;
          rarity: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_name?: string;
          badge_description?: string;
          badge_icon?: string;
          rarity?: string;
          earned_at?: string;
        };
      };
      portfolio_items: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          images?: string[];
          tags?: string[];
          project_url?: string;
          rating?: number;
          client_feedback?: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          images?: string[];
          tags?: string[];
          project_url?: string;
          rating?: number;
          client_feedback?: string;
          completed_at?: string;
        };
      };
      learning_paths: {
        Row: {
          id: string;
          skill: string;
          title: string;
          description: string;
          difficulty: string;
          duration: string;
          rating: number;
          students: number;
          modules: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill: string;
          title: string;
          description: string;
          difficulty: string;
          duration: string;
          rating?: number;
          students?: number;
          modules?: any;
        };
        Update: {
          id?: string;
          skill?: string;
          title?: string;
          description?: string;
          difficulty?: string;
          duration?: string;
          rating?: number;
          students?: number;
          modules?: any;
        };
      };
      user_learning_progress: {
        Row: {
          id: string;
          user_id: string;
          learning_path_id: string;
          completion_rate: number;
          enrolled_at: string;
          completed_modules: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          learning_path_id: string;
          completion_rate?: number;
          enrolled_at?: string;
          completed_modules?: string[];
        };
        Update: {
          id?: string;
          user_id?: string;
          learning_path_id?: string;
          completion_rate?: number;
          enrolled_at?: string;
          completed_modules?: string[];
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          image?: string;
          tags: string[];
          likes: number;
          comments: number;
          shares: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          image?: string;
          tags?: string[];
          likes?: number;
          comments?: number;
          shares?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          image?: string;
          tags?: string[];
          likes?: number;
          comments?: number;
          shares?: number;
          created_at?: string;
        };
      };
    };
  };
}