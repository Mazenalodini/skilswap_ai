import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

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
  status: string;
  completed_services: number;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at?: string;
  skills?: Skill[];
  badges?: Badge[];
  portfolio?: PortfolioItem[];
}

export interface Skill {
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
}

export interface Badge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  rarity: string;
  earned_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string, skills?: string[]) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateUserPoints: (points: number) => Promise<void>;
  addSkillToUser: (skill: Omit<Skill, "id" | "user_id" | "created_at">) => Promise<void>;
  addBadgeToUser: (badge: Omit<Badge, "id" | "user_id" | "earned_at">) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, "id" | "user_id" | "created_at">) => Promise<void>;
  updateUserStatus: (status: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const refreshProfile = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (sessionData.session?.user) {
        let { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", sessionData.session.user.id)
          .single();

        // Self-healing: If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          console.warn("User profile missing, attempting self-healing...");
          const { data: newProfile, error: createError } = await supabase
            .from("users")
            .insert([
              {
                id: sessionData.session.user.id,
                email: sessionData.session.user.email!,
                name: sessionData.session.user.user_metadata?.name || sessionData.session.user.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("Self-healing failed:", createError);
            throw createError;
          }
          profile = newProfile;
          profileError = null;
        }

        if (profileError) throw profileError;

        // Fetch additional user data
        const [skillsResult, badgesResult, portfolioResult] = await Promise.all([
          supabase.from("user_skills").select("*").eq("user_id", sessionData.session.user.id),
          supabase.from("user_badges").select("*").eq("user_id", sessionData.session.user.id),
          supabase.from("portfolio_items").select("*").eq("user_id", sessionData.session.user.id)
        ]);

        setUser({
          ...profile,
          skills: skillsResult.data || [],
          badges: badgesResult.data || [],
          portfolio: portfolioResult.data || []
        });
      }
    } catch (err) {
      console.error("Profile refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check session on start
  useEffect(() => {
    refreshProfile();
  }, []);

  // تسجيل دخول
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session?.user) {
        let { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        // Self-healing: If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          console.warn("User profile missing during login, attempting self-healing...");
          const { data: newProfile, error: createError } = await supabase
            .from("users")
            .insert([
              {
                id: data.session.user.id,
                email: data.session.user.email!,
                name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("Self-healing failed:", createError);
            throw createError;
          }
          profile = newProfile;
          profileError = null;
        }

        if (profileError) throw profileError;

        // Fetch additional user data
        const [skillsResult, badgesResult, portfolioResult] = await Promise.all([
          supabase.from("user_skills").select("*").eq("user_id", data.session.user.id),
          supabase.from("user_badges").select("*").eq("user_id", data.session.user.id),
          supabase.from("portfolio_items").select("*").eq("user_id", data.session.user.id)
        ]);

        setUser({
          ...profile,
          skills: skillsResult.data || [],
          badges: badgesResult.data || [],
          portfolio: portfolioResult.data || []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // تسجيل حساب جديد
  const register = async (email: string, password: string, name: string, role: string = 'client', skills: string[] = []) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }, // يخزن الاسم والدور في user_metadata
        },
      });
      if (error) throw error;

      if (data.user) {
        // 1. Create User Profile
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email,
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (insertError) throw insertError;

        // 2. Insert Skills if provided
        if (skills.length > 0) {
          const skillsToInsert = skills.map(skillName => ({
            id: crypto.randomUUID(),
            user_id: data.user!.id,
            skill_name: skillName,
            category: 'General', // Default category
            level: 'Intermediate', // Default level
            verified: true, // Auto-verify since they passed the quiz
            rating: 5.0, // Initial rating
            completed_projects: 0,
            assessment_date: new Date().toISOString(),
            created_at: new Date().toISOString()
          }));

          const { error: skillsError } = await supabase
            .from("user_skills")
            .insert(skillsToInsert);

          if (skillsError) {
            console.error("Error inserting initial skills:", skillsError);
            // Don't fail registration if skills fail, just log it
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // تسجيل خروج
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  // تحديث بروفايل
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };

    const { error } = await supabase.from("users").update(updates).eq("id", user.id);
    if (error) throw error;

    setUser(updatedUser);
  };

  // تحديث النقاط
  const updateUserPoints = async (points: number) => {
    if (!user) return;
    await updateUserProfile({ points });
  };

  // إضافة مهارة
  const addSkillToUser = async (skill: Omit<Skill, "id" | "user_id" | "created_at">) => {
    if (!user) return;
    const newSkill = {
      ...skill,
      id: crypto.randomUUID(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("user_skills").insert([newSkill]);
    if (error) throw error;
  };

  // إضافة بادج
  const addBadgeToUser = async (badge: Omit<Badge, "id" | "user_id" | "earned_at">) => {
    if (!user) return;
    const newBadge = {
      ...badge,
      id: crypto.randomUUID(),
      user_id: user.id,
      earned_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("user_badges").insert([newBadge]);
    if (error) throw error;
  };

  // إضافة عنصر للمعرض
  const addPortfolioItem = async (item: Omit<PortfolioItem, "id" | "user_id" | "created_at">) => {
    if (!user) return;
    const newItem = {
      ...item,
      user_id: user.id,
    };
    const { data, error } = await supabase.from("portfolio_items").insert([newItem]).select().single();
    if (error) throw error;

    // Update local state
    if (data) {
      setUser(prev => prev ? {
        ...prev,
        portfolio: [...(prev.portfolio || []), data]
      } : null);
    }
  };

  // تحديث الحالة (online/offline)
  const updateUserStatus = async (status: string) => {
    if (!user) return;
    await updateUserProfile({ status });
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserPoints,
    addSkillToUser,
    addBadgeToUser,
    addPortfolioItem,
    updateUserStatus,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
