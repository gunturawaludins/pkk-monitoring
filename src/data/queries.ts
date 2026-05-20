import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
