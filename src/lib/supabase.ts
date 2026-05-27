import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'teacher' | 'student';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string;
  phone: string;
  bio: string;
  status: 'active' | 'inactive' | 'pending';
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  teacher_id: string;
  price: number;
  is_free: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  status: 'active' | 'inactive' | 'draft';
  enrolled_count: number;
  duration_hours: number;
  created_at: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  course_id: string;
  teacher_id: string;
  created_by: string;
  max_students: number;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  classroom_id: string | null;
  is_global: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  classroom_id: string;
  teacher_id: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  recording_url: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classroom_id: string;
  teacher_id: string;
  due_date: string;
  max_score: number;
  attachment_url: string;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  is_read: boolean;
  link: string;
  created_at: string;
}
