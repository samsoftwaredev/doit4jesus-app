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
          created_at: string;
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
          created_at?: string;
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
          created_at?: string;
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
      friends: {
        Row: {
          created_at: string | null;
          friend_id: string;
          groups: Json | null;
          is_favorite: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          friend_id: string;
          groups?: Json | null;
          is_favorite?: boolean | null;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          friend_id?: string;
          groups?: Json | null;
          is_favorite?: boolean | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Friends_friend_id_fkey';
            columns: ['friend_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Friends_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          group_name: string;
          id: string;
          picture_url: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          group_name: string;
          id?: string;
          picture_url?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          group_name?: string;
          id?: string;
          picture_url?: string | null;
          user_id?: string | null;
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
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
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
      get_profiles_by_user_ids: {
        Args: {
          user_ids: string[];
        };
        Returns: {
          first_name: string;
          last_name: string;
          picture_url: string;
          rosary_count: number;
          id: string;
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
        Args: {
          search_text: string;
        };
        Returns: {
          id: string;
          first_name: string;
          last_name: string;
        }[];
      };
    };
    Enums: {
      age_group: 'adult' | 'teen' | 'kid';
      event_type: 'youtube_video';
      gender: 'male' | 'famale';
      sin_type: 'mortal' | 'venial';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
