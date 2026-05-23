import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type {
  Pewawancara,
  Penugasan,
  Evaluasi,
  JadwalMendatang,
  Notifikasi,
  Status,
} from "./seed";

// ---------- Pewawancara ----------
async function fetchPewawancara(): Promise<Pewawancara[]> {
  const [{ data: pw }, { data: pd }, { data: kr }, { data: kh }] = await Promise.all([
    supabase.from("pewawancara").select("*").order("nama"),
    supabase.from("pendidikan").select("*").order("urutan"),
    supabase.from("karir").select("*").order("urutan"),
    supabase.from("keahlian").select("*"),
  ]);
  return (pw ?? []).map((p) => ({
    id: p.id,
    nama: p.nama,
    jabatanTerakhir: p.jabatan_terakhir,
    instansiTerakhir: p.instansi_terakhir,
    inisial: p.inisial,
    warna: p.warna,
    status: p.status as Status,
    nik: p.nik ?? "",
    npwp: p.npwp ?? "",
    noTelepon: p.no_telepon ?? "",
    email: p.email ?? undefined,
    rekening: p.rekening ?? "",
    tanggalBergabung: p.tanggal_bergabung ?? "",
    tanggalSK: p.tanggal_sk ?? "",
    tanggalSKExpire: p.tanggal_sk_expire ?? "",
    nomorSK: p.nomor_sk ?? "",
    fotoUrl: (p as { foto_url?: string | null }).foto_url ?? undefined,
    pendidikan: (pd ?? [])
      .filter((x) => x.pewawancara_id === p.id)
      .map((x) => ({ jenjang: x.jenjang, bidang: x.bidang, institusi: x.institusi })),
    karir: (kr ?? [])
      .filter((x) => x.pewawancara_id === p.id)
      .map((x) => ({ jabatan: x.jabatan, instansi: x.instansi, periode: x.periode })),
    keahlian: (kh ?? []).filter((x) => x.pewawancara_id === p.id).map((x) => x.nama),
    catatan: p.catatan ?? undefined,
  }));
}

export function usePewawancara() {
  const q = useQuery({ queryKey: ["pewawancara"], queryFn: fetchPewawancara });
  return { data: q.data ?? [], isLoading: q.isLoading };
}

export function usePewawancaraById(id: string | undefined) {
  const { data } = usePewawancara();
  return data.find((p) => p.id === id);
}

// ---------- Penugasan ----------
async function fetchPenugasan(): Promise<Penugasan[]> {
  const { data } = await supabase.from("penugasan").select("*").order("tanggal");
  return (data ?? []).map((p) => ({
    id: p.id,
    tanggal: p.tanggal,
    bank: p.bank,
    calon: p.calon,
    jabatan: p.jabatan,
    internal: p.internal,
    eksternal1Id: p.eksternal1_id ?? "",
    eksternal2Nama: p.eksternal2_nama ?? "",
    status: p.status as "selesai" | "terjadwal",
  }));
}
export function usePenugasan() {
  const q = useQuery({ queryKey: ["penugasan"], queryFn: fetchPenugasan });
  return { data: q.data ?? [], isLoading: q.isLoading };
}

// ---------- Evaluasi ----------
async function fetchEvaluasi(): Promise<Evaluasi[]> {
  const { data } = await supabase.from("evaluasi").select("*");
  return (data ?? []).map((e) => ({
    penugasanId: e.penugasan_id,
    pewawancaraId: e.pewawancara_id,
    availability: e.availability,
    kualitas: e.kualitas,
    substansi: e.substansi,
    nilaiAkhir: Number(e.nilai_akhir),
  }));
}
export function useEvaluasi() {
  const q = useQuery({ queryKey: ["evaluasi"], queryFn: fetchEvaluasi });
  return { data: q.data ?? [], isLoading: q.isLoading };
}

// ---------- Jadwal Mendatang ----------
async function fetchJadwal(): Promise<JadwalMendatang[]> {
  const { data } = await supabase.from("jadwal_mendatang").select("*").order("tanggal");
  return (data ?? []).map((j) => ({
    id: j.id,
    tanggal: j.tanggal,
    waktu: j.waktu,
    bank: j.bank,
    calon: j.calon,
    jabatan: j.jabatan,
    internal: j.internal,
    eksternal1Id: j.eksternal1_id ?? undefined,
    eksternal2Id: j.eksternal2_id ?? undefined,
    undanganTerkirim: j.undangan_terkirim,
  }));
}
export function useJadwalMendatang() {
  const q = useQuery({ queryKey: ["jadwal_mendatang"], queryFn: fetchJadwal });
  return { data: q.data ?? [], isLoading: q.isLoading };
}

// ---------- Notifikasi ----------
async function fetchNotifikasi(): Promise<Notifikasi[]> {
  const { data } = await supabase
    .from("notifikasi")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map((n) => ({
    id: n.id,
    judul: n.judul,
    pesan: n.pesan,
    tipe: n.tipe as Notifikasi["tipe"],
    waktu: timeAgo(n.created_at),
  }));
}
export function useNotifikasi() {
  const q = useQuery({ queryKey: ["notifikasi"], queryFn: fetchNotifikasi });
  return { data: q.data ?? [], isLoading: q.isLoading };
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return `${Math.floor(diff / 604800)} minggu lalu`;
}

// ---------- helpers ----------
export const byId = <T extends { id: string }>(arr: T[], id?: string) =>
  arr.find((x) => x.id === id);

// ============= MUTATIONS =============

export type JadwalInput = {
  id?: string;
  tanggal: string;
  waktu: string;
  bank: string;
  calon: string;
  jabatan: string;
  internal: string;
  eksternal1Id?: string;
  eksternal2Id?: string;
  undanganTerkirim?: boolean;
};

export function useUpsertJadwal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: JadwalInput) => {
      const id = input.id ?? `JD-${Date.now().toString(36).toUpperCase()}`;
      const row = {
        id,
        tanggal: input.tanggal,
        waktu: input.waktu,
        bank: input.bank,
        calon: input.calon,
        jabatan: input.jabatan,
        internal: input.internal,
        eksternal1_id: input.eksternal1Id || null,
        eksternal2_id: input.eksternal2Id || null,
        undangan_terkirim: input.undanganTerkirim ?? false,
      };
      const { error } = await supabase.from("jadwal_mendatang").upsert(row);
      if (error) throw error;
      await supabase.from("audit_log").insert({
        aksi: input.id ? "UPDATE" : "CREATE",
        entitas: "jadwal_mendatang",
        entitas_id: id,
        actor: "system",
        perubahan: row,
      });
      return id;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["jadwal_mendatang"] });
      toast.success(v.id ? "Jadwal diperbarui" : "Jadwal baru ditambahkan");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

export function useDeleteJadwal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jadwal_mendatang").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("audit_log").insert({
        aksi: "DELETE", entitas: "jadwal_mendatang", entitas_id: id, actor: "system",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jadwal_mendatang"] });
      toast.success("Jadwal dihapus");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

export function useKirimUndangan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("jadwal_mendatang")
        .update({ undangan_terkirim: true })
        .eq("id", id);
      if (error) throw error;
      await supabase.from("notifikasi").insert({
        judul: "Undangan terkirim",
        pesan: `Undangan sesi ${id} berhasil dikirim ke pewawancara eksternal.`,
        tipe: "success",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jadwal_mendatang"] });
      qc.invalidateQueries({ queryKey: ["notifikasi"] });
      toast.success("Undangan terkirim");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

export type PenugasanInput = {
  id?: string;
  tanggal: string;
  bank: string;
  calon: string;
  jabatan: string;
  internal: string;
  eksternal1Id?: string;
  eksternal2Nama?: string;
  status?: "selesai" | "terjadwal";
};

export function useUpsertPenugasan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PenugasanInput) => {
      const id = input.id ?? `PG-${Date.now().toString(36).toUpperCase()}`;
      const row = {
        id,
        tanggal: input.tanggal,
        bank: input.bank,
        calon: input.calon,
        jabatan: input.jabatan,
        internal: input.internal,
        eksternal1_id: input.eksternal1Id || null,
        eksternal2_nama: input.eksternal2Nama || null,
        status: input.status ?? "selesai",
      };
      const { error } = await supabase.from("penugasan").upsert(row);
      if (error) throw error;
      await supabase.from("audit_log").insert({
        aksi: input.id ? "UPDATE" : "CREATE",
        entitas: "penugasan",
        entitas_id: id,
        actor: "system",
        perubahan: row,
      });
      return id;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["penugasan"] });
      toast.success(v.id ? "Sesi diperbarui" : "Sesi baru dicatat");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

export function useDeletePenugasan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("penugasan").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("audit_log").insert({
        aksi: "DELETE", entitas: "penugasan", entitas_id: id, actor: "system",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["penugasan"] });
      toast.success("Sesi dihapus");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

// Tandai jadwal mendatang selesai → pindah ke tabel penugasan
export function useTandaiSelesai() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jadwal: JadwalMendatang) => {
      const pewawancaraRes = await supabase.from("pewawancara").select("id,nama").in(
        "id",
        [jadwal.eksternal2Id].filter(Boolean) as string[],
      );
      const eks2Nama =
        pewawancaraRes.data?.find((p) => p.id === jadwal.eksternal2Id)?.nama ?? "";
      const pgId = `PG-${Date.now().toString(36).toUpperCase()}`;
      const { error: e1 } = await supabase.from("penugasan").insert({
        id: pgId,
        tanggal: jadwal.tanggal,
        bank: jadwal.bank,
        calon: jadwal.calon,
        jabatan: jadwal.jabatan,
        internal: jadwal.internal,
        eksternal1_id: jadwal.eksternal1Id || null,
        eksternal2_nama: eks2Nama,
        status: "selesai",
      });
      if (e1) throw e1;
      const { error: e2 } = await supabase
        .from("jadwal_mendatang").delete().eq("id", jadwal.id);
      if (e2) throw e2;
      await supabase.from("audit_log").insert({
        aksi: "MARK_SELESAI", entitas: "jadwal_mendatang", entitas_id: jadwal.id,
        actor: "system", perubahan: { penugasan_id: pgId },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jadwal_mendatang"] });
      qc.invalidateQueries({ queryKey: ["penugasan"] });
      toast.success("Sesi ditandai selesai & dipindahkan ke riwayat");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}


// ============= PEWAWANCARA MUTATIONS =============

export type PewawancaraInput = {
  id?: string;
  nama: string;
  jabatanTerakhir: string;
  instansiTerakhir: string;
  inisial: string;
  warna: string;
  status: Status;
  nik?: string;
  npwp?: string;
  noTelepon?: string;
  email?: string;
  rekening?: string;
  tanggalBergabung?: string;
  tanggalSK?: string;
  tanggalSKExpire?: string;
  nomorSK?: string;
  fotoUrl?: string;
  pendidikan: { jenjang: string; bidang: string; institusi: string }[];
  karir: { jabatan: string; instansi: string; periode: string }[];
  keahlian: string[];
  catatan?: string;
};

function slugId(nama: string) {
  return (
    "PW-" +
    nama
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) +
    "-" +
    Date.now().toString(36).slice(-4).toUpperCase()
  );
}

export function useUpsertPewawancara() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PewawancaraInput) => {
      const id = input.id ?? slugId(input.nama);
      const row = {
        id,
        nama: input.nama,
        jabatan_terakhir: input.jabatanTerakhir,
        instansi_terakhir: input.instansiTerakhir,
        inisial: input.inisial,
        warna: input.warna,
        status: input.status,
        nik: input.nik || null,
        npwp: input.npwp || null,
        no_telepon: input.noTelepon || null,
        email: input.email || null,
        rekening: input.rekening || null,
        tanggal_bergabung: input.tanggalBergabung || null,
        tanggal_sk: input.tanggalSK || null,
        tanggal_sk_expire: input.tanggalSKExpire || null,
        nomor_sk: input.nomorSK || null,
        foto_url: input.fotoUrl || null,
        catatan: input.catatan || null,
      };
      const { error } = await supabase.from("pewawancara").upsert(row);
      if (error) throw error;

      // Replace children tables
      await Promise.all([
        supabase.from("pendidikan").delete().eq("pewawancara_id", id),
        supabase.from("karir").delete().eq("pewawancara_id", id),
        supabase.from("keahlian").delete().eq("pewawancara_id", id),
      ]);
      if (input.pendidikan.length) {
        await supabase.from("pendidikan").insert(
          input.pendidikan.map((p, i) => ({ ...p, pewawancara_id: id, urutan: i })),
        );
      }
      if (input.karir.length) {
        await supabase.from("karir").insert(
          input.karir.map((k, i) => ({ ...k, pewawancara_id: id, urutan: i })),
        );
      }
      if (input.keahlian.length) {
        await supabase.from("keahlian").insert(
          input.keahlian.map((nama) => ({ nama, pewawancara_id: id })),
        );
      }
      await supabase.from("audit_log").insert({
        aksi: input.id ? "UPDATE" : "CREATE",
        entitas: "pewawancara",
        entitas_id: id,
        actor: "system",
        perubahan: row,
      });
      return id;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["pewawancara"] });
      toast.success(v.id ? "Profil pewawancara diperbarui" : "Pewawancara baru ditambahkan");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

export function useDeletePewawancara() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await Promise.all([
        supabase.from("pendidikan").delete().eq("pewawancara_id", id),
        supabase.from("karir").delete().eq("pewawancara_id", id),
        supabase.from("keahlian").delete().eq("pewawancara_id", id),
      ]);
      const { error } = await supabase.from("pewawancara").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("audit_log").insert({
        aksi: "DELETE", entitas: "pewawancara", entitas_id: id, actor: "system",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pewawancara"] });
      toast.success("Profil pewawancara dihapus");
    },
    onError: (e: Error) => toast.error(`Gagal: ${e.message}`),
  });
}

export async function uploadFotoProfil(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("foto-profil").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("foto-profil").getPublicUrl(path);
  return data.publicUrl;
}
