export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.0.1 (cd38da5)';
  };
  public: {
    Tables: {
      badge_definitions: {
        Row: {
          badge_key: string;
          category: string;
          created_at: string;
          description: string;
          display_order: number;
          icon_name: string;
          id: string;
          name: string;
          requirement_label: string;
          requirement_type: string;
          requirement_value: number;
          share_message: string;
          verse_reference: string;
          verse_text: string;
        };
        Insert: {
          badge_key: string;
          category: string;
          created_at?: string;
          description: string;
          display_order?: number;
          icon_name: string;
          id?: string;
          name: string;
          requirement_label: string;
          requirement_type: string;
          requirement_value: number;
          share_message: string;
          verse_reference: string;
          verse_text: string;
        };
        Update: {
          badge_key?: string;
          category?: string;
          created_at?: string;
          description?: string;
          display_order?: number;
          icon_name?: string;
          id?: string;
          name?: string;
          requirement_label?: string;
          requirement_type?: string;
          requirement_value?: number;
          share_message?: string;
          verse_reference?: string;
          verse_text?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          completed_by: Json | null;
          created_at: string;
          deadline: string | null;
          deleted_at: string | null;
          description: string | null;
          goal_amount: number | null;
          id: string;
          participants: Json | null;
          picture_url: string | null;
          reward: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          completed_by?: Json | null;
          created_at?: string;
          deadline?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          goal_amount?: number | null;
          id?: string;
          participants?: Json | null;
          picture_url?: string | null;
          reward?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          completed_by?: Json | null;
          created_at?: string;
          deadline?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          goal_amount?: number | null;
          id?: string;
          participants?: Json | null;
          picture_url?: string | null;
          reward?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      churches: {
        Row: {
          background_image_url: string | null;
          confession_end_time: string | null;
          confession_occurrence:
            | Database['public']['Enums']['event_occurrance']
            | null;
          confession_start_time: string | null;
          created_at: string;
          description: string | null;
          eucharistic_adoration_end_time: string | null;
          eucharistic_adoration_occurrence:
            | Database['public']['Enums']['event_occurrance']
            | null;
          eucharistic_adoration_start_time: string | null;
          id: string;
          location: string | null;
          mass_duration_time: string | null;
          mass_occurrence:
            | Database['public']['Enums']['event_occurrance']
            | null;
          name: string;
          office_end_time: string | null;
          office_start_time: string | null;
          picture_url: string | null;
          rating_score: number | null;
          updated_at: string | null;
          website_url: string | null;
        };
        Insert: {
          background_image_url?: string | null;
          confession_end_time?: string | null;
          confession_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          confession_start_time?: string | null;
          created_at?: string;
          description?: string | null;
          eucharistic_adoration_end_time?: string | null;
          eucharistic_adoration_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          eucharistic_adoration_start_time?: string | null;
          id?: string;
          location?: string | null;
          mass_duration_time?: string | null;
          mass_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          name: string;
          office_end_time?: string | null;
          office_start_time?: string | null;
          picture_url?: string | null;
          rating_score?: number | null;
          updated_at?: string | null;
          website_url?: string | null;
        };
        Update: {
          background_image_url?: string | null;
          confession_end_time?: string | null;
          confession_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          confession_start_time?: string | null;
          created_at?: string;
          description?: string | null;
          eucharistic_adoration_end_time?: string | null;
          eucharistic_adoration_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          eucharistic_adoration_start_time?: string | null;
          id?: string;
          location?: string | null;
          mass_duration_time?: string | null;
          mass_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          name?: string;
          office_end_time?: string | null;
          office_start_time?: string | null;
          picture_url?: string | null;
          rating_score?: number | null;
          updated_at?: string | null;
          website_url?: string | null;
        };
        Relationships: [];
      };
      daily_scripture_cache: {
        Row: {
          created_at: string;
          failed_readings: Json;
          featured_verse_reference: string;
          featured_verse_text: string;
          fetch_status: string;
          id: number;
          liturgical_title: string;
          locale: string;
          readings: Json;
          scripture_date: string;
          season: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          failed_readings?: Json;
          featured_verse_reference?: string;
          featured_verse_text?: string;
          fetch_status?: string;
          id?: number;
          liturgical_title: string;
          locale: string;
          readings?: Json;
          scripture_date: string;
          season: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          failed_readings?: Json;
          featured_verse_reference?: string;
          featured_verse_text?: string;
          fetch_status?: string;
          id?: number;
          liturgical_title?: string;
          locale?: string;
          readings?: Json;
          scripture_date?: string;
          season?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_scripture_cron_runs: {
        Row: {
          created_at: string;
          error_message: string | null;
          failed_readings: Json;
          id: number;
          locale: string;
          scripture_date: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          failed_readings?: Json;
          id?: number;
          locale: string;
          scripture_date: string;
          status: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          failed_readings?: Json;
          id?: number;
          locale?: string;
          scripture_date?: string;
          status?: string;
        };
        Relationships: [];
      };
      event_messages: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          donation_amount: number | null;
          event_id: number | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          message: string | null;
          reply_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          donation_amount?: number | null;
          event_id?: number | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          message?: string | null;
          reply_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          donation_amount?: number | null;
          event_id?: number | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          message?: string | null;
          reply_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      event_messages_actions: {
        Row: {
          created_at: string;
          flagged: string | null;
          id: string;
          likes: Json | null;
        };
        Insert: {
          created_at?: string;
          flagged?: string | null;
          id: string;
          likes?: Json | null;
        };
        Update: {
          created_at?: string;
          flagged?: string | null;
          id?: string;
          likes?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_event_messages_actions_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'event_messages';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          attendees: Json | null;
          created_at: string;
          description: string | null;
          event_source: string | null;
          event_type: Database['public']['Enums']['event_type'] | null;
          id: number;
          keywords: string | null;
          language: Database['public']['Enums']['language'] | null;
          picture_url: string | null;
          price: number | null;
          slug: string | null;
          started_at: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          attendees?: Json | null;
          created_at?: string;
          description?: string | null;
          event_source?: string | null;
          event_type?: Database['public']['Enums']['event_type'] | null;
          id?: number;
          keywords?: string | null;
          language?: Database['public']['Enums']['language'] | null;
          picture_url?: string | null;
          price?: number | null;
          slug?: string | null;
          started_at?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          attendees?: Json | null;
          created_at?: string;
          description?: string | null;
          event_source?: string | null;
          event_type?: Database['public']['Enums']['event_type'] | null;
          id?: number;
          keywords?: string | null;
          language?: Database['public']['Enums']['language'] | null;
          picture_url?: string | null;
          price?: number | null;
          slug?: string | null;
          started_at?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'events_event_source_fkey';
            columns: ['event_source'];
            isOneToOne: false;
            referencedRelation: 'youtube';
            referencedColumns: ['id'];
          },
        ];
      };
      exam_consciousness: {
        Row: {
          commandment: number | null;
          description: string | null;
          for_adults: boolean | null;
          for_children: boolean | null;
          for_matrimonies: boolean | null;
          for_religious: boolean | null;
          for_teens: boolean | null;
          id: number;
          question: string | null;
          sin_type: Database['public']['Enums']['sin_type'] | null;
          statement: string | null;
          subject: string | null;
        };
        Insert: {
          commandment?: number | null;
          description?: string | null;
          for_adults?: boolean | null;
          for_children?: boolean | null;
          for_matrimonies?: boolean | null;
          for_religious?: boolean | null;
          for_teens?: boolean | null;
          id?: number;
          question?: string | null;
          sin_type?: Database['public']['Enums']['sin_type'] | null;
          statement?: string | null;
          subject?: string | null;
        };
        Update: {
          commandment?: number | null;
          description?: string | null;
          for_adults?: boolean | null;
          for_children?: boolean | null;
          for_matrimonies?: boolean | null;
          for_religious?: boolean | null;
          for_teens?: boolean | null;
          id?: number;
          question?: string | null;
          sin_type?: Database['public']['Enums']['sin_type'] | null;
          statement?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      friend_requests: {
        Row: {
          created_at: string;
          id: string;
          uuid1: string | null;
          uuid1_accepted: boolean | null;
          uuid2: string | null;
          uuid2_accepted: boolean | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          uuid1?: string | null;
          uuid1_accepted?: boolean | null;
          uuid2?: string | null;
          uuid2_accepted?: boolean | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          uuid1?: string | null;
          uuid1_accepted?: boolean | null;
          uuid2?: string | null;
          uuid2_accepted?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'friend_requests_friend_id_fkey';
            columns: ['uuid2'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friend_requests_user_id_fkey';
            columns: ['uuid1'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      friends: {
        Row: {
          created_at: string | null;
          id: string;
          is_favorite: boolean | null;
          uuid1: string;
          uuid2: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_favorite?: boolean | null;
          uuid1: string;
          uuid2: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_favorite?: boolean | null;
          uuid1?: string;
          uuid2?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Friends_friend_id_fkey';
            columns: ['uuid1'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Friends_user_id_fkey';
            columns: ['uuid2'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      global_prayer_sessions: {
        Row: {
          city: string;
          country_code: string;
          country_name: string | null;
          created_at: string;
          created_by: string | null;
          id: number;
          is_active: boolean;
          latitude: number;
          longitude: number;
          participants_count: number;
          prayer_type: string;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          city: string;
          country_code: string;
          country_name?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: never;
          is_active?: boolean;
          latitude: number;
          longitude: number;
          participants_count?: number;
          prayer_type: string;
          started_at?: string;
          updated_at?: string;
        };
        Update: {
          city?: string;
          country_code?: string;
          country_name?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: never;
          is_active?: boolean;
          latitude?: number;
          longitude?: number;
          participants_count?: number;
          prayer_type?: string;
          started_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'global_prayer_sessions_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          audience_age: Database['public']['Enums']['event_target_age'] | null;
          background_image_url: string | null;
          created_at: string;
          description: string | null;
          group_name: string;
          id: string;
          is_private: boolean | null;
          location: string | null;
          meeting_duration_length: number | null;
          meeting_duration_time: string | null;
          meeting_end_date: string | null;
          meeting_occurrence:
            | Database['public']['Enums']['event_occurrance']
            | null;
          meeting_start_date: string | null;
          picture_url: string | null;
          rating_score: number | null;
          target_audience:
            | Database['public']['Enums']['event_target_group']
            | null;
          user_id: string | null;
          website_url: string | null;
        };
        Insert: {
          audience_age?: Database['public']['Enums']['event_target_age'] | null;
          background_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          group_name: string;
          id?: string;
          is_private?: boolean | null;
          location?: string | null;
          meeting_duration_length?: number | null;
          meeting_duration_time?: string | null;
          meeting_end_date?: string | null;
          meeting_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          meeting_start_date?: string | null;
          picture_url?: string | null;
          rating_score?: number | null;
          target_audience?:
            | Database['public']['Enums']['event_target_group']
            | null;
          user_id?: string | null;
          website_url?: string | null;
        };
        Update: {
          audience_age?: Database['public']['Enums']['event_target_age'] | null;
          background_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          group_name?: string;
          id?: string;
          is_private?: boolean | null;
          location?: string | null;
          meeting_duration_length?: number | null;
          meeting_duration_time?: string | null;
          meeting_end_date?: string | null;
          meeting_occurrence?:
            | Database['public']['Enums']['event_occurrance']
            | null;
          meeting_start_date?: string | null;
          picture_url?: string | null;
          rating_score?: number | null;
          target_audience?:
            | Database['public']['Enums']['event_target_group']
            | null;
          user_id?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'groups_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      leaderboard_config: {
        Row: {
          key: string;
          value: Json;
        };
        Insert: {
          key: string;
          value: Json;
        };
        Update: {
          key?: string;
          value?: Json;
        };
        Relationships: [];
      };
      leaderboard_history: {
        Row: {
          created_at: string;
          id: number;
          rank: number;
          snapshot_data: Json | null;
          total_xp: number;
          user_id: string;
          week_start: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          rank: number;
          snapshot_data?: Json | null;
          total_xp?: number;
          user_id: string;
          week_start: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          rank?: number;
          snapshot_data?: Json | null;
          total_xp?: number;
          user_id?: string;
          week_start?: string;
        };
        Relationships: [];
      };
      leaderboards_weekly: {
        Row: {
          created_at: string;
          id: number;
          invites_count: number;
          rank: number;
          rosaries_count: number;
          streak_days: number;
          total_xp: number;
          user_id: string;
          week_end: string;
          week_start: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          invites_count?: number;
          rank?: number;
          rosaries_count?: number;
          streak_days?: number;
          total_xp?: number;
          user_id: string;
          week_end: string;
          week_start: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          invites_count?: number;
          rank?: number;
          rosaries_count?: number;
          streak_days?: number;
          total_xp?: number;
          user_id?: string;
          week_end?: string;
          week_start?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leaderboards_weekly_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_settings: {
        Row: {
          created_at: string | null;
          daily_reminder_time: string;
          enabled: boolean | null;
          id: string;
          streak_protection: boolean | null;
          streak_reminder_hours_before: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          daily_reminder_time?: string;
          enabled?: boolean | null;
          id?: string;
          streak_protection?: boolean | null;
          streak_reminder_hours_before?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          daily_reminder_time?: string;
          enabled?: boolean | null;
          id?: string;
          streak_protection?: boolean | null;
          streak_reminder_hours_before?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_settings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          author: string;
          content: Json;
          created_at: string;
          id: string;
          keywords: string | null;
          published_at: string | null;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          author: string;
          content: Json;
          created_at?: string;
          id?: string;
          keywords?: string | null;
          published_at?: string | null;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          author?: string;
          content?: Json;
          created_at?: string;
          id?: string;
          keywords?: string | null;
          published_at?: string | null;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      prayer_locations: {
        Row: {
          active_users: number;
          city: string;
          country_code: string;
          country_name: string;
          id: number;
          last_updated: string;
          latitude: number;
          live_sessions: number;
          longitude: number;
          prayer_count: number;
        };
        Insert: {
          active_users?: number;
          city: string;
          country_code: string;
          country_name: string;
          id?: number;
          last_updated?: string;
          latitude: number;
          live_sessions?: number;
          longitude: number;
          prayer_count?: number;
        };
        Update: {
          active_users?: number;
          city?: string;
          country_code?: string;
          country_name?: string;
          id?: number;
          last_updated?: string;
          latitude?: number;
          live_sessions?: number;
          longitude?: number;
          prayer_count?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          birth_date: string | null;
          city: string | null;
          created_at: string | null;
          first_name: string | null;
          gender: string | null;
          id: string;
          invited_by: string | null;
          language: string | null;
          last_name: string | null;
          picture_url: string | null;
          role: string;
          rosary_count: number | null;
          rosary_streak: number;
          state: string | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          birth_date?: string | null;
          city?: string | null;
          created_at?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id: string;
          invited_by?: string | null;
          language?: string | null;
          last_name?: string | null;
          picture_url?: string | null;
          role?: string;
          rosary_count?: number | null;
          rosary_streak?: number;
          state?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          birth_date?: string | null;
          city?: string | null;
          created_at?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: string;
          invited_by?: string | null;
          language?: string | null;
          last_name?: string | null;
          picture_url?: string | null;
          role?: string;
          rosary_count?: number | null;
          rosary_streak?: number;
          state?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          created_at: string | null;
          id: string;
          subscription: Json;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          subscription: Json;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          subscription?: Json;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'push_subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      rosary_stats: {
        Row: {
          completed_at: string;
          created_at: string | null;
          id: string;
          join_rosary_user_id: string | null;
          user_id: string;
        };
        Insert: {
          completed_at: string;
          created_at?: string | null;
          id?: string;
          join_rosary_user_id?: string | null;
          user_id?: string;
        };
        Update: {
          completed_at?: string;
          created_at?: string | null;
          id?: string;
          join_rosary_user_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'rosary_stats_join_rosary_user_id_fkey';
            columns: ['join_rosary_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rosary_stats_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      scripture_completions: {
        Row: {
          completed_at: string;
          id: number;
          liturgical_date: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          id?: number;
          liturgical_date: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          id?: number;
          liturgical_date?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          badge_key: string;
          created_at: string;
          earned_at: string;
          id: string;
          shared_at: string | null;
          user_id: string;
        };
        Insert: {
          badge_key: string;
          created_at?: string;
          earned_at?: string;
          id?: string;
          shared_at?: string | null;
          user_id: string;
        };
        Update: {
          badge_key?: string;
          created_at?: string;
          earned_at?: string;
          id?: string;
          shared_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_badges_badge_key_fkey';
            columns: ['badge_key'];
            isOneToOne: false;
            referencedRelation: 'badge_definitions';
            referencedColumns: ['badge_key'];
          },
          {
            foreignKeyName: 'user_badges_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_milestones: {
        Row: {
          acknowledged_at: string;
          created_at: string;
          milestone_id: string;
          user_id: string;
        };
        Insert: {
          acknowledged_at?: string;
          created_at?: string;
          milestone_id: string;
          user_id: string;
        };
        Update: {
          acknowledged_at?: string;
          created_at?: string;
          milestone_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_milestones_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_xp: {
        Row: {
          created_at: string;
          current_level: number;
          current_title: string;
          id: string;
          total_xp: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_level?: number;
          current_title?: string;
          id?: string;
          total_xp?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_level?: number;
          current_title?: string;
          id?: string;
          total_xp?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_xp_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      xp_events: {
        Row: {
          created_at: string;
          id: number;
          idempotency_key: string | null;
          metadata: Json;
          type: string;
          user_id: string;
          xp_amount: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          idempotency_key?: string | null;
          metadata?: Json;
          type: string;
          user_id: string;
          xp_amount: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          idempotency_key?: string | null;
          metadata?: Json;
          type?: string;
          user_id?: string;
          xp_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'xp_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      xp_levels_config: {
        Row: {
          badge_key: string | null;
          created_at: string;
          level: number;
          min_xp: number;
          title: string;
        };
        Insert: {
          badge_key?: string | null;
          created_at?: string;
          level: number;
          min_xp: number;
          title: string;
        };
        Update: {
          badge_key?: string | null;
          created_at?: string;
          level?: number;
          min_xp?: number;
          title?: string;
        };
        Relationships: [];
      };
      xp_rules: {
        Row: {
          action_type: string;
          created_at: string;
          description: string | null;
          is_active: boolean;
          optional_conditions: Json;
          updated_at: string;
          xp_value: number;
        };
        Insert: {
          action_type: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          optional_conditions?: Json;
          updated_at?: string;
          xp_value: number;
        };
        Update: {
          action_type?: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          optional_conditions?: Json;
          updated_at?: string;
          xp_value?: number;
        };
        Relationships: [];
      };
      youtube: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          title: string | null;
          video_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string | null;
          video_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string | null;
          video_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      latest_event: {
        Row: {
          id: number | null;
          started_at: string | null;
        };
        Relationships: [];
      };
      prayer_locations_by_country: {
        Row: {
          active_users: number | null;
          country_code: string | null;
          country_name: string | null;
          last_updated: string | null;
          live_sessions: number | null;
          prayer_count: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      admin_retention_d1: { Args: never; Returns: number };
      admin_retention_d30: { Args: never; Returns: number };
      admin_retention_d7: { Args: never; Returns: number };
      award_xp: {
        Args: {
          p_action_type: string;
          p_idempotency_key?: string;
          p_metadata?: Json;
          p_user_id: string;
        };
        Returns: Json;
      };
      calculate_xp_level: {
        Args: { p_total_xp: number };
        Returns: {
          level: number;
          min_xp: number;
          next_level: number;
          next_min_xp: number;
          next_title: string;
          title: string;
        }[];
      };
      ensure_user_xp_row: { Args: { p_user_id: string }; Returns: undefined };
      get_all_rosary_count: { Args: never; Returns: number };
      get_prayer_map_cities: {
        Args: never;
        Returns: {
          active_users: number;
          city: string;
          country_code: string;
          country_name: string;
          id: number;
          last_updated: string;
          latitude: number;
          live_sessions: number;
          longitude: number;
          prayer_count: number;
        }[];
        SetofOptions: {
          from: '*';
          to: 'prayer_locations';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_profiles_by_user_ids: {
        Args: { user_ids: string[] };
        Returns: {
          first_name: string;
          id: string;
          last_name: string;
          picture_url: string;
          rosary_count: number;
        }[];
      };
      get_top_10_user_ids: {
        Args: never;
        Returns: {
          user_count: number;
          user_id: string;
        }[];
      };
      get_top_10_user_profile: {
        Args: never;
        Returns: {
          first_name: string;
          last_name: string;
          picture_url: string;
          user_count: number;
          user_id: string;
        }[];
      };
      get_user_achievement_dashboard: {
        Args: { target_user_id?: string };
        Returns: Json;
      };
      get_weekly_leaderboard: {
        Args: { p_limit?: number; p_week_end: string; p_week_start: string };
        Returns: {
          first_name: string;
          invites_count: number;
          last_name: string;
          picture_url: string;
          rank: number;
          rosaries_count: number;
          streak_days: number;
          total_xp: number;
          user_id: string;
        }[];
      };
      get_weekly_leaderboard_me: {
        Args: {
          p_neighbors?: number;
          p_user_id: string;
          p_week_end: string;
          p_week_start: string;
        };
        Returns: {
          first_name: string;
          invites_count: number;
          is_current_user: boolean;
          last_name: string;
          picture_url: string;
          rank: number;
          rosaries_count: number;
          streak_days: number;
          total_xp: number;
          user_id: string;
        }[];
      };
      increment_prayer_count: {
        Args: {
          p_city: string;
          p_country_code: string;
          p_country_name: string;
          p_increment?: number;
          p_latitude: number;
          p_longitude: number;
        };
        Returns: undefined;
      };
      insert_into_rosary_stats: {
        Args: {
          p_completed_at: string;
          p_join_rosary_user_id: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      join_global_prayer_session: {
        Args: { p_session_id: number };
        Returns: number;
      };
      search_profiles: {
        Args: { search_text: string };
        Returns: {
          first_name: string;
          id: string;
          last_name: string;
        }[];
      };
      snapshot_weekly_leaderboard: {
        Args: { p_week_end: string; p_week_start: string };
        Returns: undefined;
      };
      upsert_global_prayer_session: {
        Args: {
          p_city: string;
          p_country_code: string;
          p_country_name: string;
          p_created_by?: string;
          p_latitude: number;
          p_longitude: number;
          p_prayer_type: string;
        };
        Returns: number;
      };
    };
    Enums: {
      event_occurrance:
        | 'weekly'
        | 'daily'
        | 'bi_weekly'
        | 'monthly'
        | 'quarterly'
        | 'annually'
        | 'on_demand';
      event_target_age:
        | 'all'
        | 'children'
        | 'adolescents'
        | 'adults'
        | 'seniors'
        | 'custom'
        | 'young_adults';
      event_target_group:
        | 'married'
        | 'single'
        | 'cohabiting'
        | 'separated'
        | 'widowed'
        | 'all';
      event_type:
        | 'youtube_video'
        | 'cultural_arts'
        | 'educational'
        | 'social_community'
        | 'sports_recreation'
        | 'political_civic'
        | 'business_networking'
        | 'holiday_seasonal'
        | 'health_wellness'
        | 'miscellaneous'
        | 'online';
      gender: 'male' | 'female';
      language: 'en' | 'es';
      sin_type: 'mortal' | 'venial' | 'both';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      event_occurrance: [
        'weekly',
        'daily',
        'bi_weekly',
        'monthly',
        'quarterly',
        'annually',
        'on_demand',
      ],
      event_target_age: [
        'all',
        'children',
        'adolescents',
        'adults',
        'seniors',
        'custom',
        'young_adults',
      ],
      event_target_group: [
        'married',
        'single',
        'cohabiting',
        'separated',
        'widowed',
        'all',
      ],
      event_type: [
        'youtube_video',
        'cultural_arts',
        'educational',
        'social_community',
        'sports_recreation',
        'political_civic',
        'business_networking',
        'holiday_seasonal',
        'health_wellness',
        'miscellaneous',
        'online',
      ],
      gender: ['male', 'female'],
      language: ['en', 'es'],
      sin_type: ['mortal', 'venial', 'both'],
    },
  },
} as const;
