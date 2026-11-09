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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      access_keys: {
        Row: {
          activated_at: string | null
          amount: number
          channel_partner_id: string | null
          created_on: string
          deduct_trial_fee: boolean
          expires_at: string | null
          from_company: boolean
          id: string
          is_active: boolean
          is_payment_completed: boolean
          is_standalone: boolean
          key_code: string
          key_type: Database["public"]["Enums"]["key_distribution_type"]
          payment_gateway_tx_id: string | null
        }
        Insert: {
          activated_at?: string | null
          amount?: number
          channel_partner_id?: string | null
          created_on?: string
          deduct_trial_fee?: boolean
          expires_at?: string | null
          from_company?: boolean
          id?: string
          is_active?: boolean
          is_payment_completed?: boolean
          is_standalone?: boolean
          key_code: string
          key_type?: Database["public"]["Enums"]["key_distribution_type"]
          payment_gateway_tx_id?: string | null
        }
        Update: {
          activated_at?: string | null
          amount?: number
          channel_partner_id?: string | null
          created_on?: string
          deduct_trial_fee?: boolean
          expires_at?: string | null
          from_company?: boolean
          id?: string
          is_active?: boolean
          is_payment_completed?: boolean
          is_standalone?: boolean
          key_code?: string
          key_type?: Database["public"]["Enums"]["key_distribution_type"]
          payment_gateway_tx_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_keys_channel_partner_id_fkey"
            columns: ["channel_partner_id"]
            isOneToOne: false
            referencedRelation: "channel_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          access_key_id: string | null
          business_code: string | null
          country: string
          created_on: string
          id: string
          name: string
          owner_id: string
          region_city: string
          updated_on: string
        }
        Insert: {
          access_key_id?: string | null
          business_code?: string | null
          country: string
          created_on?: string
          id?: string
          name: string
          owner_id: string
          region_city: string
          updated_on?: string
        }
        Update: {
          access_key_id?: string | null
          business_code?: string | null
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
            columns: ["access_key_id"]
            isOneToOne: true
            referencedRelation: "access_keys"
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
      channel_partners: {
        Row: {
          amount: number
          id: string
          user_id: string
          valid_from: string
          valid_to: string
        }
        Insert: {
          amount?: number
          id?: string
          user_id: string
          valid_from: string
          valid_to: string
        }
        Update: {
          amount?: number
          id?: string
          user_id?: string
          valid_from?: string
          valid_to?: string
        }
        Relationships: [
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
      transactions: {
        Row: {
          amount: number
          business_id: string | null
          created_on: string | null
          error_message: string | null
          id: string
          payload: Json | null
          retry_count: number
          status: Database["public"]["Enums"]["payment_status"]
          target_entity: Database["public"]["Enums"]["payment_target_entity"]
          updated_on: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          business_id?: string | null
          created_on?: string | null
          error_message?: string | null
          id?: string
          payload?: Json | null
          retry_count?: number
          status?: Database["public"]["Enums"]["payment_status"]
          target_entity?: Database["public"]["Enums"]["payment_target_entity"]
          updated_on?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          business_id?: string | null
          created_on?: string | null
          error_message?: string | null
          id?: string
          payload?: Json | null
          retry_count?: number
          status?: Database["public"]["Enums"]["payment_status"]
          target_entity?: Database["public"]["Enums"]["payment_target_entity"]
          updated_on?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      unresolved_payment_ledger: {
        Row: {
          client_tx_id: string
          created_on: string | null
          error_message: string | null
          flow_type: string
          gateway_tx_id: string
          id: string
          payload: Json
          retry_count: number | null
          updated_on: string | null
          user_id: string
        }
        Insert: {
          client_tx_id: string
          created_on?: string | null
          error_message?: string | null
          flow_type: string
          gateway_tx_id: string
          id?: string
          payload: Json
          retry_count?: number | null
          updated_on?: string | null
          user_id: string
        }
        Update: {
          client_tx_id?: string
          created_on?: string | null
          error_message?: string | null
          flow_type?: string
          gateway_tx_id?: string
          id?: string
          payload?: Json
          retry_count?: number | null
          updated_on?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unresolved_payment_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      create_standalone_access_key:
        | {
            Args: {
              p_amount: number
              p_calculated_expiration: string
              p_client_tx_id: string
              p_deduct_trial_fee: boolean
              p_gateway_tx_id: string
              p_key_code: string
              p_key_type: string
              p_operator_user_id: string
              p_payload: Json
            }
            Returns: Json
          }
        | {
            Args: {
              p_amount: number
              p_calculated_expiration: string
              p_client_tx_id: string
              p_deduct_trial_fee: boolean
              p_gateway_tx_id: string
              p_is_standalone?: boolean
              p_key_code: string
              p_key_type: string
              p_operator_user_id: string
              p_payload: Json
            }
            Returns: Json
          }
      provision_business_transaction:
        | {
            Args: {
              p_amount: number
              p_business_city: string
              p_business_country: string
              p_business_name: string
              p_calculated_expiration: string
              p_deduct_trial_fee: boolean
              p_email: string
              p_key_code: string
              p_key_type: string
              p_manager_city: string
              p_manager_country: string
              p_manager_dob: string
              p_manager_full_name: string
              p_operator_user_id: string
              p_phone: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_amount: number
              p_business_city: string
              p_business_country: string
              p_business_name: string
              p_calculated_expiration: string
              p_deduct_trial_fee: boolean
              p_email: string
              p_is_self_owned: boolean
              p_key_code: string
              p_key_type: string
              p_manager_city: string
              p_manager_country: string
              p_manager_dob: string
              p_manager_full_name: string
              p_operator_user_id: string
              p_phone: string
            }
            Returns: Json
          }
      provision_business_transaction_v2:
        | {
            Args: {
              p_amount: number
              p_business_city: string
              p_business_country: string
              p_business_name: string
              p_calculated_expiration: string
              p_deduct_trial_fee: boolean
              p_email: string
              p_is_self_owned: boolean
              p_key_code: string
              p_key_type: string
              p_manager_city: string
              p_manager_country: string
              p_manager_dob: string
              p_manager_full_name: string
              p_operator_user_id: string
              p_phone: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_amount: number
              p_business_city: string
              p_business_country: string
              p_business_name: string
              p_calculated_expiration: string
              p_deduct_trial_fee: boolean
              p_email: string
              p_is_payment_completed: boolean
              p_is_self_owned: boolean
              p_key_code: string
              p_key_type: string
              p_manager_city: string
              p_manager_country: string
              p_manager_dob: string
              p_manager_full_name: string
              p_operator_user_id: string
              p_phone: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_amount: number
              p_business_city: string
              p_business_country: string
              p_business_name: string
              p_calculated_expiration: string
              p_deduct_trial_fee: boolean
              p_email: string
              p_is_payment_completed: boolean
              p_is_self_owned: boolean
              p_key_code: string
              p_key_type: string
              p_manager_city: string
              p_manager_country: string
              p_manager_dob: string
              p_manager_full_name: string
              p_operator_user_id: string
              p_phone: string
              p_target_entity?: string
            }
            Returns: Json
          }
      provision_key_and_link_existing_business: {
        Args: {
          p_amount: number
          p_business_id: string
          p_calculated_expiration: string
          p_client_tx_id: string
          p_deduct_trial_fee: boolean
          p_gateway_tx_id: string
          p_key_code: string
          p_key_type: string
          p_operator_user_id: string
          p_payload: Json
        }
        Returns: Json
      }
      provision_key_and_link_new_business: {
        Args: {
          p_amount: number
          p_business_name: string
          p_calculated_expiration: string
          p_client_tx_id: string
          p_country: string
          p_deduct_trial_fee: boolean
          p_gateway_tx_id: string
          p_key_code: string
          p_key_type: string
          p_operator_user_id: string
          p_owner_user_id: string
          p_payload: Json
          p_region_city: string
        }
        Returns: Json
      }
    }
    Enums: {
      key_distribution_type: "TRIAL" | "LIFETIME"
      payment_status: "Failed" | "Pending" | "Success"
      payment_target_entity: "access_keys" | "businesses" | "channel_partners"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      key_distribution_type: ["TRIAL", "LIFETIME"],
      payment_status: ["Failed", "Pending", "Success"],
      payment_target_entity: ["access_keys", "businesses", "channel_partners"],
    },
  },
} as const
