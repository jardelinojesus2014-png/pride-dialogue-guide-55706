export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      fluxo_audio_files: {
        Row: {
          created_at: string
          created_by: string | null
          duration_seconds: number | null
          file_path: string
          file_url: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_seconds?: number | null
          file_path: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_seconds?: number | null
          file_path?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fluxo_videos: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url: string
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      google_review_settings: {
        Row: {
          average_rating: number
          created_at: string
          created_by: string | null
          id: string
          review_link: string
          total_reviews: number
          updated_at: string
        }
        Insert: {
          average_rating?: number
          created_at?: string
          created_by?: string | null
          id?: string
          review_link: string
          total_reviews?: number
          updated_at?: string
        }
        Update: {
          average_rating?: number
          created_at?: string
          created_by?: string | null
          id?: string
          review_link?: string
          total_reviews?: number
          updated_at?: string
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          comment: string
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          rating: number
          review_date: string
          reviewer_name: string
          reviewer_photo_url: string | null
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          rating: number
          review_date: string
          reviewer_name: string
          reviewer_photo_url?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          rating?: number
          review_date?: string
          reviewer_name?: string
          reviewer_photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      institutional_videos: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      mission_vision_values: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          mission: string
          updated_at: string
          values: string
          vision: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          mission: string
          updated_at?: string
          values: string
          vision: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          mission?: string
          updated_at?: string
          values?: string
          vision?: string
        }
        Relationships: []
      }
      pdf_files: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number
          file_path: string
          file_url: string
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          file_path: string
          file_url: string
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          file_path?: string
          file_url?: string
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      podcast_links: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          created_at: string
          created_by: string
          duration_seconds: number | null
          file_path: string
          file_url: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          duration_seconds?: number | null
          file_path: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          duration_seconds?: number | null
          file_path?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          last_sign_in_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          last_sign_in_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_sign_in_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qualification_items: {
        Row: {
          category: string
          content: string
          created_at: string
          descriptions: string[] | null
          display_order: number
          examples: string[] | null
          file_names: string[] | null
          file_urls: string[] | null
          id: string
          spin_type: string | null
          tips: string[] | null
          updated_at: string
          video_urls: string[] | null
          warnings: string[] | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          descriptions?: string[] | null
          display_order?: number
          examples?: string[] | null
          file_names?: string[] | null
          file_urls?: string[] | null
          id?: string
          spin_type?: string | null
          tips?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
          warnings?: string[] | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          descriptions?: string[] | null
          display_order?: number
          examples?: string[] | null
          file_names?: string[] | null
          file_urls?: string[] | null
          id?: string
          spin_type?: string | null
          tips?: string[] | null
          updated_at?: string
          video_urls?: string[] | null
          warnings?: string[] | null
        }
        Relationships: []
      }
      qualification_user_notes: {
        Row: {
          created_at: string
          id: string
          item_id: string
          note: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          note: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          note?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qualification_user_notes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "qualification_items"
            referencedColumns: ["id"]
          },
        ]
      }
      script_checked_items: {
        Row: {
          created_at: string
          id: string
          is_checked: boolean
          item_id: string
          section_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_checked?: boolean
          item_id: string
          section_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_checked?: boolean
          item_id?: string
          section_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      script_items: {
        Row: {
          alternatives: string[] | null
          collect: string[] | null
          created_at: string
          display_order: number
          id: string
          item_id: string
          label: string
          script: string
          section_id: string
          tips: string[] | null
          updated_at: string
          warnings: string[] | null
        }
        Insert: {
          alternatives?: string[] | null
          collect?: string[] | null
          created_at?: string
          display_order?: number
          id?: string
          item_id: string
          label: string
          script: string
          section_id: string
          tips?: string[] | null
          updated_at?: string
          warnings?: string[] | null
        }
        Update: {
          alternatives?: string[] | null
          collect?: string[] | null
          created_at?: string
          display_order?: number
          id?: string
          item_id?: string
          label?: string
          script?: string
          section_id?: string
          tips?: string[] | null
          updated_at?: string
          warnings?: string[] | null
        }
        Relationships: []
      }
      script_notes: {
        Row: {
          created_at: string
          id: string
          item_id: string
          note: string
          section_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          note: string
          section_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          note?: string
          section_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      script_sections: {
        Row: {
          content: string
          created_at: string | null
          id: string
          section_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          section_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          section_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_audio_files: {
        Row: {
          created_at: string
          duration_seconds: number | null
          file_path: string
          file_url: string
          id: string
          section_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          file_path: string
          file_url: string
          id?: string
          section_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          file_path?: string
          file_url?: string
          id?: string
          section_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_links: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
