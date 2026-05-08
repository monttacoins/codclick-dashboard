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
      app_config: {
        Row: {
          created_at: string | null
          key: string
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          value?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          after_photo_url: string | null
          before_photo_url: string | null
          check_in_at: string | null
          check_out_at: string | null
          created_at: string
          department_id: Database["public"]["Enums"]["department_id"]
          employee_id: string | null
          id: string
          notes: string | null
          owner_id: string
          package_id: string | null
          pet_id: string
          price: number
          scheduled_at: string
          service_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          check_in_at?: string | null
          check_out_at?: string | null
          created_at?: string
          department_id: Database["public"]["Enums"]["department_id"]
          employee_id?: string | null
          id?: string
          notes?: string | null
          owner_id: string
          package_id?: string | null
          pet_id: string
          price?: number
          scheduled_at: string
          service_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          check_in_at?: string | null
          check_out_at?: string | null
          created_at?: string
          department_id?: Database["public"]["Enums"]["department_id"]
          employee_id?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          package_id?: string | null
          pet_id?: string
          price?: number
          scheduled_at?: string
          service_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_packages: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          owner_id: string
          package_id: string
          pet_id: string
          purchased_at: string
          remaining_uses: number
          used_appointments: string[] | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          owner_id: string
          package_id: string
          pet_id: string
          purchased_at?: string
          remaining_uses: number
          used_appointments?: string[] | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          owner_id?: string
          package_id?: string
          pet_id?: string
          purchased_at?: string
          remaining_uses?: number
          used_appointments?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_packages_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_packages_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          active: boolean
          commission_enabled: boolean
          commission_percentage: number | null
          created_at: string
          departments: Database["public"]["Enums"]["department_id"][] | null
          email: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          role: Database["public"]["Enums"]["employee_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          commission_enabled?: boolean
          commission_percentage?: number | null
          created_at?: string
          departments?: Database["public"]["Enums"]["department_id"][] | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          commission_enabled?: boolean
          commission_percentage?: number | null
          created_at?: string
          departments?: Database["public"]["Enums"]["department_id"][] | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      empresa_config: {
        Row: {
          created_at: string
          id: string
          logo: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo?: string
          nome?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      ferramentas: {
        Row: {
          created_at: string
          icone_url: string | null
          id: string
          link: string
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icone_url?: string | null
          id?: string
          link?: string
          nome: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icone_url?: string | null
          id?: string
          link?: string
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      keep_alive: {
        Row: {
          check: string | null
          created_at: string
          id: number
        }
        Insert: {
          check?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          check?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      owners: {
        Row: {
          address: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          allergies: string[] | null
          behaviors: Json | null
          birth_date: string | null
          breed: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          owner_id: string
          photo_url: string | null
          size: Database["public"]["Enums"]["pet_size"]
          species: Database["public"]["Enums"]["pet_species"]
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          behaviors?: Json | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          owner_id: string
          photo_url?: string | null
          size?: Database["public"]["Enums"]["pet_size"]
          species?: Database["public"]["Enums"]["pet_species"]
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          behaviors?: Json | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          size?: Database["public"]["Enums"]["pet_size"]
          species?: Database["public"]["Enums"]["pet_species"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sales: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          notes: string | null
          owner_id: string | null
          payment_method: string | null
          pet_id: string | null
          product_id: string
          quantity: number
          total_amount: number
          transaction_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          payment_method?: string | null
          pet_id?: string | null
          product_id: string
          quantity?: number
          total_amount: number
          transaction_id?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          payment_method?: string | null
          pet_id?: string | null
          product_id?: string
          quantity?: number
          total_amount?: number
          transaction_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string
          created_at: string
          id: string
          name: string
          price: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          id?: string
          name: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_packages: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          discounted_price: number
          id: string
          name: string
          original_price: number
          quantity: number
          service_id: string
          updated_at: string
          validity_days: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          discounted_price: number
          id?: string
          name: string
          original_price: number
          quantity?: number
          service_id: string
          updated_at?: string
          validity_days?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          discounted_price?: number
          id?: string
          name?: string
          original_price?: number
          quantity?: number
          service_id?: string
          updated_at?: string
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          commission_percentage: number | null
          created_at: string
          department_id: Database["public"]["Enums"]["department_id"]
          duration: number
          id: string
          name: string
          price: number
        }
        Insert: {
          active?: boolean
          commission_percentage?: number | null
          created_at?: string
          department_id: Database["public"]["Enums"]["department_id"]
          duration?: number
          id?: string
          name: string
          price?: number
        }
        Update: {
          active?: boolean
          commission_percentage?: number | null
          created_at?: string
          department_id?: Database["public"]["Enums"]["department_id"]
          duration?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      tabela_precos_goodzap: {
        Row: {
          active: boolean
          commission_percentage: number | null
          created_at: string
          department_id: Database["public"]["Enums"]["department_id"]
          duration: number
          id: string
          name: string
          price_grande_porte: number | null
          price_medio_porte: number | null
          price_pequeno_porte: number
        }
        Insert: {
          active?: boolean
          commission_percentage?: number | null
          created_at?: string
          department_id: Database["public"]["Enums"]["department_id"]
          duration?: number
          id?: string
          name: string
          price_grande_porte?: number | null
          price_medio_porte?: number | null
          price_pequeno_porte?: number
        }
        Update: {
          active?: boolean
          commission_percentage?: number | null
          created_at?: string
          department_id?: Database["public"]["Enums"]["department_id"]
          duration?: number
          id?: string
          name?: string
          price_grande_porte?: number | null
          price_medio_porte?: number | null
          price_pequeno_porte?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          category: Database["public"]["Enums"]["transaction_category"]
          created_at: string
          date: string
          description: string
          employee_id: string | null
          id: string
          payment_method: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          category: Database["public"]["Enums"]["transaction_category"]
          created_at?: string
          date?: string
          description: string
          employee_id?: string | null
          id?: string
          payment_method?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          category?: Database["public"]["Enums"]["transaction_category"]
          created_at?: string
          date?: string
          description?: string
          employee_id?: string | null
          id?: string
          payment_method?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      user_tool_order: {
        Row: {
          created_at: string
          ferramenta_id: string
          id: string
          ordem: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ferramenta_id: string
          id?: string
          ordem?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ferramenta_id?: string
          id?: string
          ordem?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tool_order_ferramenta_id_fkey"
            columns: ["ferramenta_id"]
            isOneToOne: false
            referencedRelation: "ferramentas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "colaborador"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "checked_in"
        | "in_progress"
        | "completed"
        | "cancelled"
      department_id:
        | "estetica"
        | "saude"
        | "educacao"
        | "estadia"
        | "logistica"
        | "produtos"
      employee_role:
        | "admin"
        | "manager"
        | "groomer"
        | "veterinarian"
        | "trainer"
        | "receptionist"
        | "driver"
      pet_size: "small" | "medium" | "large" | "giant"
      pet_species: "dog" | "cat" | "bird" | "other"
      transaction_category:
        | "service"
        | "product"
        | "package"
        | "commission"
        | "other"
      transaction_type: "income" | "expense"
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
      app_role: ["admin", "colaborador"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
      ],
      department_id: [
        "estetica",
        "saude",
        "educacao",
        "estadia",
        "logistica",
        "produtos",
      ],
      employee_role: [
        "admin",
        "manager",
        "groomer",
        "veterinarian",
        "trainer",
        "receptionist",
        "driver",
      ],
      pet_size: ["small", "medium", "large", "giant"],
      pet_species: ["dog", "cat", "bird", "other"],
      transaction_category: [
        "service",
        "product",
        "package",
        "commission",
        "other",
      ],
      transaction_type: ["income", "expense"],
    },
  },
} as const
