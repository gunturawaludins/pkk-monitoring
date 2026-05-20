// Type definitions & formatters. Data lives in the database — see queries.ts

export type Status = "aktif" | "tidak_aktif" | "baru_terdaftar";

export interface Pendidikan {
  jenjang: string;
  bidang: string;
  institusi: string;
}

export interface Karir {
  jabatan: string;
  instansi: string;
  periode: string;
}

export interface Pewawancara {
  id: string;
  nama: string;
  jabatanTerakhir: string;
  instansiTerakhir: string;
  inisial: string;
  warna: string;
  status: Status;
  nik: string;
  npwp: string;
  noTelepon: string;
  email?: string;
  rekening: string;
  tanggalBergabung: string;
  tanggalSK: string;
  tanggalSKExpire: string;
  nomorSK: string;
  pendidikan: Pendidikan[];
  karir: Karir[];
  keahlian: string[];
  catatan?: string;
}

export interface Penugasan {
  id: string;
  tanggal: string;
  bank: string;
  calon: string;
  jabatan: string;
  internal: string;
  eksternal1Id: string;
  eksternal2Nama: string;
  status: "selesai" | "terjadwal";
}

export interface Evaluasi {
  penugasanId: string;
  pewawancaraId: string;
  availability: number;
  kualitas: number;
  substansi: number;
  nilaiAkhir: number;
}

export interface JadwalMendatang {
  id: string;
  tanggal: string;
  waktu: string;
  bank: string;
  calon: string;
  jabatan: string;
  internal: string;
  eksternal1Id?: string;
  eksternal2Id?: string;
  undanganTerkirim: boolean;
}

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  tipe: "warning" | "info" | "success" | "urgent";
  waktu: string;
}

const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const bulanShort = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

export const formatTanggal = (iso: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getUTCDate()} ${bulan[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export const formatTanggalShort = (iso: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getUTCDate()} ${bulanShort[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
