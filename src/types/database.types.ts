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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activation_keys: {
        Row: {
          created_on: string
          expiration: string
          id: string
          key: string
        }
        Insert: {
          created_on?: string
          expiration: string
          id?: string
          key: string
        }
        Update: {
          created_on?: string
          expiration?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      channel_partners: {
        Row: {
          activation_key_id: string | null
          amount: number
          id: string
          user_id: string
          valid_from: string
          valid_to: string
        }
        Insert: {
          activation_key_id?: string | null
          amount?: number
          id?: string
          user_id: string
          valid_from: string
          valid_to: string
        }
        Update: {
          activation_key_id?: string | null
          amount?: number
          id?: string
          user_id?: string
          valid_from?: string
          valid_to?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_partners_activation_key_id_fkey"
            columns: ["activation_key_id"]
            isOneToOne: false
            referencedRelation: "activation_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_partnership_history: {
        Row: {
          amount: number
          channel_partner_id: string
          id: string
          logged_at: string
          valid_from: string
          valid_to: string
        }
        Insert: {
          amount: number
          channel_partner_id: string
          id?: string
          logged_at?: string
          valid_from: string
          valid_to: string
        }
        Update: {
          amount?: number
          channel_partner_id?: string
          id?: string
          logged_at?: string
          valid_from?: string
          valid_to?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_partnership_history_channel_partner_id_fkey"
            columns: ["channel_partner_id"]
            isOneToOne: false
            referencedRelation: "channel_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          activation_key_id: string | null
          country: string
          created_on: string
          id: string
          name: string
          owner_id: string
          region_city: string
          updated_on: string
        }
        Insert: {
          activation_key_id?: string | null
          country: string
          created_on?: string
          id?: string
          name: string
          owner_id: string
          region_city: string
          updated_on?: string
        }
        Update: {
          activation_key_id?: string | null
          country?: string
          created_on?: string
          id?: string
          name?: string
          owner_id?: string
          region_city?: string
          updated_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_activation_key_id_fkey"
            columns: ["activation_key_id"]
            isOneToOne: false
            referencedRelation: "activation_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          country: string
          created_on: string
          date_of_birth: string
          full_name: string
          id: string
          is_channel_partner: boolean
          region_city: string
          updated_on: string
        }
        Insert: {
          country: string
          created_on?: string
          date_of_birth: string
          full_name: string
          id: string
          is_channel_partner?: boolean
          region_city: string
          updated_on?: string
        }
        Update: {
          country?: string
          created_on?: string
          date_of_birth?: string
          full_name?: string
          id?: string
          is_channel_partner?: boolean
          region_city?: string
          updated_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_on: string
          current_session_id: string | null
          email: string
          email_verified: boolean
          id: string
          is_active: boolean
          is_banned: boolean
          is_business: boolean
          is_deleted: boolean
          is_individual: boolean
          last_otp_sent_at: string | null
          otp: string | null
          otp_expires_at: string | null
          phone: string | null
          phone_verified: boolean
          updated_on: string
        }
        Insert: {
          created_on?: string
          current_session_id?: string | null
          email: string
          email_verified?: boolean
          id: string
          is_active?: boolean
          is_banned?: boolean
          is_business?: boolean
          is_deleted?: boolean
          is_individual?: boolean
          last_otp_sent_at?: string | null
          otp?: string | null
          otp_expires_at?: string | null
          phone?: string | null
          phone_verified?: boolean
          updated_on?: string
        }
        Update: {
          created_on?: string
          current_session_id?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          is_active?: boolean
          is_banned?: boolean
          is_business?: boolean
          is_deleted?: boolean
          is_individual?: boolean
          last_otp_sent_at?: string | null
          otp?: string | null
          otp_expires_at?: string | null
          phone?: string | null
          phone_verified?: boolean
          updated_on?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
