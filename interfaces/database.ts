export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          attendees: Json | null
          created_at: string
          description: string | null
          event_source: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: number
          keywords: string | null
          picture_url: string | null
          price: number | null
          slug: string | null
          started_at: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          attendees?: Json | null
          created_at?: string
          description?: string | null
          event_source?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: number
          keywords?: string | null
          picture_url?: string | null
          price?: number | null
          slug?: string | null
          started_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          attendees?: Json | null
          created_at?: string
          description?: string | null
          event_source?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: number
          keywords?: string | null
          picture_url?: string | null
          price?: number | null
          slug?: string | null
          started_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_event_source_fkey"
            columns: ["event_source"]
            isOneToOne: false
            referencedRelation: "youtube"
            referencedColumns: ["id"]
          }
        ]
      }
      exam_consciousness: {
        Row: {
          commandment: number | null
          created_at: string
          description: string | null
          for_adults: boolean | null
          for_children: boolean | null
          for_matrimonies: boolean | null
          for_religious: boolean | null
          for_teens: boolean | null
          id: number
          question: string | null
          sin_type: Database["public"]["Enums"]["sin_type"] | null
          statement: string | null
          subject: string | null
        }
        Insert: {
          commandment?: number | null
          created_at?: string
          description?: string | null
          for_adults?: boolean | null
          for_children?: boolean | null
          for_matrimonies?: boolean | null
          for_religious?: boolean | null
          for_teens?: boolean | null
          id?: number
          question?: string | null
          sin_type?: Database["public"]["Enums"]["sin_type"] | null
          statement?: string | null
          subject?: string | null
        }
        Update: {
          commandment?: number | null
          created_at?: string
          description?: string | null
          for_adults?: boolean | null
          for_children?: boolean | null
          for_matrimonies?: boolean | null
          for_religious?: boolean | null
          for_teens?: boolean | null
          id?: number
          question?: string | null
          sin_type?: Database["public"]["Enums"]["sin_type"] | null
          statement?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          keywords: string | null
          picture_url: string | null
          publish_at: string | null
          slug: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          keywords?: string | null
          picture_url?: string | null
          publish_at?: string | null
          slug?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          keywords?: string | null
          picture_url?: string | null
          publish_at?: string | null
          slug?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          picture_url: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          birth_date?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          picture_url?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          birth_date?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          picture_url?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      youtube: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string | null
          video_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      latest_event: {
        Row: {
          id: number | null
          started_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      age_group: "adult" | "teen" | "kid"
      event_type: "youtube_video"
      gender: "male" | "famale"
      sin_type: "mortal" | "venial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
