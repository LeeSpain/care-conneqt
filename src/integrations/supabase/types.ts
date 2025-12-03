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
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          member_id: string
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          member_id: string
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          member_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_reminders: {
        Row: {
          ai_agent_name: string | null
          completed_at: string | null
          created_at: string
          created_by_ai: boolean | null
          description: string | null
          id: string
          is_completed: boolean | null
          metadata: Json | null
          priority: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          reminder_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_agent_name?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_ai?: boolean | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          metadata?: Json | null
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          reminder_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_agent_name?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_ai?: boolean | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          metadata?: Json | null
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          reminder_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_agent_analytics: {
        Row: {
          agent_id: string
          average_response_time: number | null
          average_satisfaction: number | null
          created_at: string
          date: string
          escalations: number | null
          id: string
          successful_resolutions: number | null
          topics_discussed: Json | null
          total_conversations: number | null
        }
        Insert: {
          agent_id: string
          average_response_time?: number | null
          average_satisfaction?: number | null
          created_at?: string
          date: string
          escalations?: number | null
          id?: string
          successful_resolutions?: number | null
          topics_discussed?: Json | null
          total_conversations?: number | null
        }
        Update: {
          agent_id?: string
          average_response_time?: number | null
          average_satisfaction?: number | null
          created_at?: string
          date?: string
          escalations?: number | null
          id?: string
          successful_resolutions?: number | null
          topics_discussed?: Json | null
          total_conversations?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_analytics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_configurations: {
        Row: {
          agent_id: string
          business_hours: Json | null
          created_at: string
          escalation_rules: Json | null
          function_calling_enabled: boolean | null
          id: string
          knowledge_base_enabled: boolean | null
          language_preferences: Json | null
          max_tokens: number | null
          model: string
          response_style: string | null
          system_prompt: string
          temperature: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          business_hours?: Json | null
          created_at?: string
          escalation_rules?: Json | null
          function_calling_enabled?: boolean | null
          id?: string
          knowledge_base_enabled?: boolean | null
          language_preferences?: Json | null
          max_tokens?: number | null
          model?: string
          response_style?: string | null
          system_prompt: string
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          business_hours?: Json | null
          created_at?: string
          escalation_rules?: Json | null
          function_calling_enabled?: boolean | null
          id?: string
          knowledge_base_enabled?: boolean | null
          language_preferences?: Json | null
          max_tokens?: number | null
          model?: string
          response_style?: string | null
          system_prompt?: string
          temperature?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_configurations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_conversations: {
        Row: {
          agent_id: string
          conversation_data: Json
          created_at: string
          ended_at: string | null
          escalation_reason: string | null
          id: string
          satisfaction_rating: number | null
          sentiment_score: number | null
          session_id: string | null
          user_id: string | null
          was_escalated: boolean | null
        }
        Insert: {
          agent_id: string
          conversation_data?: Json
          created_at?: string
          ended_at?: string | null
          escalation_reason?: string | null
          id?: string
          satisfaction_rating?: number | null
          sentiment_score?: number | null
          session_id?: string | null
          user_id?: string | null
          was_escalated?: boolean | null
        }
        Update: {
          agent_id?: string
          conversation_data?: Json
          created_at?: string
          ended_at?: string | null
          escalation_reason?: string | null
          id?: string
          satisfaction_rating?: number | null
          sentiment_score?: number | null
          session_id?: string | null
          user_id?: string | null
          was_escalated?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_functions: {
        Row: {
          agent_id: string
          created_at: string
          function_description: string
          function_name: string
          id: string
          is_enabled: boolean | null
          parameters: Json
          requires_permission: boolean | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          function_description: string
          function_name: string
          id?: string
          is_enabled?: boolean | null
          parameters: Json
          requires_permission?: boolean | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          function_description?: string
          function_name?: string
          id?: string
          is_enabled?: boolean | null
          parameters?: Json
          requires_permission?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_functions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_knowledge_base: {
        Row: {
          agent_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          priority: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          category: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_knowledge_base_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_type: string
          avatar_url: string | null
          created_at: string
          description: string | null
          display_name: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_type: string
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_type?: string
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string | null
          device_id: string | null
          id: string
          member_id: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["alert_priority"] | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["alert_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description?: string | null
          device_id?: string | null
          id?: string
          member_id: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["alert_priority"] | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["alert_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string | null
          device_id?: string | null
          id?: string
          member_id?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["alert_priority"] | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["alert_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "member_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_participants: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          notes: string | null
          notified_at: string | null
          responded_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          responded_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          responded_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_participants_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          ai_agent_name: string | null
          appointment_type: string
          confirmation_deadline: string | null
          created_at: string
          created_by_ai: boolean | null
          description: string | null
          end_time: string
          facility_id: string | null
          id: string
          location: string | null
          member_id: string | null
          metadata: Json | null
          organizer_id: string
          requires_confirmation: boolean | null
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_agent_name?: string | null
          appointment_type?: string
          confirmation_deadline?: string | null
          created_at?: string
          created_by_ai?: boolean | null
          description?: string | null
          end_time: string
          facility_id?: string | null
          id?: string
          location?: string | null
          member_id?: string | null
          metadata?: Json | null
          organizer_id: string
          requires_confirmation?: boolean | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_agent_name?: string | null
          appointment_type?: string
          confirmation_deadline?: string | null
          created_at?: string
          created_by_ai?: boolean | null
          description?: string | null
          end_time?: string
          facility_id?: string | null
          id?: string
          location?: string | null
          member_id?: string | null
          metadata?: Json | null
          organizer_id?: string
          requires_confirmation?: boolean | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      care_companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_type: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          registration_number: string | null
          service_areas: Json | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_clients: number | null
          total_staff: number | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          service_areas?: Json | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_clients?: number | null
          total_staff?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          service_areas?: Json | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_clients?: number | null
          total_staff?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      care_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          member_id: string
          message: string
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          member_id: string
          message: string
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          member_id?: string
          message?: string
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_messages_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          member_id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          member_id: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          member_id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_notes: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          member_id: string
          note_type: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          member_id: string
          note_type?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          member_id?: string
          note_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      company_clients: {
        Row: {
          assigned_carers: Json | null
          care_plan_id: string | null
          company_id: string
          created_at: string | null
          end_date: string | null
          id: string
          member_id: string
          service_type: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_carers?: Json | null
          care_plan_id?: string | null
          company_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          member_id: string
          service_type?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_carers?: Json | null
          care_plan_id?: string | null
          company_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          member_id?: string
          service_type?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_clients_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      company_staff: {
        Row: {
          company_id: string
          created_at: string | null
          hired_at: string | null
          id: string
          is_company_admin: boolean | null
          staff_role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          hired_at?: string | null
          id?: string
          is_company_admin?: boolean | null
          staff_role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          hired_at?: string | null
          id?: string
          is_company_admin?: boolean | null
          staff_role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_staff_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          last_read_at: string | null
          notifications_enabled: boolean | null
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          notifications_enabled?: boolean | null
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          notifications_enabled?: boolean | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          context_id: string | null
          context_type: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_broadcast: boolean | null
          is_pinned: boolean | null
          last_message_at: string | null
          title: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_broadcast?: boolean | null
          is_pinned?: boolean | null
          last_message_at?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_broadcast?: boolean | null
          is_pinned?: boolean | null
          last_message_at?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      covered_members: {
        Row: {
          coverage_end: string | null
          coverage_start: string | null
          created_at: string | null
          id: string
          insurance_company_id: string
          member_id: string
          policy_id: string | null
          policy_number: string | null
          updated_at: string | null
        }
        Insert: {
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string | null
          id?: string
          insurance_company_id: string
          member_id: string
          policy_id?: string | null
          policy_number?: string | null
          updated_at?: string | null
        }
        Update: {
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string | null
          id?: string
          insurance_company_id?: string
          member_id?: string
          policy_id?: string | null
          policy_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "covered_members_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "covered_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "covered_members_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "insurance_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          amount: number
          applied_to_invoice_id: string | null
          care_company_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          expires_at: string | null
          facility_id: string | null
          id: string
          insurance_company_id: string | null
          member_id: string | null
          reason: string
          remaining_amount: number
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          applied_to_invoice_id?: string | null
          care_company_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          expires_at?: string | null
          facility_id?: string | null
          id?: string
          insurance_company_id?: string | null
          member_id?: string | null
          reason: string
          remaining_amount: number
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          applied_to_invoice_id?: string | null
          care_company_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          expires_at?: string | null
          facility_id?: string | null
          id?: string
          insurance_company_id?: string | null
          member_id?: string | null
          reason?: string
          remaining_amount?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_applied_to_invoice_id_fkey"
            columns: ["applied_to_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_care_company_id_fkey"
            columns: ["care_company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          id: string
          notes: string | null
          organization_name: string
          organization_type: string | null
          preferred_time: string | null
          status: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_name: string
          organization_type?: string | null
          preferred_time?: string | null
          status?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_name?: string
          organization_type?: string | null
          preferred_time?: string | null
          status?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          bed_capacity: number | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          facility_type: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          postal_code: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          bed_capacity?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          bed_capacity?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          facility_type?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      facility_residents: {
        Row: {
          admission_date: string | null
          created_at: string | null
          discharge_date: string | null
          facility_id: string
          id: string
          member_id: string
          room_number: string | null
          updated_at: string | null
        }
        Insert: {
          admission_date?: string | null
          created_at?: string | null
          discharge_date?: string | null
          facility_id: string
          id?: string
          member_id: string
          room_number?: string | null
          updated_at?: string | null
        }
        Update: {
          admission_date?: string | null
          created_at?: string | null
          discharge_date?: string | null
          facility_id?: string
          id?: string
          member_id?: string
          room_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_residents_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_residents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_staff: {
        Row: {
          created_at: string | null
          facility_id: string
          hired_at: string | null
          id: string
          is_facility_admin: boolean | null
          staff_role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          facility_id: string
          hired_at?: string | null
          id?: string
          is_facility_admin?: boolean | null
          staff_role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          facility_id?: string
          hired_at?: string | null
          id?: string
          is_facility_admin?: boolean | null
          staff_role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_staff_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      family_carers: {
        Row: {
          can_receive_alerts: boolean | null
          can_view_medical: boolean | null
          created_at: string | null
          id: string
          invitation_accepted_at: string | null
          is_primary_contact: boolean | null
          relationship_to_member: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          can_receive_alerts?: boolean | null
          can_view_medical?: boolean | null
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          is_primary_contact?: boolean | null
          relationship_to_member: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          can_receive_alerts?: boolean | null
          can_view_medical?: boolean | null
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          is_primary_contact?: boolean | null
          relationship_to_member?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      family_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          invitation_token: string | null
          invited_by: string
          invited_email: string
          member_id: string
          permissions: Json | null
          relationship: string
          status: Database["public"]["Enums"]["invitation_status"] | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_by: string
          invited_email: string
          member_id: string
          permissions?: Json | null
          relationship: string
          status?: Database["public"]["Enums"]["invitation_status"] | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitation_token?: string | null
          invited_by?: string
          invited_email?: string
          member_id?: string
          permissions?: Json | null
          relationship?: string
          status?: Database["public"]["Enums"]["invitation_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_invitations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          member_id: string
          metric_type: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          member_id: string
          metric_type: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          member_id?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "member_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_metrics_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      institutional_registrations: {
        Row: {
          additional_notes: string | null
          address_line1: string | null
          address_line2: string | null
          assigned_to: string | null
          best_time_to_contact: string | null
          budget_range: string | null
          city: string | null
          contact_email: string
          contact_job_title: string | null
          contact_name: string
          contact_phone: string | null
          converted_to_company_id: string | null
          converted_to_facility_id: string | null
          converted_to_insurance_id: string | null
          country: string | null
          created_at: string
          current_systems: string | null
          ehr_systems: string | null
          employee_count: number | null
          follow_up_date: string | null
          gdpr_requirements: string | null
          id: string
          implementation_timeline: string | null
          organization_name: string
          organization_type: string
          postal_code: string | null
          preferred_agreement_length: string | null
          preferred_contact_method: string | null
          procurement_process: string | null
          registration_number: string | null
          resident_count: number | null
          security_requirements: string | null
          service_interests: string[] | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          additional_notes?: string | null
          address_line1?: string | null
          address_line2?: string | null
          assigned_to?: string | null
          best_time_to_contact?: string | null
          budget_range?: string | null
          city?: string | null
          contact_email: string
          contact_job_title?: string | null
          contact_name: string
          contact_phone?: string | null
          converted_to_company_id?: string | null
          converted_to_facility_id?: string | null
          converted_to_insurance_id?: string | null
          country?: string | null
          created_at?: string
          current_systems?: string | null
          ehr_systems?: string | null
          employee_count?: number | null
          follow_up_date?: string | null
          gdpr_requirements?: string | null
          id?: string
          implementation_timeline?: string | null
          organization_name: string
          organization_type: string
          postal_code?: string | null
          preferred_agreement_length?: string | null
          preferred_contact_method?: string | null
          procurement_process?: string | null
          registration_number?: string | null
          resident_count?: number | null
          security_requirements?: string | null
          service_interests?: string[] | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          additional_notes?: string | null
          address_line1?: string | null
          address_line2?: string | null
          assigned_to?: string | null
          best_time_to_contact?: string | null
          budget_range?: string | null
          city?: string | null
          contact_email?: string
          contact_job_title?: string | null
          contact_name?: string
          contact_phone?: string | null
          converted_to_company_id?: string | null
          converted_to_facility_id?: string | null
          converted_to_insurance_id?: string | null
          country?: string | null
          created_at?: string
          current_systems?: string | null
          ehr_systems?: string | null
          employee_count?: number | null
          follow_up_date?: string | null
          gdpr_requirements?: string | null
          id?: string
          implementation_timeline?: string | null
          organization_name?: string
          organization_type?: string
          postal_code?: string | null
          preferred_agreement_length?: string | null
          preferred_contact_method?: string | null
          procurement_process?: string | null
          registration_number?: string | null
          resident_count?: number | null
          security_requirements?: string | null
          service_interests?: string[] | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_registrations_converted_to_company_id_fkey"
            columns: ["converted_to_company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institutional_registrations_converted_to_facility_id_fkey"
            columns: ["converted_to_facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institutional_registrations_converted_to_insurance_id_fkey"
            columns: ["converted_to_insurance_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          insurance_type: string | null
          name: string
          phone: string | null
          postal_code: string | null
          registration_number: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_policies: number | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          insurance_type?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_policies?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          insurance_type?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_policies?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      insurance_policies: {
        Row: {
          coverage_type: string | null
          covered_services: Json | null
          created_at: string | null
          id: string
          insurance_company_id: string
          is_active: boolean | null
          policy_name: string
          premium_range: string | null
          updated_at: string | null
        }
        Insert: {
          coverage_type?: string | null
          covered_services?: Json | null
          created_at?: string | null
          id?: string
          insurance_company_id: string
          is_active?: boolean | null
          policy_name: string
          premium_range?: string | null
          updated_at?: string | null
        }
        Update: {
          coverage_type?: string | null
          covered_services?: Json | null
          created_at?: string | null
          id?: string
          insurance_company_id?: string
          is_active?: boolean | null
          policy_name?: string
          premium_range?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_staff: {
        Row: {
          created_at: string | null
          hired_at: string | null
          id: string
          insurance_company_id: string
          is_admin: boolean | null
          staff_role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hired_at?: string | null
          id?: string
          insurance_company_id: string
          is_admin?: boolean | null
          staff_role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hired_at?: string | null
          id?: string
          insurance_company_id?: string
          is_admin?: boolean | null
          staff_role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_staff_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          product_id: string | null
          product_type: string | null
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          product_id?: string | null
          product_type?: string | null
          quantity?: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          product_id?: string | null
          product_type?: string | null
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          billing_period_end: string | null
          billing_period_start: string | null
          care_company_id: string | null
          created_at: string
          currency: string
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          discount_amount: number | null
          due_date: string | null
          facility_id: string | null
          id: string
          insurance_company_id: string | null
          invoice_number: string
          member_id: string | null
          metadata: Json | null
          notes: string | null
          order_id: string | null
          paid_at: string | null
          pdf_url: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          updated_at: string
        }
        Insert: {
          amount_due?: number
          amount_paid?: number | null
          billing_period_end?: string | null
          billing_period_start?: string | null
          care_company_id?: string | null
          created_at?: string
          currency?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          discount_amount?: number | null
          due_date?: string | null
          facility_id?: string | null
          id?: string
          insurance_company_id?: string | null
          invoice_number: string
          member_id?: string | null
          metadata?: Json | null
          notes?: string | null
          order_id?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          billing_period_end?: string | null
          billing_period_start?: string | null
          care_company_id?: string | null
          created_at?: string
          currency?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          discount_amount?: number | null
          due_date?: string | null
          facility_id?: string | null
          id?: string
          insurance_company_id?: string | null
          invoice_number?: string
          member_id?: string | null
          metadata?: Json | null
          notes?: string | null
          order_id?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_care_company_id_fkey"
            columns: ["care_company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          lead_id: string
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          lead_id: string
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agreement_length: string | null
          assigned_to: string | null
          clara_conversation_id: string | null
          converted_at: string | null
          converted_to_facility_id: string | null
          converted_to_member_id: string | null
          created_at: string | null
          email: string
          estimated_value: number | null
          id: string
          interest_type: string
          last_contacted_at: string | null
          lead_type: string | null
          message: string | null
          name: string
          next_follow_up: string | null
          organization_name: string | null
          organization_type: string | null
          phone: string | null
          resident_count: string | null
          source_page: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          agreement_length?: string | null
          assigned_to?: string | null
          clara_conversation_id?: string | null
          converted_at?: string | null
          converted_to_facility_id?: string | null
          converted_to_member_id?: string | null
          created_at?: string | null
          email: string
          estimated_value?: number | null
          id?: string
          interest_type: string
          last_contacted_at?: string | null
          lead_type?: string | null
          message?: string | null
          name: string
          next_follow_up?: string | null
          organization_name?: string | null
          organization_type?: string | null
          phone?: string | null
          resident_count?: string | null
          source_page?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          agreement_length?: string | null
          assigned_to?: string | null
          clara_conversation_id?: string | null
          converted_at?: string | null
          converted_to_facility_id?: string | null
          converted_to_member_id?: string | null
          created_at?: string | null
          email?: string
          estimated_value?: number | null
          id?: string
          interest_type?: string
          last_contacted_at?: string | null
          lead_type?: string | null
          message?: string | null
          name?: string
          next_follow_up?: string | null
          organization_name?: string | null
          organization_type?: string | null
          phone?: string | null
          resident_count?: string | null
          source_page?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_clara_conversation_id_fkey"
            columns: ["clara_conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_agent_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_to_facility_id_fkey"
            columns: ["converted_to_facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_to_member_id_fkey"
            columns: ["converted_to_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_carers: {
        Row: {
          accepted_at: string | null
          carer_id: string
          id: string
          invited_at: string | null
          invited_by: string | null
          member_id: string
        }
        Insert: {
          accepted_at?: string | null
          carer_id: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          member_id: string
        }
        Update: {
          accepted_at?: string | null
          carer_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_carers_carer_id_fkey"
            columns: ["carer_id"]
            isOneToOne: false
            referencedRelation: "family_carers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_carers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_devices: {
        Row: {
          battery_level: number | null
          created_at: string | null
          device_name: string
          device_serial: string | null
          device_status: Database["public"]["Enums"]["device_status"] | null
          device_type: Database["public"]["Enums"]["device_type"]
          id: string
          last_sync_at: string | null
          member_id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          device_name: string
          device_serial?: string | null
          device_status?: Database["public"]["Enums"]["device_status"] | null
          device_type: Database["public"]["Enums"]["device_type"]
          id?: string
          last_sync_at?: string | null
          member_id: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          device_name?: string
          device_serial?: string | null
          device_status?: Database["public"]["Enums"]["device_status"] | null
          device_type?: Database["public"]["Enums"]["device_type"]
          id?: string
          last_sync_at?: string | null
          member_id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_devices_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          allergies: string[] | null
          care_level: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          mobility_level: string | null
          postal_code: string | null
          subscription_started_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string[] | null
          care_level?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          mobility_level?: string | null
          postal_code?: string | null
          subscription_started_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string[] | null
          care_level?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          mobility_level?: string | null
          postal_code?: string | null
          subscription_started_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nurse_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          member_id: string
          notes: string | null
          nurse_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          member_id: string
          notes?: string | null
          nurse_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          member_id?: string
          notes?: string | null
          nurse_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nurse_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      nurse_tasks: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          member_id: string
          notes: string | null
          nurse_id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          member_id: string
          notes?: string | null
          nurse_id: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          nurse_id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nurse_tasks_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          completed_at: string | null
          conversation_id: string | null
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          language: string | null
          lead_id: string | null
          payment_status: string | null
          plan_id: string | null
          selected_devices: Json | null
          session_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_monthly: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          language?: string | null
          lead_id?: string | null
          payment_status?: string | null
          plan_id?: string | null
          selected_devices?: Json | null
          session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_monthly?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          language?: string | null
          lead_id?: string | null
          payment_status?: string | null
          plan_id?: string | null
          selected_devices?: Json | null
          session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_monthly?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_agent_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_translations: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          language: string
          name: string
          plan_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          language: string
          name: string
          plan_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          language?: string
          name?: string
          plan_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_translations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: string | null
          published_at: string | null
          target_roles: Database["public"]["Enums"]["app_role"][] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          published_at?: string | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          published_at?: string | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_messages: {
        Row: {
          attachments: Json | null
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          priority: string | null
          sender_id: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          priority?: string | null
          sender_id: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          priority?: string | null
          sender_id?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_messages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          created_at: string | null
          devices_included: number | null
          family_dashboards: number | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          monthly_price: number
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          devices_included?: number | null
          family_dashboards?: number | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_price: number
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          devices_included?: number | null
          family_dashboards?: number | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          monthly_price?: number
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_translations: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          language: string
          name: string
          price_display: string | null
          product_id: string
          specs: Json | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          language: string
          name: string
          price_display?: string | null
          product_id: string
          specs?: Json | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          language?: string
          name?: string
          price_display?: string | null
          product_id?: string
          specs?: Json | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          color_class: string | null
          created_at: string | null
          gradient_class: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_base_device: boolean | null
          is_popular: boolean | null
          monthly_price: number | null
          product_type: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          color_class?: string | null
          created_at?: string | null
          gradient_class?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_base_device?: boolean | null
          is_popular?: boolean | null
          monthly_price?: number | null
          product_type?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          color_class?: string | null
          created_at?: string | null
          gradient_class?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_base_device?: boolean | null
          is_popular?: boolean | null
          monthly_price?: number | null
          product_type?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          invitation_token: string | null
          invited_at: string | null
          language: string | null
          last_name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          status: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          invitation_token?: string | null
          invited_at?: string | null
          language?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          invitation_token?: string | null
          invited_at?: string | null
          language?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          contact_email: string
          contract_length: string | null
          created_at: string | null
          estimated_price: string | null
          features_needed: Json | null
          id: string
          organization_name: string
          resident_count: number | null
          status: string | null
        }
        Insert: {
          contact_email: string
          contract_length?: string | null
          created_at?: string | null
          estimated_price?: string | null
          features_needed?: Json | null
          id?: string
          organization_name: string
          resident_count?: number | null
          status?: string | null
        }
        Update: {
          contact_email?: string
          contract_length?: string | null
          created_at?: string | null
          estimated_price?: string | null
          features_needed?: Json | null
          id?: string
          organization_name?: string
          resident_count?: number | null
          status?: string | null
        }
        Relationships: []
      }
      revenue_snapshots: {
        Row: {
          active_members: number | null
          arr: number | null
          avg_revenue_per_user: number | null
          churn_rate: number | null
          churned_mrr: number | null
          churned_subscriptions: number | null
          contraction_mrr: number | null
          created_at: string
          expansion_mrr: number | null
          id: string
          metadata: Json | null
          mrr: number | null
          net_mrr_change: number | null
          new_mrr: number | null
          new_subscriptions: number | null
          payment_success_rate: number | null
          period_type: string
          snapshot_date: string
          total_revenue: number | null
          total_subscriptions: number | null
        }
        Insert: {
          active_members?: number | null
          arr?: number | null
          avg_revenue_per_user?: number | null
          churn_rate?: number | null
          churned_mrr?: number | null
          churned_subscriptions?: number | null
          contraction_mrr?: number | null
          created_at?: string
          expansion_mrr?: number | null
          id?: string
          metadata?: Json | null
          mrr?: number | null
          net_mrr_change?: number | null
          new_mrr?: number | null
          new_subscriptions?: number | null
          payment_success_rate?: number | null
          period_type: string
          snapshot_date: string
          total_revenue?: number | null
          total_subscriptions?: number | null
        }
        Update: {
          active_members?: number | null
          arr?: number | null
          avg_revenue_per_user?: number | null
          churn_rate?: number | null
          churned_mrr?: number | null
          churned_subscriptions?: number | null
          contraction_mrr?: number | null
          created_at?: string
          expansion_mrr?: number | null
          id?: string
          metadata?: Json | null
          mrr?: number | null
          net_mrr_change?: number | null
          new_mrr?: number | null
          new_subscriptions?: number | null
          payment_success_rate?: number | null
          period_type?: string
          snapshot_date?: string
          total_revenue?: number | null
          total_subscriptions?: number | null
        }
        Relationships: []
      }
      subscription_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          product_id: string | null
          product_type: string
          quantity: number
          subscription_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          product_id?: string | null
          product_type: string
          quantity?: number
          subscription_id: string
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          product_id?: string | null
          product_type?: string
          quantity?: number
          subscription_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_interval: string
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          care_company_id: string | null
          created_at: string
          currency: string
          current_period_end: string
          current_period_start: string
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          facility_id: string | null
          id: string
          insurance_company_id: string | null
          member_id: string | null
          metadata: Json | null
          monthly_amount: number
          paused_at: string | null
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          billing_interval?: string
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          care_company_id?: string | null
          created_at?: string
          currency?: string
          current_period_end: string
          current_period_start?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          facility_id?: string | null
          id?: string
          insurance_company_id?: string | null
          member_id?: string | null
          metadata?: Json | null
          monthly_amount?: number
          paused_at?: string | null
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          care_company_id?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string
          current_period_start?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          facility_id?: string | null
          id?: string
          insurance_company_id?: string | null
          member_id?: string | null
          metadata?: Json | null
          monthly_amount?: number
          paused_at?: string | null
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_care_company_id_fkey"
            columns: ["care_company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_sensitive: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          setting_key: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          card_brand: string | null
          card_last_four: string | null
          care_company_id: string | null
          created_at: string
          currency: string
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          description: string | null
          facility_id: string | null
          failure_reason: string | null
          id: string
          insurance_company_id: string | null
          invoice_id: string | null
          member_id: string | null
          metadata: Json | null
          payment_method: string | null
          processed_at: string | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          subscription_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          card_brand?: string | null
          card_last_four?: string | null
          care_company_id?: string | null
          created_at?: string
          currency?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          description?: string | null
          facility_id?: string | null
          failure_reason?: string | null
          id?: string
          insurance_company_id?: string | null
          invoice_id?: string | null
          member_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          subscription_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          card_brand?: string | null
          card_last_four?: string | null
          care_company_id?: string | null
          created_at?: string
          currency?: string
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          description?: string | null
          facility_id?: string | null
          failure_reason?: string | null
          id?: string
          insurance_company_id?: string | null
          invoice_id?: string | null
          member_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          subscription_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_care_company_id_fkey"
            columns: ["care_company_id"]
            isOneToOne: false
            referencedRelation: "care_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          created_at: string | null
          granted: boolean
          granted_at: string | null
          id: string
          ip_address: unknown
          revoked_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          created_at?: string | null
          granted: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown
          revoked_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consent_type?: Database["public"]["Enums"]["consent_type"]
          created_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown
          revoked_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      get_user_facility_id: { Args: { _user_id: string }; Returns: string }
      get_user_insurance_company_id: {
        Args: { _user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_nurse_assigned_to_member: {
        Args: { p_member_id: string; p_nurse_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_priority: "low" | "medium" | "high" | "critical"
      alert_status:
        | "new"
        | "acknowledged"
        | "in_progress"
        | "resolved"
        | "dismissed"
      app_role:
        | "admin"
        | "member"
        | "family_carer"
        | "nurse"
        | "facility_admin"
        | "company_admin"
        | "insurance_admin"
      consent_type:
        | "terms_of_service"
        | "privacy_policy"
        | "data_processing"
        | "marketing"
      customer_type:
        | "member"
        | "facility"
        | "care_company"
        | "insurance_company"
      device_status: "active" | "inactive" | "error" | "needs_battery"
      device_type:
        | "vivago_watch"
        | "dosell_dispenser"
        | "bbrain_sensor"
        | "heart_monitor"
        | "fall_detector"
        | "other"
      invitation_status: "pending" | "accepted" | "declined" | "expired"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "cancelled"
        | "incomplete"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
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
      alert_priority: ["low", "medium", "high", "critical"],
      alert_status: [
        "new",
        "acknowledged",
        "in_progress",
        "resolved",
        "dismissed",
      ],
      app_role: [
        "admin",
        "member",
        "family_carer",
        "nurse",
        "facility_admin",
        "company_admin",
        "insurance_admin",
      ],
      consent_type: [
        "terms_of_service",
        "privacy_policy",
        "data_processing",
        "marketing",
      ],
      customer_type: [
        "member",
        "facility",
        "care_company",
        "insurance_company",
      ],
      device_status: ["active", "inactive", "error", "needs_battery"],
      device_type: [
        "vivago_watch",
        "dosell_dispenser",
        "bbrain_sensor",
        "heart_monitor",
        "fall_detector",
        "other",
      ],
      invitation_status: ["pending", "accepted", "declined", "expired"],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "cancelled",
        "incomplete",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
