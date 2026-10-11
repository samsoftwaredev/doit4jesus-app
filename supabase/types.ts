export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  api: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      abandon_demon_encounter: {
        Args: { p_encounter_id: string; p_idempotency_key: string };
        Returns: Json;
      };
      award_user_xp: {
        Args: { p_occurred_at?: string; p_points: number; p_user_id: string };
        Returns: Json;
      };
      cancel_current_user_friend_request: {
        Args: { p_request_id: string };
        Returns: Json;
      };
      check_username_availability: {
        Args: { p_usernames: string[] };
        Returns: {
          is_available: boolean;
          username: string;
        }[];
      };
      claim_challenge_reward: {
        Args: { p_assignment_id: string; p_idempotency_key: string };
        Returns: Json;
      };
      complete_current_user_profile_setup: {
        Args: {
          p_country_code: string;
          p_display_name: string;
          p_gender: string;
          p_username: string;
        };
        Returns: Json;
      };
      complete_daily_scripture: {
        Args: { p_idempotency_key: string; p_reading_date: string };
        Returns: Json;
      };
      complete_demon_defense: {
        Args: {
          p_assignment_id: string;
          p_encounter_id: string;
          p_idempotency_key: string;
        };
        Returns: Json;
      };
      delete_current_user_account: { Args: never; Returns: undefined };
      delete_user_account: { Args: { p_user_id: string }; Returns: undefined };
      get_admin_app_metrics: { Args: never; Returns: Json };
      get_current_user_friend_details: {
        Args: { p_friend_id: string; p_include_rosary_streak?: boolean };
        Returns: Json;
      };
      get_current_user_friend_details_base: {
        Args: { p_friend_id: string; p_include_rosary_streak?: boolean };
        Returns: Json;
      };
      get_current_user_friends_comparison: {
        Args: {
          p_limit?: number;
          p_offset?: number;
          p_period_code?: string;
          p_period_type?: string;
        };
        Returns: Json;
      };
      get_current_user_friends_comparison_base: {
        Args: {
          p_limit?: number;
          p_offset?: number;
          p_period_code?: string;
          p_period_type?: string;
        };
        Returns: Json;
      };
      get_current_user_friends_leaderboard: {
        Args: {
          p_limit?: number;
          p_offset?: number;
          p_period_code?: string;
          p_period_type?: string;
        };
        Returns: Json;
      };
      get_current_user_friends_leaderboard_base: {
        Args: {
          p_limit?: number;
          p_offset?: number;
          p_period_code?: string;
          p_period_type?: string;
        };
        Returns: Json;
      };
      get_global_rosary_stats: { Args: never; Returns: Json };
      get_my_daily_rosary_reminder: { Args: never; Returns: Json };
      get_my_daily_scripture_completion: {
        Args: { p_reading_date: string };
        Returns: Json;
      };
      get_my_rosary_completion: {
        Args: { p_month?: number; p_year?: number };
        Returns: Json;
      };
      get_my_rosary_stats: { Args: never; Returns: Json };
      get_my_rosary_streak: { Args: never; Returns: Json };
      initialize_user_virtues: {
        Args: { p_user_id: string };
        Returns: undefined;
      };
      link_current_user_church: {
        Args: { p_church_id: string; p_is_primary?: boolean };
        Returns: Json;
      };
      list_current_user_friend_requests: {
        Args: {
          p_direction?: string;
          p_limit?: number;
          p_offset?: number;
          p_status?: string;
        };
        Returns: {
          avatar_url: string;
          cancelled_at: string;
          country_code: string;
          created_at: string;
          direction: string;
          display_name: string;
          id: string;
          responded_at: string;
          status: string;
          title: string;
          user_id: string;
          username: string;
        }[];
      };
      list_current_user_friend_requests_base: {
        Args: {
          p_direction?: string;
          p_limit?: number;
          p_offset?: number;
          p_status?: string;
        };
        Returns: {
          avatar_url: string;
          cancelled_at: string;
          created_at: string;
          direction: string;
          display_name: string;
          id: string;
          responded_at: string;
          status: string;
          title: string;
          user_id: string;
          username: string;
        }[];
      };
      list_current_user_friends: {
        Args: {
          p_include_rosary_streak?: boolean;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          avatar_url: string;
          badge_count: number;
          country_code: string;
          current_level: number;
          display_name: string;
          friend_id: string;
          friends_since: string;
          level_code: string;
          level_name: string;
          rosary_streak: Json;
          rosary_total: number;
          title: string;
          total_xp: number;
          username: string;
        }[];
      };
      list_current_user_friends_base: {
        Args: {
          p_include_rosary_streak?: boolean;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          avatar_url: string;
          badge_count: number;
          current_level: number;
          display_name: string;
          friend_id: string;
          friends_since: string;
          level_code: string;
          level_name: string;
          rosary_streak: Json;
          rosary_total: number;
          title: string;
          total_xp: number;
          username: string;
        }[];
      };
      reconcile_badge_requirement_progress: {
        Args: { p_user_id?: string };
        Returns: Json;
      };
      record_prayer_intention_prayer: {
        Args: { p_intention_id: string };
        Returns: Json;
      };
      record_spiritual_activity: {
        Args: {
          p_activity_code: string;
          p_completed_at?: string;
          p_country_code?: string;
          p_duration_seconds?: number;
          p_idempotency_key?: string;
          p_metadata?: Json;
          p_occurred_at: string;
          p_quantity?: number;
        };
        Returns: Json;
      };
      refresh_badge_requirement_progress: {
        Args: { p_activity_id: string; p_user_id: string };
        Returns: Json;
      };
      review_church_change_request: {
        Args: {
          p_decision: string;
          p_rejection_reason?: string;
          p_request_id: string;
        };
        Returns: Json;
      };
      review_current_user_friend_request: {
        Args: { p_decision: string; p_request_id: string };
        Returns: Json;
      };
      review_prayer_intention: {
        Args: { p_decision: string; p_intention_id: string };
        Returns: Json;
      };
      search_churches: {
        Args: {
          p_city?: string;
          p_country_code?: string;
          p_diocese?: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          city: string;
          country_code: string;
          diocese_name: string;
          id: string;
          latitude: number;
          longitude: number;
          name: string;
          region_name: string;
          timezone: string;
        }[];
      };
      search_countries: {
        Args: { p_limit?: number; p_offset?: number; p_query?: string };
        Returns: {
          code: string;
          latitude: number;
          longitude: number;
          name: string;
        }[];
      };
      search_users: {
        Args: { p_limit?: number; p_offset?: number; p_query: string };
        Returns: {
          avatar_url: string;
          relationship_state: string;
          title: string;
          username: string;
        }[];
      };
      send_current_user_friend_request: {
        Args: { p_username: string };
        Returns: Json;
      };
      set_current_user_primary_church: {
        Args: { p_church_id: string };
        Returns: Json;
      };
      start_demon_encounter: {
        Args: { p_demon_code: string; p_idempotency_key: string };
        Returns: Json;
      };
      unfriend_current_user: { Args: { p_friend_id: string }; Returns: Json };
      unlink_current_user_church: {
        Args: { p_church_id: string };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  app: {
    Tables: {
      church_change_requests: {
        Row: {
          church_id: string | null;
          created_at: string;
          id: string;
          notes: string | null;
          proposed_church: Json;
          proposed_service_times: Json;
          rejection_reason: string | null;
          request_type: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          submitted_by: string;
          updated_at: string;
        };
        Insert: {
          church_id?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          proposed_church?: Json;
          proposed_service_times?: Json;
          rejection_reason?: string | null;
          request_type: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          submitted_by: string;
          updated_at?: string;
        };
        Update: {
          church_id?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          proposed_church?: Json;
          proposed_service_times?: Json;
          rejection_reason?: string | null;
          request_type?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          submitted_by?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "church_change_requests_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "church_change_requests_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "church_change_requests_submitted_by_fkey";
            columns: ["submitted_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      church_service_times: {
        Row: {
          church_id: string;
          created_at: string;
          ends_at: string | null;
          id: string;
          service_type: string;
          starts_at: string;
          updated_at: string;
          weekday: number;
        };
        Insert: {
          church_id: string;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          service_type: string;
          starts_at: string;
          updated_at?: string;
          weekday: number;
        };
        Update: {
          church_id?: string;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          service_type?: string;
          starts_at?: string;
          updated_at?: string;
          weekday?: number;
        };
        Relationships: [
          {
            foreignKeyName: "church_service_times_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          },
        ];
      };
      churches: {
        Row: {
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          country_code: string;
          created_at: string;
          diocese_id: string | null;
          id: string;
          is_active: boolean;
          latitude: number;
          longitude: number;
          name: string;
          postal_code: string | null;
          region_name: string | null;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          country_code: string;
          created_at?: string;
          diocese_id?: string | null;
          id?: string;
          is_active?: boolean;
          latitude: number;
          longitude: number;
          name: string;
          postal_code?: string | null;
          region_name?: string | null;
          timezone: string;
          updated_at?: string;
        };
        Update: {
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          country_code?: string;
          created_at?: string;
          diocese_id?: string | null;
          id?: string;
          is_active?: boolean;
          latitude?: number;
          longitude?: number;
          name?: string;
          postal_code?: string | null;
          region_name?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "churches_country_code_fkey";
            columns: ["country_code"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "churches_diocese_id_fkey";
            columns: ["diocese_id"];
            isOneToOne: false;
            referencedRelation: "dioceses";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_requests: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          other_subject: string | null;
          status: string;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          other_subject?: string | null;
          status?: string;
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          other_subject?: string | null;
          status?: string;
          subject?: string;
        };
        Relationships: [];
      };
      countries: {
        Row: {
          code: string;
          is_active: boolean;
          latitude: number | null;
          longitude: number | null;
          name: string;
        };
        Insert: {
          code: string;
          is_active?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          name: string;
        };
        Update: {
          code?: string;
          is_active?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
        };
        Relationships: [];
      };
      deleted_account_rosary_totals: {
        Row: {
          rosaries_prayed: number;
          singleton: boolean;
        };
        Insert: {
          rosaries_prayed?: number;
          singleton?: boolean;
        };
        Update: {
          rosaries_prayed?: number;
          singleton?: boolean;
        };
        Relationships: [];
      };
      dioceses: {
        Row: {
          country_code: string;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          country_code: string;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          country_code?: string;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dioceses_country_code_fkey";
            columns: ["country_code"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["code"];
          },
        ];
      };
      examination_of_conscience_questions: {
        Row: {
          category: string;
          commandment: number;
          counsels: string[];
          created_at: string;
          description: string;
          id: string;
          is_active: boolean;
          prevention: string[];
          question: string;
          saints: string[];
          severity: string;
          title: string;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          category: string;
          commandment: number;
          counsels: string[];
          created_at?: string;
          description: string;
          id?: string;
          is_active?: boolean;
          prevention: string[];
          question: string;
          saints: string[];
          severity: string;
          title: string;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          category?: string;
          commandment?: number;
          counsels?: string[];
          created_at?: string;
          description?: string;
          id?: string;
          is_active?: boolean;
          prevention?: string[];
          question?: string;
          saints?: string[];
          severity?: string;
          title?: string;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      friend_requests: {
        Row: {
          cancelled_at: string | null;
          created_at: string;
          id: string;
          recipient_id: string;
          requester_id: string;
          responded_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          cancelled_at?: string | null;
          created_at?: string;
          id?: string;
          recipient_id: string;
          requester_id: string;
          responded_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          cancelled_at?: string | null;
          created_at?: string;
          id?: string;
          recipient_id?: string;
          requester_id?: string;
          responded_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friend_requests_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friend_requests_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      friendships: {
        Row: {
          created_at: string;
          id: string;
          user_high_id: string;
          user_low_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_high_id: string;
          user_low_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          user_high_id?: string;
          user_low_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friendships_user_high_id_fkey";
            columns: ["user_high_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friendships_user_low_id_fkey";
            columns: ["user_low_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_preferences: {
        Row: {
          confession_reminder: boolean;
          created_at: string;
          daily_rosary_reminder: boolean;
          eucharistic_adoration: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          confession_reminder?: boolean;
          created_at?: string;
          daily_rosary_reminder?: boolean;
          eucharistic_adoration?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          confession_reminder?: boolean;
          created_at?: string;
          daily_rosary_reminder?: boolean;
          eucharistic_adoration?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          action_url: string | null;
          body: string | null;
          created_at: string;
          id: string;
          notification_type: string;
          payload: Json;
          read_at: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          action_url?: string | null;
          body?: string | null;
          created_at?: string;
          id?: string;
          notification_type: string;
          payload?: Json;
          read_at?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          action_url?: string | null;
          body?: string | null;
          created_at?: string;
          id?: string;
          notification_type?: string;
          payload?: Json;
          read_at?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_churches: {
        Row: {
          church_id: string;
          is_primary: boolean;
          linked_at: string;
          user_id: string;
        };
        Insert: {
          church_id: string;
          is_primary?: boolean;
          linked_at?: string;
          user_id: string;
        };
        Update: {
          church_id?: string;
          is_primary?: boolean;
          linked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_churches_church_id_fkey";
            columns: ["church_id"];
            isOneToOne: false;
            referencedRelation: "churches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_churches_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          country_code: string | null;
          created_at: string;
          display_name: string | null;
          gender: string | null;
          leaderboard_visibility: string;
          prayer_map_visibility: string;
          preferred_language: string;
          profile_setup_completed_at: string | null;
          saint_avatar_id: string | null;
          timezone: string;
          title: string | null;
          updated_at: string;
          user_id: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          country_code?: string | null;
          created_at?: string;
          display_name?: string | null;
          gender?: string | null;
          leaderboard_visibility?: string;
          prayer_map_visibility?: string;
          preferred_language?: string;
          profile_setup_completed_at?: string | null;
          saint_avatar_id?: string | null;
          timezone?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          country_code?: string | null;
          created_at?: string;
          display_name?: string | null;
          gender?: string | null;
          leaderboard_visibility?: string;
          prayer_map_visibility?: string;
          preferred_language?: string;
          profile_setup_completed_at?: string | null;
          saint_avatar_id?: string | null;
          timezone?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          granted_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          granted_at?: string;
          role: string;
          user_id: string;
        };
        Update: {
          granted_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          email: string | null;
          email_verified_at: string | null;
          id: string;
          last_login_at: string | null;
          password_hash: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          email_verified_at?: string | null;
          id?: string;
          last_login_at?: string | null;
          password_hash?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          email_verified_at?: string | null;
          id?: string;
          last_login_at?: string | null;
          password_hash?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      leaderboard_profiles: {
        Row: {
          avatar_url: string | null;
          country_code: string | null;
          display_name: string | null;
          saint_avatar_id: string | null;
          title: string | null;
          user_id: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: never;
          country_code?: string | null;
          display_name?: never;
          saint_avatar_id?: never;
          title?: never;
          user_id?: string | null;
          username?: never;
        };
        Update: {
          avatar_url?: never;
          country_code?: string | null;
          display_name?: never;
          saint_avatar_id?: never;
          title?: never;
          user_id?: string | null;
          username?: never;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      are_users_friends: {
        Args: { p_first_user_id: string; p_second_user_id: string };
        Returns: boolean;
      };
      calculate_user_rosary_streak: {
        Args: { p_timezone: string; p_user_id: string };
        Returns: Json;
      };
      is_current_user_admin: { Args: never; Returns: boolean };
      profile_country_code_jsonb: { Args: { p_user_id: string }; Returns: Json };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  competition: {
    Tables: {
      activity_definitions: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          description: string | null;
          is_active: boolean;
          is_repeatable: boolean;
          name: string;
          requires_duration: boolean;
          requires_verification: boolean;
          updated_at: string;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          is_repeatable?: boolean;
          name: string;
          requires_duration?: boolean;
          requires_verification?: boolean;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          description?: string | null;
          is_active?: boolean;
          is_repeatable?: boolean;
          name?: string;
          requires_duration?: boolean;
          requires_verification?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      badge_definitions: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          description: string | null;
          icon_url: string;
          id: string;
          is_active: boolean;
          is_repeatable: boolean;
          is_shareable: boolean;
          locked_icon_url: string | null;
          name: string;
          points_reward: number;
          rarity: string;
          requirement_type: string | null;
          requirement_value: number | null;
          rules: Json;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string;
          description?: string | null;
          icon_url: string;
          id?: string;
          is_active?: boolean;
          is_repeatable?: boolean;
          is_shareable?: boolean;
          locked_icon_url?: string | null;
          name: string;
          points_reward?: number;
          rarity?: string;
          requirement_type?: string | null;
          requirement_value?: number | null;
          rules?: Json;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          description?: string | null;
          icon_url?: string;
          id?: string;
          is_active?: boolean;
          is_repeatable?: boolean;
          is_shareable?: boolean;
          locked_icon_url?: string | null;
          name?: string;
          points_reward?: number;
          rarity?: string;
          requirement_type?: string | null;
          requirement_value?: number | null;
          rules?: Json;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      badge_requirement_activity_rules: {
        Row: {
          activity_code: string;
          badge_requirement_id: string;
          created_at: string;
          metadata_filter: Json;
          progress_mode: string;
          updated_at: string;
        };
        Insert: {
          activity_code: string;
          badge_requirement_id: string;
          created_at?: string;
          metadata_filter?: Json;
          progress_mode: string;
          updated_at?: string;
        };
        Update: {
          activity_code?: string;
          badge_requirement_id?: string;
          created_at?: string;
          metadata_filter?: Json;
          progress_mode?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "badge_requirement_activity_rules_activity_code_fkey";
            columns: ["activity_code"];
            isOneToOne: false;
            referencedRelation: "activity_definitions";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "badge_requirement_activity_rules_badge_requirement_id_fkey";
            columns: ["badge_requirement_id"];
            isOneToOne: true;
            referencedRelation: "badge_requirement_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      badge_requirement_definitions: {
        Row: {
          badge_id: string;
          created_at: string;
          description: string;
          display_order: number;
          id: string;
          required_value: number;
          requirement_type: string;
          rules: Json;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          badge_id: string;
          created_at?: string;
          description: string;
          display_order: number;
          id?: string;
          required_value: number;
          requirement_type: string;
          rules?: Json;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          badge_id?: string;
          created_at?: string;
          description?: string;
          display_order?: number;
          id?: string;
          required_value?: number;
          requirement_type?: string;
          rules?: Json;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "badge_requirement_definitions_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badge_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      badge_shares: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          platform: string | null;
          revoked_at: string | null;
          share_token: string;
          user_badge_id: string;
          visibility: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          platform?: string | null;
          revoked_at?: string | null;
          share_token: string;
          user_badge_id: string;
          visibility?: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          platform?: string | null;
          revoked_at?: string | null;
          share_token?: string;
          user_badge_id?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "badge_shares_user_badge_id_fkey";
            columns: ["user_badge_id"];
            isOneToOne: false;
            referencedRelation: "user_badges";
            referencedColumns: ["id"];
          },
        ];
      };
      challenge_definitions: {
        Row: {
          activity_code: string | null;
          assignment_weight: number;
          badge_reward_id: string | null;
          challenge_type: string;
          code: string;
          created_at: string;
          description: string | null;
          difficulty: string;
          ends_at: string | null;
          icon_url: string | null;
          id: string;
          is_active: boolean;
          rules: Json;
          starts_at: string | null;
          target_quantity: number;
          title: string;
          translations: Json;
          updated_at: string;
          xp_reward: number;
        };
        Insert: {
          activity_code?: string | null;
          assignment_weight?: number;
          badge_reward_id?: string | null;
          challenge_type: string;
          code: string;
          created_at?: string;
          description?: string | null;
          difficulty?: string;
          ends_at?: string | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean;
          rules?: Json;
          starts_at?: string | null;
          target_quantity?: number;
          title: string;
          translations?: Json;
          updated_at?: string;
          xp_reward?: number;
        };
        Update: {
          activity_code?: string | null;
          assignment_weight?: number;
          badge_reward_id?: string | null;
          challenge_type?: string;
          code?: string;
          created_at?: string;
          description?: string | null;
          difficulty?: string;
          ends_at?: string | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean;
          rules?: Json;
          starts_at?: string | null;
          target_quantity?: number;
          title?: string;
          translations?: Json;
          updated_at?: string;
          xp_reward?: number;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_definitions_activity_code_fkey";
            columns: ["activity_code"];
            isOneToOne: false;
            referencedRelation: "activity_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      challenge_progress_events: {
        Row: {
          activity_id: string | null;
          assignment_id: string;
          id: string;
          idempotency_key: string;
          increment_amount: number;
          occurred_at: string;
          previous_progress: number;
          resulting_progress: number;
        };
        Insert: {
          activity_id?: string | null;
          assignment_id: string;
          id?: string;
          idempotency_key: string;
          increment_amount: number;
          occurred_at?: string;
          previous_progress: number;
          resulting_progress: number;
        };
        Update: {
          activity_id?: string | null;
          assignment_id?: string;
          id?: string;
          idempotency_key?: string;
          increment_amount?: number;
          occurred_at?: string;
          previous_progress?: number;
          resulting_progress?: number;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_progress_events_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: false;
            referencedRelation: "spiritual_activities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "challenge_progress_events_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "user_challenge_assignments";
            referencedColumns: ["id"];
          },
        ];
      };
      demon_attacks: {
        Row: {
          code: string;
          created_at: string;
          demon_id: string;
          description: string;
          id: string;
          name: string;
          target_virtue_code: string;
          translations: Json;
          updated_at: string;
          virtue_decrease: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          demon_id: string;
          description: string;
          id?: string;
          name: string;
          target_virtue_code: string;
          translations?: Json;
          updated_at?: string;
          virtue_decrease: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          demon_id?: string;
          description?: string;
          id?: string;
          name?: string;
          target_virtue_code?: string;
          translations?: Json;
          updated_at?: string;
          virtue_decrease?: number;
        };
        Relationships: [
          {
            foreignKeyName: "demon_attacks_demon_id_fkey";
            columns: ["demon_id"];
            isOneToOne: false;
            referencedRelation: "demon_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_attacks_target_virtue_code_fkey";
            columns: ["target_virtue_code"];
            isOneToOne: false;
            referencedRelation: "virtue_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      demon_battle_events: {
        Row: {
          attack_id: string | null;
          created_at: string;
          defense_assignment_id: string | null;
          demon_damage: number;
          encounter_id: string;
          event_type: string;
          id: string;
          idempotency_key: string;
          metadata: Json;
          occurred_at: string;
          previous_hp: number;
          resulting_hp: number;
          virtue_event_id: string;
        };
        Insert: {
          attack_id?: string | null;
          created_at?: string;
          defense_assignment_id?: string | null;
          demon_damage?: number;
          encounter_id: string;
          event_type: string;
          id?: string;
          idempotency_key: string;
          metadata?: Json;
          occurred_at?: string;
          previous_hp: number;
          resulting_hp: number;
          virtue_event_id: string;
        };
        Update: {
          attack_id?: string | null;
          created_at?: string;
          defense_assignment_id?: string | null;
          demon_damage?: number;
          encounter_id?: string;
          event_type?: string;
          id?: string;
          idempotency_key?: string;
          metadata?: Json;
          occurred_at?: string;
          previous_hp?: number;
          resulting_hp?: number;
          virtue_event_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "demon_battle_events_attack_id_fkey";
            columns: ["attack_id"];
            isOneToOne: false;
            referencedRelation: "demon_attacks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_battle_events_defense_assignment_id_fkey";
            columns: ["defense_assignment_id"];
            isOneToOne: false;
            referencedRelation: "user_demon_defense_assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_battle_events_encounter_id_fkey";
            columns: ["encounter_id"];
            isOneToOne: false;
            referencedRelation: "user_demon_encounters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_battle_events_virtue_event_id_fkey";
            columns: ["virtue_event_id"];
            isOneToOne: false;
            referencedRelation: "virtue_events";
            referencedColumns: ["id"];
          },
        ];
      };
      demon_defeat_rewards: {
        Row: {
          created_at: string;
          demon_id: string;
          virtue_code: string;
          virtue_increase: number;
          xp_reward: number;
        };
        Insert: {
          created_at?: string;
          demon_id: string;
          virtue_code: string;
          virtue_increase: number;
          xp_reward: number;
        };
        Update: {
          created_at?: string;
          demon_id?: string;
          virtue_code?: string;
          virtue_increase?: number;
          xp_reward?: number;
        };
        Relationships: [
          {
            foreignKeyName: "demon_defeat_rewards_demon_id_fkey";
            columns: ["demon_id"];
            isOneToOne: true;
            referencedRelation: "demon_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_defeat_rewards_virtue_code_fkey";
            columns: ["virtue_code"];
            isOneToOne: false;
            referencedRelation: "virtue_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      demon_defense_activity_rules: {
        Row: {
          activity_code: string;
          created_at: string;
          defense_id: string;
          metadata_filter: Json;
          updated_at: string;
        };
        Insert: {
          activity_code: string;
          created_at?: string;
          defense_id: string;
          metadata_filter?: Json;
          updated_at?: string;
        };
        Update: {
          activity_code?: string;
          created_at?: string;
          defense_id?: string;
          metadata_filter?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "demon_defense_activity_rules_activity_code_fkey";
            columns: ["activity_code"];
            isOneToOne: false;
            referencedRelation: "activity_definitions";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "demon_defense_activity_rules_defense_id_fkey";
            columns: ["defense_id"];
            isOneToOne: true;
            referencedRelation: "demon_defenses";
            referencedColumns: ["id"];
          },
        ];
      };
      demon_defenses: {
        Row: {
          challenge: string;
          code: string;
          created_at: string;
          demon_damage: number;
          demon_id: string;
          id: string;
          name: string;
          reward_virtue_code: string;
          translations: Json;
          updated_at: string;
          virtue_increase: number;
        };
        Insert: {
          challenge: string;
          code: string;
          created_at?: string;
          demon_damage: number;
          demon_id: string;
          id?: string;
          name: string;
          reward_virtue_code: string;
          translations?: Json;
          updated_at?: string;
          virtue_increase: number;
        };
        Update: {
          challenge?: string;
          code?: string;
          created_at?: string;
          demon_damage?: number;
          demon_id?: string;
          id?: string;
          name?: string;
          reward_virtue_code?: string;
          translations?: Json;
          updated_at?: string;
          virtue_increase?: number;
        };
        Relationships: [
          {
            foreignKeyName: "demon_defenses_demon_id_fkey";
            columns: ["demon_id"];
            isOneToOne: false;
            referencedRelation: "demon_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_defenses_reward_virtue_code_fkey";
            columns: ["reward_virtue_code"];
            isOneToOne: false;
            referencedRelation: "virtue_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      demon_definitions: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          description: string;
          id: string;
          is_active: boolean;
          max_hp: number;
          name: string;
          safety_note: string | null;
          saint_mentor_id: string;
          saint_mentor_reason: string;
          silly_personality: string;
          title: string;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string;
          description: string;
          id?: string;
          is_active?: boolean;
          max_hp?: number;
          name: string;
          safety_note?: string | null;
          saint_mentor_id: string;
          saint_mentor_reason: string;
          silly_personality: string;
          title: string;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          description?: string;
          id?: string;
          is_active?: boolean;
          max_hp?: number;
          name?: string;
          safety_note?: string | null;
          saint_mentor_id?: string;
          saint_mentor_reason?: string;
          silly_personality?: string;
          title?: string;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "demon_definitions_saint_mentor_id_fkey";
            columns: ["saint_mentor_id"];
            isOneToOne: false;
            referencedRelation: "saint_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      demon_virtue_affinities: {
        Row: {
          affinity_type: string;
          created_at: string;
          demon_id: string;
          virtue_code: string;
        };
        Insert: {
          affinity_type: string;
          created_at?: string;
          demon_id: string;
          virtue_code: string;
        };
        Update: {
          affinity_type?: string;
          created_at?: string;
          demon_id?: string;
          virtue_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "demon_virtue_affinities_demon_id_fkey";
            columns: ["demon_id"];
            isOneToOne: false;
            referencedRelation: "demon_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demon_virtue_affinities_virtue_code_fkey";
            columns: ["virtue_code"];
            isOneToOne: false;
            referencedRelation: "virtue_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      game_balance_config: {
        Row: {
          attack_penalty_max: number;
          attack_penalty_min: number;
          challenge_reward_max: number;
          challenge_reward_min: number;
          default_virtue_value: number;
          demon_default_max_hp: number;
          id: boolean;
          rules: Json;
          schema_version: string;
          updated_at: string;
          virtue_max: number;
          virtue_min: number;
        };
        Insert: {
          attack_penalty_max?: number;
          attack_penalty_min?: number;
          challenge_reward_max?: number;
          challenge_reward_min?: number;
          default_virtue_value?: number;
          demon_default_max_hp?: number;
          id?: boolean;
          rules?: Json;
          schema_version: string;
          updated_at?: string;
          virtue_max?: number;
          virtue_min?: number;
        };
        Update: {
          attack_penalty_max?: number;
          attack_penalty_min?: number;
          challenge_reward_max?: number;
          challenge_reward_min?: number;
          default_virtue_value?: number;
          demon_default_max_hp?: number;
          id?: boolean;
          rules?: Json;
          schema_version?: string;
          updated_at?: string;
          virtue_max?: number;
          virtue_min?: number;
        };
        Relationships: [];
      };
      leaderboard_entries: {
        Row: {
          period_id: string;
          points: number;
          prayers_count: number;
          rank: number | null;
          rosaries_count: number;
          scope_reference: string;
          scope_type: string;
          scripture_readings_count: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          period_id: string;
          points?: number;
          prayers_count?: number;
          rank?: number | null;
          rosaries_count?: number;
          scope_reference?: string;
          scope_type: string;
          scripture_readings_count?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          period_id?: string;
          points?: number;
          prayers_count?: number;
          rank?: number | null;
          rosaries_count?: number;
          scope_reference?: string;
          scope_type?: string;
          scripture_readings_count?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_period_id_fkey";
            columns: ["period_id"];
            isOneToOne: false;
            referencedRelation: "leaderboard_periods";
            referencedColumns: ["id"];
          },
        ];
      };
      leaderboard_periods: {
        Row: {
          code: string;
          created_at: string;
          ends_at: string;
          finalized_at: string | null;
          id: string;
          name: string;
          period_type: string;
          starts_at: string;
          status: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          ends_at: string;
          finalized_at?: string | null;
          id?: string;
          name: string;
          period_type: string;
          starts_at: string;
          status?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          ends_at?: string;
          finalized_at?: string | null;
          id?: string;
          name?: string;
          period_type?: string;
          starts_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      level_definitions: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          icon_url: string | null;
          image_url: string | null;
          is_active: boolean;
          level_number: number;
          minimum_total_xp: number;
          name: string;
          reward_reference_id: string | null;
          reward_type: string | null;
          translations: Json;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          icon_url?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          level_number: number;
          minimum_total_xp: number;
          name: string;
          reward_reference_id?: string | null;
          reward_type?: string | null;
          translations?: Json;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          icon_url?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          level_number?: number;
          minimum_total_xp?: number;
          name?: string;
          reward_reference_id?: string | null;
          reward_type?: string | null;
          translations?: Json;
        };
        Relationships: [];
      };
      point_ledger: {
        Row: {
          activity_id: string | null;
          created_at: string;
          id: string;
          idempotency_key: string;
          metadata: Json;
          occurred_at: string;
          point_rule_id: string | null;
          points: number;
          reason: string;
          source_id: string | null;
          source_type: string;
          transaction_type: string;
          user_id: string;
        };
        Insert: {
          activity_id?: string | null;
          created_at?: string;
          id?: string;
          idempotency_key: string;
          metadata?: Json;
          occurred_at?: string;
          point_rule_id?: string | null;
          points: number;
          reason: string;
          source_id?: string | null;
          source_type: string;
          transaction_type: string;
          user_id: string;
        };
        Update: {
          activity_id?: string | null;
          created_at?: string;
          id?: string;
          idempotency_key?: string;
          metadata?: Json;
          occurred_at?: string;
          point_rule_id?: string | null;
          points?: number;
          reason?: string;
          source_id?: string | null;
          source_type?: string;
          transaction_type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "point_ledger_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: false;
            referencedRelation: "spiritual_activities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "point_ledger_point_rule_id_fkey";
            columns: ["point_rule_id"];
            isOneToOne: false;
            referencedRelation: "point_rules";
            referencedColumns: ["id"];
          },
        ];
      };
      point_rules: {
        Row: {
          activity_code: string | null;
          code: string;
          created_at: string;
          daily_limit: number | null;
          description: string | null;
          effective_from: string;
          effective_until: string | null;
          id: string;
          is_active: boolean;
          name: string;
          points: number;
          updated_at: string;
          weekly_limit: number | null;
        };
        Insert: {
          activity_code?: string | null;
          code: string;
          created_at?: string;
          daily_limit?: number | null;
          description?: string | null;
          effective_from?: string;
          effective_until?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          points: number;
          updated_at?: string;
          weekly_limit?: number | null;
        };
        Update: {
          activity_code?: string | null;
          code?: string;
          created_at?: string;
          daily_limit?: number | null;
          description?: string | null;
          effective_from?: string;
          effective_until?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          points?: number;
          updated_at?: string;
          weekly_limit?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "point_rules_activity_code_fkey";
            columns: ["activity_code"];
            isOneToOne: false;
            referencedRelation: "activity_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      saint_definitions: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      spiritual_activities: {
        Row: {
          activity_code: string;
          completed_at: string | null;
          country_code: string | null;
          created_at: string;
          duration_seconds: number | null;
          id: string;
          idempotency_key: string | null;
          metadata: Json;
          occurred_at: string;
          quantity: number;
          source: string;
          user_id: string;
          verification_status: string;
        };
        Insert: {
          activity_code: string;
          completed_at?: string | null;
          country_code?: string | null;
          created_at?: string;
          duration_seconds?: number | null;
          id?: string;
          idempotency_key?: string | null;
          metadata?: Json;
          occurred_at: string;
          quantity?: number;
          source?: string;
          user_id: string;
          verification_status?: string;
        };
        Update: {
          activity_code?: string;
          completed_at?: string | null;
          country_code?: string | null;
          created_at?: string;
          duration_seconds?: number | null;
          id?: string;
          idempotency_key?: string | null;
          metadata?: Json;
          occurred_at?: string;
          quantity?: number;
          source?: string;
          user_id?: string;
          verification_status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "spiritual_activities_activity_code_fkey";
            columns: ["activity_code"];
            isOneToOne: false;
            referencedRelation: "activity_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      user_badge_progress: {
        Row: {
          badge_id: string;
          current_value: number;
          progress_percentage: number | null;
          required_value: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          current_value?: number;
          progress_percentage?: number | null;
          required_value: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          current_value?: number;
          progress_percentage?: number | null;
          required_value?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badge_progress_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badge_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badge_requirement_progress: {
        Row: {
          badge_requirement_id: string;
          completed_at: string | null;
          current_value: number;
          required_value: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          badge_requirement_id: string;
          completed_at?: string | null;
          current_value?: number;
          required_value: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          badge_requirement_id?: string;
          completed_at?: string | null;
          current_value?: number;
          required_value?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badge_requirement_progress_badge_requirement_id_fkey";
            columns: ["badge_requirement_id"];
            isOneToOne: false;
            referencedRelation: "badge_requirement_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_id: string;
          earned_at: string;
          id: string;
          is_featured: boolean;
          metadata: Json;
          sequence_number: number;
          source_id: string | null;
          source_type: string | null;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          earned_at?: string;
          id?: string;
          is_featured?: boolean;
          metadata?: Json;
          sequence_number?: number;
          source_id?: string | null;
          source_type?: string | null;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          earned_at?: string;
          id?: string;
          is_featured?: boolean;
          metadata?: Json;
          sequence_number?: number;
          source_id?: string | null;
          source_type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badge_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_challenge_assignments: {
        Row: {
          assignment_date: string;
          challenge_definition_id: string;
          completed_at: string | null;
          created_at: string;
          current_progress: number;
          expires_at: string;
          id: string;
          reward_claimed_at: string | null;
          starts_at: string;
          status: string;
          target_quantity: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assignment_date: string;
          challenge_definition_id: string;
          completed_at?: string | null;
          created_at?: string;
          current_progress?: number;
          expires_at: string;
          id?: string;
          reward_claimed_at?: string | null;
          starts_at: string;
          status?: string;
          target_quantity: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assignment_date?: string;
          challenge_definition_id?: string;
          completed_at?: string | null;
          created_at?: string;
          current_progress?: number;
          expires_at?: string;
          id?: string;
          reward_claimed_at?: string | null;
          starts_at?: string;
          status?: string;
          target_quantity?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_challenge_assignments_challenge_definition_id_fkey";
            columns: ["challenge_definition_id"];
            isOneToOne: false;
            referencedRelation: "challenge_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_demon_defense_assignments: {
        Row: {
          assigned_at: string;
          assignment_sequence: number;
          challenge_assignment_id: string | null;
          completed_at: string | null;
          created_at: string;
          defense_id: string;
          encounter_id: string;
          expires_at: string | null;
          id: string;
          metadata: Json;
          status: string;
          updated_at: string;
        };
        Insert: {
          assigned_at?: string;
          assignment_sequence?: number;
          challenge_assignment_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          defense_id: string;
          encounter_id: string;
          expires_at?: string | null;
          id?: string;
          metadata?: Json;
          status?: string;
          updated_at?: string;
        };
        Update: {
          assigned_at?: string;
          assignment_sequence?: number;
          challenge_assignment_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          defense_id?: string;
          encounter_id?: string;
          expires_at?: string | null;
          id?: string;
          metadata?: Json;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_demon_defense_assignments_challenge_assignment_id_fkey";
            columns: ["challenge_assignment_id"];
            isOneToOne: false;
            referencedRelation: "user_challenge_assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_demon_defense_assignments_defense_id_fkey";
            columns: ["defense_id"];
            isOneToOne: false;
            referencedRelation: "demon_defenses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_demon_defense_assignments_encounter_id_fkey";
            columns: ["encounter_id"];
            isOneToOne: false;
            referencedRelation: "user_demon_encounters";
            referencedColumns: ["id"];
          },
        ];
      };
      user_demon_encounters: {
        Row: {
          created_at: string;
          current_hp: number;
          defeated_at: string | null;
          demon_id: string;
          ended_at: string | null;
          id: string;
          max_hp: number;
          metadata: Json;
          started_at: string;
          status: string;
          updated_at: string;
          user_id: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          current_hp: number;
          defeated_at?: string | null;
          demon_id: string;
          ended_at?: string | null;
          id?: string;
          max_hp: number;
          metadata?: Json;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          current_hp?: number;
          defeated_at?: string | null;
          demon_id?: string;
          ended_at?: string | null;
          id?: string;
          max_hp?: number;
          metadata?: Json;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_demon_encounters_demon_id_fkey";
            columns: ["demon_id"];
            isOneToOne: false;
            referencedRelation: "demon_definitions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_metric_snapshots: {
        Row: {
          created_at: string;
          points_earned: number;
          prayer_duration_seconds: number;
          prayer_sessions_count: number;
          rosaries_count: number;
          scripture_readings_count: number;
          service_acts_count: number;
          snapshot_date: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          points_earned?: number;
          prayer_duration_seconds?: number;
          prayer_sessions_count?: number;
          rosaries_count?: number;
          scripture_readings_count?: number;
          service_acts_count?: number;
          snapshot_date: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          points_earned?: number;
          prayer_duration_seconds?: number;
          prayer_sessions_count?: number;
          rosaries_count?: number;
          scripture_readings_count?: number;
          service_acts_count?: number;
          snapshot_date?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          current_level: number;
          last_activity_at: string | null;
          lifetime_points: number;
          total_xp: number;
          updated_at: string;
          user_id: string;
          version: number;
          weekly_points: number;
          yearly_points: number;
        };
        Insert: {
          current_level?: number;
          last_activity_at?: string | null;
          lifetime_points?: number;
          total_xp?: number;
          updated_at?: string;
          user_id: string;
          version?: number;
          weekly_points?: number;
          yearly_points?: number;
        };
        Update: {
          current_level?: number;
          last_activity_at?: string | null;
          lifetime_points?: number;
          total_xp?: number;
          updated_at?: string;
          user_id?: string;
          version?: number;
          weekly_points?: number;
          yearly_points?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_current_level_fkey";
            columns: ["current_level"];
            isOneToOne: false;
            referencedRelation: "level_definitions";
            referencedColumns: ["level_number"];
          },
        ];
      };
      user_virtues: {
        Row: {
          current_value: number;
          updated_at: string;
          user_id: string;
          version: number;
          virtue_code: string;
        };
        Insert: {
          current_value?: number;
          updated_at?: string;
          user_id: string;
          version?: number;
          virtue_code: string;
        };
        Update: {
          current_value?: number;
          updated_at?: string;
          user_id?: string;
          version?: number;
          virtue_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_virtues_virtue_code_fkey";
            columns: ["virtue_code"];
            isOneToOne: false;
            referencedRelation: "virtue_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
      virtue_definitions: {
        Row: {
          code: string;
          created_at: string;
          default_value: number;
          description: string;
          icon: string;
          is_active: boolean;
          name: string;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          default_value?: number;
          description: string;
          icon: string;
          is_active?: boolean;
          name: string;
          translations?: Json;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          default_value?: number;
          description?: string;
          icon?: string;
          is_active?: boolean;
          name?: string;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      virtue_events: {
        Row: {
          created_at: string;
          delta: number;
          encounter_id: string | null;
          id: string;
          idempotency_key: string;
          metadata: Json;
          occurred_at: string;
          previous_value: number;
          resulting_value: number;
          source_id: string | null;
          source_type: string;
          user_id: string;
          virtue_code: string;
        };
        Insert: {
          created_at?: string;
          delta: number;
          encounter_id?: string | null;
          id?: string;
          idempotency_key: string;
          metadata?: Json;
          occurred_at?: string;
          previous_value: number;
          resulting_value: number;
          source_id?: string | null;
          source_type: string;
          user_id: string;
          virtue_code: string;
        };
        Update: {
          created_at?: string;
          delta?: number;
          encounter_id?: string | null;
          id?: string;
          idempotency_key?: string;
          metadata?: Json;
          occurred_at?: string;
          previous_value?: number;
          resulting_value?: number;
          source_id?: string | null;
          source_type?: string;
          user_id?: string;
          virtue_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "virtue_events_encounter_id_fkey";
            columns: ["encounter_id"];
            isOneToOne: false;
            referencedRelation: "user_demon_encounters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "virtue_events_virtue_code_fkey";
            columns: ["virtue_code"];
            isOneToOne: false;
            referencedRelation: "virtue_definitions";
            referencedColumns: ["code"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      refresh_leaderboard_period: {
        Args: { p_period_id: string };
        Returns: undefined;
      };
      refresh_leaderboards: {
        Args: { p_as_of?: string; p_backfill?: boolean };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  prayer: {
    Tables: {
      country_daily_aggregates: {
        Row: {
          aggregate_date: string;
          country_code: string;
          prayer_duration_seconds: number;
          rosaries: number;
          total_prayers: number;
          unique_users: number;
          updated_at: string;
        };
        Insert: {
          aggregate_date: string;
          country_code: string;
          prayer_duration_seconds?: number;
          rosaries?: number;
          total_prayers?: number;
          unique_users?: number;
          updated_at?: string;
        };
        Update: {
          aggregate_date?: string;
          country_code?: string;
          prayer_duration_seconds?: number;
          rosaries?: number;
          total_prayers?: number;
          unique_users?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_scripture_completions: {
        Row: {
          activity_id: string | null;
          completed_at: string;
          reading_date: string;
          user_id: string;
        };
        Insert: {
          activity_id?: string | null;
          completed_at?: string;
          reading_date: string;
          user_id: string;
        };
        Update: {
          activity_id?: string | null;
          completed_at?: string;
          reading_date?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      map_markers: {
        Row: {
          aggregation_level: string;
          country_code: string;
          id: string;
          intensity: number;
          latitude: number;
          location_reference: string;
          longitude: number;
          name: string;
          period_end: string;
          period_start: string;
          prayer_count: number;
          unique_users: number;
          updated_at: string;
        };
        Insert: {
          aggregation_level: string;
          country_code: string;
          id?: string;
          intensity?: number;
          latitude: number;
          location_reference: string;
          longitude: number;
          name: string;
          period_end: string;
          period_start: string;
          prayer_count?: number;
          unique_users?: number;
          updated_at?: string;
        };
        Update: {
          aggregation_level?: string;
          country_code?: string;
          id?: string;
          intensity?: number;
          latitude?: number;
          location_reference?: string;
          longitude?: number;
          name?: string;
          period_end?: string;
          period_start?: string;
          prayer_count?: number;
          unique_users?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      prayer_intention_approval_counts: {
        Row: {
          approved_count: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          approved_count?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          approved_count?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      prayer_intention_prayers: {
        Row: {
          created_at: string;
          id: string;
          intention_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          intention_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          intention_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prayer_intention_prayers_intention_id_fkey";
            columns: ["intention_id"];
            isOneToOne: false;
            referencedRelation: "my_prayer_intention_summaries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prayer_intention_prayers_intention_id_fkey";
            columns: ["intention_id"];
            isOneToOne: false;
            referencedRelation: "prayer_intention_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prayer_intention_prayers_intention_id_fkey";
            columns: ["intention_id"];
            isOneToOne: false;
            referencedRelation: "prayer_intentions";
            referencedColumns: ["id"];
          },
        ];
      };
      prayer_intentions: {
        Row: {
          created_at: string;
          creator_id: string;
          description: string;
          expires_at: string | null;
          id: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          symbol: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          description: string;
          expires_at?: string | null;
          id?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          symbol?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          description?: string;
          expires_at?: string | null;
          id?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          symbol?: string | null;
          title?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      my_prayer_intention_summaries: {
        Row: {
          created_at: string | null;
          description: string | null;
          expires_at: string | null;
          id: string | null;
          prayer_count: number | null;
          reviewed_at: string | null;
          status: string | null;
          symbol: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          expires_at?: string | null;
          id?: string | null;
          prayer_count?: never;
          reviewed_at?: string | null;
          status?: string | null;
          symbol?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          expires_at?: string | null;
          id?: string | null;
          prayer_count?: never;
          reviewed_at?: string | null;
          status?: string | null;
          symbol?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      prayer_intention_cards: {
        Row: {
          approved_at: string | null;
          created_at: string | null;
          creator_avatar_url: string | null;
          creator_country_code: string | null;
          creator_display_name: string | null;
          description: string | null;
          expires_at: string | null;
          id: string | null;
          prayer_count: number | null;
          symbol: string | null;
          title: string | null;
        };
        Relationships: [];
      };
      prayer_intention_prayer_participants: {
        Row: {
          avatar_url: string | null;
          country_code: string | null;
          created_at: string | null;
          display_name: string | null;
          id: string | null;
          intention_id: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "prayer_intention_prayers_intention_id_fkey";
            columns: ["intention_id"];
            isOneToOne: false;
            referencedRelation: "my_prayer_intention_summaries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prayer_intention_prayers_intention_id_fkey";
            columns: ["intention_id"];
            isOneToOne: false;
            referencedRelation: "prayer_intention_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prayer_intention_prayers_intention_id_fkey";
            columns: ["intention_id"];
            isOneToOne: false;
            referencedRelation: "prayer_intentions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      delete_expired_prayer_intentions: { Args: never; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  api: {
    Enums: {},
  },
  app: {
    Enums: {},
  },
  competition: {
    Enums: {},
  },
  prayer: {
    Enums: {},
  },
} as const;
