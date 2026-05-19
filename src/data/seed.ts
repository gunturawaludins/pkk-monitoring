// Seed data dari Database_Tim_Klarifikasi_Eksternal.xlsx

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

export const pewawancara: Pewawancara[] = [
  {
    id: "p1",
    nama: "C. Heru Budiargo",
    jabatanTerakhir: "Senior Adviser",
    instansiTerakhir: "AAJ - RSM Indonesia",
    inisial: "HB",
    warna: "oklch(0.55 0.14 220)",
    status: "aktif",
    nik: "3674051308490001",
    npwp: "07.129.624.8-411.000",
    noTelepon: "0811130849",
    email: "heru.budiargo@external.ojk.go.id",
    rekening: "4580210193 (BCA a.n. C. Heru Budiargo)",
    tanggalBergabung: "2024-02-01",
    tanggalSK: "2024-02-01",
    tanggalSKExpire: "2026-08-15",
    nomorSK: "SK-DIMB/02/2024-017",
    pendidikan: [
      { jenjang: "S1", bidang: "Economic, Development Study", institusi: "Universitas Indonesia" },
      { jenjang: "Diploma", bidang: "Quality Management", institusi: "University of Portsmouth, UK" },
    ],
    karir: [
      { jabatan: "Senior Adviser", instansi: "AAJ - RSM Indonesia", periode: "Juli 2018 - Juli 2023" },
      { jabatan: "Ketua Dewan Komisioner", instansi: "Lembaga Penjamin Simpanan (LPS)", periode: "April 2009 - September 2015" },
      { jabatan: "Executive Director of Compliance & Human Resource", instansi: "Bank Niaga Indonesia", periode: "1978 - 2007" },
    ],
    keahlian: ["Kredit", "Tata Kelola", "SDM", "Risiko"],
  },
  {
    id: "p2",
    nama: "Ahmad Buchori",
    jabatanTerakhir: "Direktur Eksekutif/Pengawas Utama",
    instansiTerakhir: "Otoritas Jasa Keuangan (OJK)",
    inisial: "AB",
    warna: "oklch(0.62 0.15 152)",
    status: "baru_terdaftar",
    nik: "3174041504650007",
    npwp: "07.579.813.2-015.000",
    noTelepon: "-",
    rekening: "-",
    tanggalBergabung: "2025-09-01",
    tanggalSK: "2025-09-01",
    tanggalSKExpire: "2027-09-01",
    nomorSK: "SK-DIMB/09/2025-042",
    pendidikan: [
      { jenjang: "S2", bidang: "Master of Applied Finance", institusi: "The University of Melbourne, Australia" },
      { jenjang: "S1", bidang: "Ir. Agriculture Economics", institusi: "IPB University" },
    ],
    karir: [
      { jabatan: "Direktur Eksekutif/Pengawas Utama, Kelompok Spesialis Perbankan", instansi: "Otoritas Jasa Keuangan (OJK)", periode: "2014 - April 2025" },
      { jabatan: "Direktur Penelitian, Pengembangan, Pengaturan dan Perizinan Perbankan Syariah", instansi: "Bank Indonesia (BI)", periode: "1991 - 2013" },
    ],
    keahlian: ["Keuangan", "Perbankan Daerah", "Perbankan Syariah"],
  },
  {
    id: "p3",
    nama: "Aris Priatno",
    jabatanTerakhir: "Direktur Pelaporan",
    instansiTerakhir: "PPATK",
    inisial: "AP",
    warna: "oklch(0.7 0.13 300)",
    status: "baru_terdaftar",
    nik: "3173072103640001",
    npwp: "05.899.831.1-031.000",
    noTelepon: "-",
    rekening: "0700004840547 (Bank Mandiri a.n. Aris Priatno)",
    tanggalBergabung: "2025-10-12",
    tanggalSK: "2025-10-12",
    tanggalSKExpire: "2027-10-12",
    nomorSK: "SK-DIMB/10/2025-048",
    pendidikan: [
      { jenjang: "S2", bidang: "Master of Arts, Business and Commerce", institusi: "Keio University, Japan" },
      { jenjang: "S1", bidang: "Sastra Inggris, Ilmu Sosial dan Ilmu Politik", institusi: "Universitas Terbuka" },
      { jenjang: "S1", bidang: "Manajemen", institusi: "Universitas Indonesia" },
      { jenjang: "Diploma", bidang: "Akuntansi", institusi: "Sekolah Tinggi Akuntansi Negara" },
    ],
    karir: [
      { jabatan: "Direktur Pelaporan", instansi: "PPATK", periode: "2015 - 2024" },
      { jabatan: "Kasubdit Pengembangan Penyuluhan", instansi: "Direktorat Jenderal Pajak", periode: "2006 - 2015" },
      { jabatan: "Sekretaris Menteri Keuangan", instansi: "Kementerian Keuangan RI", periode: "1999 - 2006" },
    ],
    keahlian: ["Perpajakan", "APU-PPT", "Risiko", "Tata Kelola", "Kepatuhan", "Audit"],
  },
  {
    id: "p4",
    nama: "Armand Bachtiar Arief",
    jabatanTerakhir: "Komisaris Independen",
    instansiTerakhir: "PT Cardig Aero Services",
    inisial: "AA",
    warna: "oklch(0.66 0.2 42)",
    status: "baru_terdaftar",
    nik: "3174102804520001",
    npwp: "06.968.393.6-013.000",
    noTelepon: "0811822804",
    rekening: "-",
    tanggalBergabung: "2025-11-05",
    tanggalSK: "2025-11-05",
    tanggalSKExpire: "2027-11-05",
    nomorSK: "SK-DIMB/11/2025-051",
    pendidikan: [
      { jenjang: "S2", bidang: "Master of Business Administration", institusi: "Suffolk University, Boston, USA" },
      { jenjang: "S1", bidang: "Business Administration", institusi: "Curry College, Milton, Massachusetts" },
      { jenjang: "Diploma", bidang: "Perhotelan", institusi: "Akademi Perhotelan Bandung" },
    ],
    karir: [
      { jabatan: "Komisaris Independen", instansi: "PT Cardig Aero Services", periode: "Juni 2021 - Saat Ini" },
      { jabatan: "Komisaris Independen", instansi: "Bank Tabungan Negara", periode: "November 2019 - Maret 2025" },
      { jabatan: "Komisaris Independen", instansi: "Bank Royal Indonesia", periode: "Desember 2016 - Desember 2018" },
      { jabatan: "CEO", instansi: "Bank UOB Indonesia", periode: "Juli 2007 - Desember 2015" },
      { jabatan: "Deputy CEO", instansi: "Bank International Indonesia", periode: "Mei 2002 - Juni 2007" },
      { jabatan: "Deputy CEO", instansi: "Bank Danamon Indonesia", periode: "Januari 1999 - Mei 2002" },
    ],
    keahlian: ["Kepemimpinan", "Manajemen", "Transformasi"],
  },
  {
    id: "p5",
    nama: "Gayatri Rawit Angreni",
    jabatanTerakhir: "Advisory Board",
    instansiTerakhir: "PT Pegadaian",
    inisial: "GA",
    warna: "oklch(0.6 0.18 350)",
    status: "aktif",
    nik: "3174076605570002",
    npwp: "05.143.873.7-016.001",
    noTelepon: "08120134393",
    rekening: "020601001015509 (BRI a.n. Gayatri Rawit Angreni)",
    tanggalBergabung: "2024-01-15",
    tanggalSK: "2024-01-15",
    tanggalSKExpire: "2026-07-30",
    nomorSK: "SK-DIMB/01/2024-008",
    pendidikan: [
      { jenjang: "S2", bidang: "Master of Business Administration", institusi: "University of Nebraska in Lincoln, USA" },
      { jenjang: "S1", bidang: "Ir. Agriculture Economics", institusi: "IPB University" },
    ],
    karir: [
      { jabatan: "Advisory Board", instansi: "PT Pegadaian", periode: "2018 - Saat Ini" },
      { jabatan: "Komisaris", instansi: "PT Dempo Wisnu Kencana", periode: "2012 - Saat Ini" },
      { jabatan: "Ketua Dewan Sertifikasi", instansi: "Badan Sertifikasi Manajemen Risiko (BSMR)", periode: "2005 - 2011" },
      { jabatan: "Direktur Kepatuhan", instansi: "Bank Rakyat Indonesia (BRI)", periode: "2000 - 2006" },
      { jabatan: "Direktur Kepatuhan", instansi: "Bank Danamon Indonesia", periode: "1998 - 2000" },
    ],
    keahlian: ["Kepatuhan", "Kredit", "Risiko", "Manajemen Risiko"],
  },
];

export const pewawancaraById = (id: string) => pewawancara.find((p) => p.id === id);
export const pewawancaraByName = (n: string) => pewawancara.find((p) => p.nama === n);

export interface Penugasan {
  id: string;
  tanggal: string; // ISO
  bank: string;
  calon: string;
  jabatan: string;
  internal: string;
  eksternal1Id: string;
  eksternal2Nama: string; // bisa pewawancara internal lain atau pihak ke-3
  status: "selesai" | "terjadwal";
}

// 21 penugasan dari Excel (Page 3)
export const penugasan: Penugasan[] = [
  // C. Heru Budiargo (p1) — 10 sesi
  { id: "s1", tanggal: "2026-01-26", bank: "PT Bank KB Indonesia Tbk", calon: "Widodo Suryadi", jabatan: "Direktur Finance dan Aset Recovery", internal: "Kusdarmawan Agustianto", eksternal1Id: "p1", eksternal2Nama: "Heru Cahyono", status: "selesai" },
  { id: "s2", tanggal: "2026-02-05", bank: "PT Bank Central Asia Tbk", calon: "David Formula", jabatan: "Direktur Finance dan Aset Recovery", internal: "Masagus Abdul Azis", eksternal1Id: "p1", eksternal2Nama: "Mirah Wiryoatmodjo", status: "selesai" },
  { id: "s3", tanggal: "2026-02-19", bank: "PT Bank Pembangunan Daerah Jawa Tengah", calon: "Bambang Ristianto", jabatan: "Direktur Keuangan", internal: "Hidayat Prabowo", eksternal1Id: "p1", eksternal2Nama: "SWD Murniastuti", status: "selesai" },
  { id: "s4", tanggal: "2026-02-23", bank: "PT Bank OCBC NISP Tbk", calon: "Tan Teck Long", jabatan: "Presiden Komisaris", internal: "Sri Kurniati", eksternal1Id: "p1", eksternal2Nama: "Gayatri Rawit Angreni", status: "selesai" },
  { id: "s5", tanggal: "2026-02-26", bank: "PT Bank Shinhan Indonesia", calon: "Lisa Surya", jabatan: "Direktur Finance dan Aset Recovery", internal: "Sri Kurniati", eksternal1Id: "p1", eksternal2Nama: "Edy Setiadi", status: "selesai" },
  { id: "s6", tanggal: "2026-03-06", bank: "PT Bank Rakyat Indonesia (Persero) Tbk", calon: "Ety Yuniarti", jabatan: "Direktur Manajemen Risiko", internal: "Yan Syafri", eksternal1Id: "p1", eksternal2Nama: "SWD Murniastuti", status: "selesai" },
  { id: "s7", tanggal: "2026-03-11", bank: "PT Bank Rakyat Indonesia (Persero) Tbk", calon: "Aris Hartanto", jabatan: "Direktur Consumer Banking", internal: "Soelistio Darmawan", eksternal1Id: "p1", eksternal2Nama: "Edy Setiadi", status: "selesai" },
  { id: "s8", tanggal: "2026-04-08", bank: "PT Bank Negara Indonesia (Persero) Tbk", calon: "Febrio Nathan Kacaribu", jabatan: "Komisaris Non Independen", internal: "Yan Syafri", eksternal1Id: "p1", eksternal2Nama: "Imansyah", status: "selesai" },
  { id: "s9", tanggal: "2026-04-17", bank: "PT BPD Jawa Tengah", calon: "Puguh Budi Santosa", jabatan: "Komisaris Independen", internal: "Hidayat Prabowo", eksternal1Id: "p1", eksternal2Nama: "Krisna Wijaya", status: "selesai" },
  { id: "s10", tanggal: "2026-04-29", bank: "PT Bank OCBC NISP Tbk", calon: "Noel Gerald Dcruz", jabatan: "Komisaris Non Independen", internal: "Sri Kurniati", eksternal1Id: "p1", eksternal2Nama: "Krisna Wijaya", status: "selesai" },
  // Gayatri (p5) — 11 sesi
  { id: "s11", tanggal: "2026-01-12", bank: "PT Bank Pembangunan Daerah Sumatera Utara", calon: "Heru Mardiansyah", jabatan: "Direktur Utama", internal: "Khoirul Muttaqien", eksternal1Id: "p5", eksternal2Nama: "Wahyu", status: "selesai" },
  { id: "s12", tanggal: "2026-01-20", bank: "PT Bank Danamon Indonesia Tbk", calon: "Nobuya Kawasaki", jabatan: "Direktur Finance dan Aset Recovery", internal: "Sri Kurniati", eksternal1Id: "p5", eksternal2Nama: "Mirah Wiryoatmodjo", status: "selesai" },
  { id: "s13", tanggal: "2026-02-19", bank: "PT Bank Pembangunan Daerah Jawa Tengah", calon: "Adnas", jabatan: "Komisaris Utama Independen", internal: "Hidayat Prabowo", eksternal1Id: "p5", eksternal2Nama: "Teguh Supangkat", status: "selesai" },
  { id: "s14", tanggal: "2026-02-19", bank: "PT Bank Pembangunan Daerah Jawa Tengah", calon: "Bambang Widyatmoko", jabatan: "Direktur Utama", internal: "Hidayat Prabowo", eksternal1Id: "p5", eksternal2Nama: "Teguh Supangkat", status: "selesai" },
  { id: "s15", tanggal: "2026-02-19", bank: "PT Bank Pembangunan Daerah Jawa Tengah", calon: "M. Waris", jabatan: "Direktur Bisnis Kelembagaan dan UUS", internal: "Hidayat Prabowo", eksternal1Id: "p5", eksternal2Nama: "Teguh Supangkat", status: "selesai" },
  { id: "s16", tanggal: "2026-02-23", bank: "PT Bank OCBC NISP Tbk", calon: "Tan Teck Long", jabatan: "Presiden Komisaris", internal: "Sri Kurniati", eksternal1Id: "p5", eksternal2Nama: "C. Heru Budiargo", status: "selesai" },
  { id: "s17", tanggal: "2026-02-27", bank: "PT Bank KB Bukopin Syariah", calon: "Bambang Setiaji", jabatan: "Presiden Komisaris", internal: "Meywan Herarosy", eksternal1Id: "p5", eksternal2Nama: "Krisna Wijaya", status: "selesai" },
  { id: "s18", tanggal: "2026-03-06", bank: "PT Bank BTPN Syariah Tbk", calon: "Sendiaty Sondy", jabatan: "Komisaris", internal: "Esti Sasanti P.", eksternal1Id: "p5", eksternal2Nama: "Heru Cahyono", status: "selesai" },
  { id: "s19", tanggal: "2026-03-16", bank: "PT BPD Kalimantan Timur dan Kalimantan Utara", calon: "Achmad Syamsudin", jabatan: "Komisaris Utama Independen", internal: "Misran Pasaribu", eksternal1Id: "p5", eksternal2Nama: "Teguh Supangkat", status: "selesai" },
  { id: "s20", tanggal: "2026-03-17", bank: "PT BPD Kalimantan Timur dan Kalimantan Utara", calon: "Sri Wahyuni", jabatan: "Komisaris Non Independen", internal: "Misran Pasaribu", eksternal1Id: "p5", eksternal2Nama: "Teguh Supangkat", status: "selesai" },
  { id: "s21", tanggal: "2026-04-02", bank: "PT Bank Pembangunan Daerah Bengkulu", calon: "Somi Mohamad Yunus", jabatan: "Direktur Kepatuhan", internal: "Achmad Fauzi", eksternal1Id: "p5", eksternal2Nama: "Imansyah", status: "selesai" },
];

export interface Evaluasi {
  penugasanId: string;
  pewawancaraId: string;
  availability: number;
  kualitas: number;
  substansi: number;
  nilaiAkhir: number;
}

const heruScores: [number, number, number, number][] = [
  [80, 90, 80, 84],
  [80, 90, 80, 84],
  [90, 80, 80, 82],
  [90, 90, 90, 90],
  [80, 90, 90, 88],
  [90, 80, 90, 86],
  [90, 80, 90, 86],
  [80, 70, 80, 76],
  [90, 80, 90, 86],
  [90, 90, 80, 86],
];

const gayatriScores: [number, number, number, number][] = [
  [90, 90, 90, 90],
  [80, 90, 80, 84],
  [80, 90, 80, 84],
  [90, 80, 80, 82],
  [90, 90, 90, 90],
  [80, 90, 90, 88],
  [90, 80, 90, 86],
  [90, 80, 90, 86],
  [80, 70, 80, 76],
  [90, 80, 90, 86],
  [90, 90, 80, 86],
];

export const evaluasi: Evaluasi[] = [
  ...heruScores.map((s, i) => ({
    penugasanId: `s${i + 1}`,
    pewawancaraId: "p1",
    availability: s[0], kualitas: s[1], substansi: s[2], nilaiAkhir: s[3],
  })),
  ...gayatriScores.map((s, i) => ({
    penugasanId: `s${i + 11}`,
    pewawancaraId: "p5",
    availability: s[0], kualitas: s[1], substansi: s[2], nilaiAkhir: s[3],
  })),
];

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

export const jadwalMendatang: JadwalMendatang[] = [
  { id: "j1", tanggal: "2026-05-22", waktu: "09:00", bank: "PT Bank Mandiri (Persero) Tbk", calon: "Rini Anggraeni", jabatan: "Direktur Manajemen Risiko", internal: "Sri Kurniati", eksternal1Id: "p1", eksternal2Id: "p5", undanganTerkirim: true },
  { id: "j2", tanggal: "2026-05-26", waktu: "13:00", bank: "PT Bank CIMB Niaga Tbk", calon: "Andrew Susanto", jabatan: "Direktur Keuangan", internal: "Yan Syafri", eksternal1Id: "p5", undanganTerkirim: false },
  { id: "j3", tanggal: "2026-05-28", waktu: "10:00", bank: "PT BPD Sulawesi Selatan", calon: "Hasanuddin Lamada", jabatan: "Direktur Utama", internal: "Misran Pasaribu", undanganTerkirim: false },
  { id: "j4", tanggal: "2026-06-03", waktu: "09:30", bank: "PT Bank Permata Tbk", calon: "Indra Wijaya", jabatan: "Komisaris Independen", internal: "Sri Kurniati", eksternal1Id: "p1", undanganTerkirim: false },
  { id: "j5", tanggal: "2026-06-10", waktu: "14:00", bank: "PT BPD Jawa Barat dan Banten Tbk", calon: "Siti Maryam", jabatan: "Direktur Kepatuhan", internal: "Hidayat Prabowo", undanganTerkirim: false },
];

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  tipe: "warning" | "info" | "success" | "urgent";
  waktu: string;
}

export const notifikasi: Notifikasi[] = [
  { id: "n1", judul: "SK akan berakhir", pesan: "SK Gayatri Rawit Angreni berakhir dalam 12 hari (30 Juli 2026)", tipe: "urgent", waktu: "2 jam lalu" },
  { id: "n2", judul: "SK akan berakhir", pesan: "SK C. Heru Budiargo berakhir dalam 28 hari (15 Agustus 2026)", tipe: "warning", waktu: "5 jam lalu" },
  { id: "n3", judul: "Sesi PKK dijadwalkan", pesan: "Sesi PKK Bank Mandiri dijadwalkan 22 Mei 2026", tipe: "info", waktu: "1 hari lalu" },
  { id: "n4", judul: "Pewawancara baru terdaftar", pesan: "Armand Bachtiar Arief telah ditambahkan ke daftar pewawancara", tipe: "info", waktu: "3 hari lalu" },
  { id: "n5", judul: "Undangan terkirim", pesan: "Undangan sesi 22 Mei berhasil dikirim ke 2 pewawancara", tipe: "success", waktu: "1 minggu lalu" },
];

// Helper formatters
export const formatTanggal = (iso: string) => {
  const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const d = new Date(iso);
  return `${d.getUTCDate()} ${bulan[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export const formatTanggalShort = (iso: string) => {
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const d = new Date(iso);
  return `${d.getUTCDate()} ${bulan[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
