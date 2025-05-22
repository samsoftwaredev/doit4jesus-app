export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
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
      profiles: {
        Row: {
          birth_date: string | null;
          created_at: string | null;
          first_name: string | null;
          gender: string | null;
          id: string;
          invited_by: string | null;
          last_name: string | null;
          picture_url: string | null;
          rosary_count: number | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          birth_date?: string | null;
          created_at?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id: string;
          invited_by?: string | null;
          last_name?: string | null;
          picture_url?: string | null;
          rosary_count?: number | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          birth_date?: string | null;
          created_at?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: string;
          invited_by?: string | null;
          last_name?: string | null;
          picture_url?: string | null;
          rosary_count?: number | null;
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
    };
    Functions: {
      get_all_rosary_count: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_profiles_by_user_ids: {
        Args: { user_ids: string[] };
        Returns: {
          first_name: string;
          last_name: string;
          picture_url: string;
          rosary_count: number;
          id: string;
        }[];
      };
      get_top_10_user_ids: {
        Args: Record<PropertyKey, never>;
        Returns: {
          user_id: string;
          user_count: number;
        }[];
      };
      get_top_10_user_profile: {
        Args: Record<PropertyKey, never>;
        Returns: {
          user_id: string;
          user_count: number;
          first_name: string;
          last_name: string;
          picture_url: string;
        }[];
      };
      insert_into_rosary_stats: {
        Args: {
          p_user_id: string;
          p_join_rosary_user_id: string;
          p_completed_at: string;
        };
        Returns: undefined;
      };
      search_profiles: {
        Args: { search_text: string };
        Returns: {
          id: string;
          first_name: string;
          last_name: string;
        }[];
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
      gender: 'male' | 'famale';
      language: 'en' | 'es';
      sin_type: 'mortal' | 'venial' | 'both';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
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
      gender: ['male', 'famale'],
      language: ['en', 'es'],
      sin_type: ['mortal', 'venial', 'both'],
    },
  },
} as const;
