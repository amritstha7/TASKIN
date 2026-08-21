// Hand-written to mirror mobile/supabase/migrations/0001_init.sql exactly.
// If the schema changes, update this file and the migration together.
//
// Every table/view entry includes `Relationships: []` even though we never
// use it — @supabase/postgrest-js's `GenericTable`/`GenericView` constraints
// require that field to be present for the client's generics to resolve at
// all; omitting it silently degrades every Insert/Update/Row type to `never`.

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type RepeatCadence = 'none' | 'daily' | 'weekly' | 'monthly';
export type NotificationTiming = '15m' | '30m' | '1h' | '1d';
export type ThemePreference = 'auto' | 'light' | 'dark';
export type LanguageKey = 'English' | 'Nepali' | 'Spanish' | 'French';
export type CalendarMode = 'ad' | 'bs' | 'dual';
export type ActivityType = 'created' | 'updated' | 'completed' | 'snoozed' | 'note_added';
export type ActivityEntityType = 'task' | 'communication';

export interface Database {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['branches']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          branch_id: string;
          name: string;
          email: string;
          role: string;
          avatar_url: string | null;
          joined_date: string;
          theme: ThemePreference;
          language: LanguageKey;
          calendar_mode: CalendarMode;
          push_notifications: boolean;
          daily_summary: boolean;
          sound_vibration: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          branch_id: string;
          name: string;
          email: string;
          role?: string;
          avatar_url?: string | null;
          joined_date?: string;
          theme?: ThemePreference;
          language?: LanguageKey;
          calendar_mode?: CalendarMode;
          push_notifications?: boolean;
          daily_summary?: boolean;
          sound_vibration?: boolean;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          branch_id: string;
          title: string;
          description: string;
          category: string;
          due_date: string;
          priority: Priority;
          repeat: RepeatCadence;
          is_urgent: boolean;
          notifications_enabled: boolean;
          notifications_timing: NotificationTiming;
          snoozed_until: string | null;
          completed: boolean;
          completed_by: string | null;
          completed_at: string | null;
          attachment_name: string | null;
          attachment_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          branch_id: string;
          title: string;
          description?: string;
          category?: string;
          due_date: string;
          priority?: Priority;
          repeat?: RepeatCadence;
          is_urgent?: boolean;
          notifications_enabled?: boolean;
          notifications_timing?: NotificationTiming;
          snoozed_until?: string | null;
          completed?: boolean;
          completed_by?: string | null;
          completed_at?: string | null;
          attachment_name?: string | null;
          attachment_url?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
        Relationships: [];
      };
      task_notes: {
        Row: {
          id: string;
          task_id: string;
          branch_id: string;
          author_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          author_id?: string | null;
          body: string;
        };
        Update: Partial<Database['public']['Tables']['task_notes']['Insert']>;
        Relationships: [];
      };
      task_photos: {
        Row: {
          id: string;
          task_id: string;
          branch_id: string;
          storage_path: string;
          name: string | null;
          caption: string | null;
          uploaded_by: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          storage_path: string;
          name?: string | null;
          caption?: string | null;
          uploaded_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['task_photos']['Insert']>;
        Relationships: [];
      };
      communications: {
        Row: {
          id: string;
          branch_id: string;
          title: string;
          description: string;
          due_date: string;
          attachment_name: string | null;
          attachment_url: string | null;
          attachment_size_bytes: number | null;
          is_completed: boolean;
          completed_by: string | null;
          completed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          branch_id: string;
          title: string;
          description?: string;
          due_date: string;
          attachment_name?: string | null;
          attachment_url?: string | null;
          attachment_size_bytes?: number | null;
          is_completed?: boolean;
          completed_by?: string | null;
          completed_at?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['communications']['Insert']>;
        Relationships: [];
      };
      communication_notes: {
        Row: {
          id: string;
          communication_id: string;
          branch_id: string;
          author_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          communication_id: string;
          author_id?: string | null;
          body: string;
        };
        Update: Partial<Database['public']['Tables']['communication_notes']['Insert']>;
        Relationships: [];
      };
      communication_photos: {
        Row: {
          id: string;
          communication_id: string;
          branch_id: string;
          storage_path: string;
          name: string | null;
          caption: string | null;
          uploaded_by: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          communication_id: string;
          storage_path: string;
          name?: string | null;
          caption?: string | null;
          uploaded_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['communication_photos']['Insert']>;
        Relationships: [];
      };
      personal_notes: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          text: string;
          completed?: boolean;
        };
        Update: Partial<Database['public']['Tables']['personal_notes']['Insert']>;
        Relationships: [];
      };
      media_notes: {
        Row: {
          id: string;
          branch_id: string;
          storage_path: string;
          name: string;
          category: string;
          caption: string | null;
          uploaded_by: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          branch_id: string;
          storage_path: string;
          name: string;
          category?: string;
          caption?: string | null;
          uploaded_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['media_notes']['Insert']>;
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          branch_id: string;
          actor_id: string | null;
          entity_type: ActivityEntityType;
          task_id: string | null;
          communication_id: string | null;
          type: ActivityType;
          title: string;
          description: string;
          status_badge: string | null;
          created_at: string;
        };
        Insert: Record<string, never>; // activities are written exclusively by DB triggers
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: {
      top_performers: {
        Row: {
          profile_id: string;
          branch_id: string;
          name: string;
          role: string;
          avatar_url: string | null;
          task_count: number;
          rank: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_my_branch_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type BranchRow = Tables<'branches'>;
export type ProfileRow = Tables<'profiles'>;
export type TaskRow = Tables<'tasks'>;
export type TaskNoteRow = Tables<'task_notes'>;
export type TaskPhotoRow = Tables<'task_photos'>;
export type CommunicationRow = Tables<'communications'>;
export type CommunicationNoteRow = Tables<'communication_notes'>;
export type CommunicationPhotoRow = Tables<'communication_photos'>;
export type PersonalNoteRow = Tables<'personal_notes'>;
export type MediaNoteRow = Tables<'media_notes'>;
export type ActivityRow = Tables<'activities'>;
export type TopPerformerRow = Database['public']['Views']['top_performers']['Row'];
