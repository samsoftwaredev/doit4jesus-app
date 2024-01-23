export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Events: {
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
            foreignKeyName: "Events_event_source_fkey"
            columns: ["event_source"]
            isOneToOne: false
            referencedRelation: "YouTube"
            referencedColumns: ["id"]
          }
        ]
      }
      Posts: {
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
            foreignKeyName: "Posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      Profiles: {
        Row: {
          id: string
          picture_url: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          id: string
          picture_url?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          picture_url?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      YouTube: {
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_type: "youtube_video"
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
