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
      audit_log: {
        Row: {
          actor: string | null
          aksi: string
          created_at: string
          entitas: string
          entitas_id: string
          id: string
          perubahan: Json | null
        }
        Insert: {
          actor?: string | null
          aksi: string
          created_at?: string
          entitas: string
          entitas_id: string
          id?: string
          perubahan?: Json | null
        }
        Update: {
          actor?: string | null
          aksi?: string
          created_at?: string
          entitas?: string
          entitas_id?: string
          id?: string
          perubahan?: Json | null
        }
        Relationships: []
      }
      evaluasi: {
        Row: {
          availability: number
          created_at: string
          id: string
          kualitas: number
          nilai_akhir: number
          penugasan_id: string
          pewawancara_id: string
          substansi: number
        }
        Insert: {
          availability: number
          created_at?: string
          id?: string
          kualitas: number
          nilai_akhir: number
          penugasan_id: string
          pewawancara_id: string
          substansi: number
        }
        Update: {
          availability?: number
          created_at?: string
          id?: string
          kualitas?: number
          nilai_akhir?: number
          penugasan_id?: string
          pewawancara_id?: string
          substansi?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluasi_penugasan_id_fkey"
            columns: ["penugasan_id"]
            isOneToOne: false
            referencedRelation: "penugasan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluasi_pewawancara_id_fkey"
            columns: ["pewawancara_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
        ]
      }
      jadwal_mendatang: {
        Row: {
          bank: string
          calon: string
          created_at: string
          eksternal1_id: string | null
          eksternal2_id: string | null
          id: string
          internal: string
          jabatan: string
          tanggal: string
          undangan_terkirim: boolean
          waktu: string
        }
        Insert: {
          bank: string
          calon: string
          created_at?: string
          eksternal1_id?: string | null
          eksternal2_id?: string | null
          id: string
          internal: string
          jabatan: string
          tanggal: string
          undangan_terkirim?: boolean
          waktu: string
        }
        Update: {
          bank?: string
          calon?: string
          created_at?: string
          eksternal1_id?: string | null
          eksternal2_id?: string | null
          id?: string
          internal?: string
          jabatan?: string
          tanggal?: string
          undangan_terkirim?: boolean
          waktu?: string
        }
        Relationships: [
          {
            foreignKeyName: "jadwal_mendatang_eksternal1_id_fkey"
            columns: ["eksternal1_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jadwal_mendatang_eksternal2_id_fkey"
            columns: ["eksternal2_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
        ]
      }
      karir: {
        Row: {
          id: string
          instansi: string
          jabatan: string
          periode: string
          pewawancara_id: string
          urutan: number
        }
        Insert: {
          id?: string
          instansi: string
          jabatan: string
          periode: string
          pewawancara_id: string
          urutan?: number
        }
        Update: {
          id?: string
          instansi?: string
          jabatan?: string
          periode?: string
          pewawancara_id?: string
          urutan?: number
        }
        Relationships: [
          {
            foreignKeyName: "karir_pewawancara_id_fkey"
            columns: ["pewawancara_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
        ]
      }
      keahlian: {
        Row: {
          id: string
          nama: string
          pewawancara_id: string
        }
        Insert: {
          id?: string
          nama: string
          pewawancara_id: string
        }
        Update: {
          id?: string
          nama?: string
          pewawancara_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "keahlian_pewawancara_id_fkey"
            columns: ["pewawancara_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
        ]
      }
      notifikasi: {
        Row: {
          created_at: string
          dibaca: boolean
          id: string
          judul: string
          pesan: string
          tipe: Database["public"]["Enums"]["notifikasi_tipe"]
        }
        Insert: {
          created_at?: string
          dibaca?: boolean
          id?: string
          judul: string
          pesan: string
          tipe?: Database["public"]["Enums"]["notifikasi_tipe"]
        }
        Update: {
          created_at?: string
          dibaca?: boolean
          id?: string
          judul?: string
          pesan?: string
          tipe?: Database["public"]["Enums"]["notifikasi_tipe"]
        }
        Relationships: []
      }
      pendidikan: {
        Row: {
          bidang: string
          id: string
          institusi: string
          jenjang: string
          pewawancara_id: string
          urutan: number
        }
        Insert: {
          bidang: string
          id?: string
          institusi: string
          jenjang: string
          pewawancara_id: string
          urutan?: number
        }
        Update: {
          bidang?: string
          id?: string
          institusi?: string
          jenjang?: string
          pewawancara_id?: string
          urutan?: number
        }
        Relationships: [
          {
            foreignKeyName: "pendidikan_pewawancara_id_fkey"
            columns: ["pewawancara_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
        ]
      }
      penugasan: {
        Row: {
          bank: string
          calon: string
          created_at: string
          eksternal1_id: string | null
          eksternal2_nama: string | null
          id: string
          internal: string
          jabatan: string
          status: Database["public"]["Enums"]["penugasan_status"]
          tanggal: string
        }
        Insert: {
          bank: string
          calon: string
          created_at?: string
          eksternal1_id?: string | null
          eksternal2_nama?: string | null
          id: string
          internal: string
          jabatan: string
          status?: Database["public"]["Enums"]["penugasan_status"]
          tanggal: string
        }
        Update: {
          bank?: string
          calon?: string
          created_at?: string
          eksternal1_id?: string | null
          eksternal2_nama?: string | null
          id?: string
          internal?: string
          jabatan?: string
          status?: Database["public"]["Enums"]["penugasan_status"]
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "penugasan_eksternal1_id_fkey"
            columns: ["eksternal1_id"]
            isOneToOne: false
            referencedRelation: "pewawancara"
            referencedColumns: ["id"]
          },
        ]
      }
      pewawancara: {
        Row: {
          catatan: string | null
          created_at: string
          email: string | null
          id: string
          inisial: string
          instansi_terakhir: string
          jabatan_terakhir: string
          nama: string
          nik: string | null
          no_telepon: string | null
          nomor_sk: string | null
          npwp: string | null
          rekening: string | null
          status: Database["public"]["Enums"]["pewawancara_status"]
          tanggal_bergabung: string | null
          tanggal_sk: string | null
          tanggal_sk_expire: string | null
          updated_at: string
          warna: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          email?: string | null
          id: string
          inisial: string
          instansi_terakhir: string
          jabatan_terakhir: string
          nama: string
          nik?: string | null
          no_telepon?: string | null
          nomor_sk?: string | null
          npwp?: string | null
          rekening?: string | null
          status?: Database["public"]["Enums"]["pewawancara_status"]
          tanggal_bergabung?: string | null
          tanggal_sk?: string | null
          tanggal_sk_expire?: string | null
          updated_at?: string
          warna: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          email?: string | null
          id?: string
          inisial?: string
          instansi_terakhir?: string
          jabatan_terakhir?: string
          nama?: string
          nik?: string | null
          no_telepon?: string | null
          nomor_sk?: string | null
          npwp?: string | null
          rekening?: string | null
          status?: Database["public"]["Enums"]["pewawancara_status"]
          tanggal_bergabung?: string | null
          tanggal_sk?: string | null
          tanggal_sk_expire?: string | null
          updated_at?: string
          warna?: string
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
      notifikasi_tipe: "warning" | "info" | "success" | "urgent"
      penugasan_status: "selesai" | "terjadwal"
      pewawancara_status: "aktif" | "tidak_aktif" | "baru_terdaftar"
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
      notifikasi_tipe: ["warning", "info", "success", "urgent"],
      penugasan_status: ["selesai", "terjadwal"],
      pewawancara_status: ["aktif", "tidak_aktif", "baru_terdaftar"],
    },
  },
} as const
