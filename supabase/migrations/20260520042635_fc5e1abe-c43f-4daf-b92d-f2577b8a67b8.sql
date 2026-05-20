
-- =========================
-- ENUMS
-- =========================
CREATE TYPE public.pewawancara_status AS ENUM ('aktif', 'tidak_aktif', 'baru_terdaftar');
CREATE TYPE public.penugasan_status AS ENUM ('selesai', 'terjadwal');
CREATE TYPE public.notifikasi_tipe AS ENUM ('warning', 'info', 'success', 'urgent');

-- =========================
-- PEWAWANCARA
-- =========================
CREATE TABLE public.pewawancara (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  jabatan_terakhir TEXT NOT NULL,
  instansi_terakhir TEXT NOT NULL,
  inisial TEXT NOT NULL,
  warna TEXT NOT NULL,
  status public.pewawancara_status NOT NULL DEFAULT 'baru_terdaftar',
  nik TEXT,
  npwp TEXT,
  no_telepon TEXT,
  email TEXT,
  rekening TEXT,
  tanggal_bergabung DATE,
  tanggal_sk DATE,
  tanggal_sk_expire DATE,
  nomor_sk TEXT,
  catatan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pendidikan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pewawancara_id TEXT NOT NULL REFERENCES public.pewawancara(id) ON DELETE CASCADE,
  jenjang TEXT NOT NULL,
  bidang TEXT NOT NULL,
  institusi TEXT NOT NULL,
  urutan INT NOT NULL DEFAULT 0
);

CREATE TABLE public.karir (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pewawancara_id TEXT NOT NULL REFERENCES public.pewawancara(id) ON DELETE CASCADE,
  jabatan TEXT NOT NULL,
  instansi TEXT NOT NULL,
  periode TEXT NOT NULL,
  urutan INT NOT NULL DEFAULT 0
);

CREATE TABLE public.keahlian (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pewawancara_id TEXT NOT NULL REFERENCES public.pewawancara(id) ON DELETE CASCADE,
  nama TEXT NOT NULL
);

-- =========================
-- PENUGASAN & EVALUASI
-- =========================
CREATE TABLE public.penugasan (
  id TEXT PRIMARY KEY,
  tanggal DATE NOT NULL,
  bank TEXT NOT NULL,
  calon TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  internal TEXT NOT NULL,
  eksternal1_id TEXT REFERENCES public.pewawancara(id) ON DELETE SET NULL,
  eksternal2_nama TEXT,
  status public.penugasan_status NOT NULL DEFAULT 'selesai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.evaluasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  penugasan_id TEXT NOT NULL REFERENCES public.penugasan(id) ON DELETE CASCADE,
  pewawancara_id TEXT NOT NULL REFERENCES public.pewawancara(id) ON DELETE CASCADE,
  availability INT NOT NULL,
  kualitas INT NOT NULL,
  substansi INT NOT NULL,
  nilai_akhir NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(penugasan_id, pewawancara_id)
);

-- =========================
-- JADWAL MENDATANG
-- =========================
CREATE TABLE public.jadwal_mendatang (
  id TEXT PRIMARY KEY,
  tanggal DATE NOT NULL,
  waktu TEXT NOT NULL,
  bank TEXT NOT NULL,
  calon TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  internal TEXT NOT NULL,
  eksternal1_id TEXT REFERENCES public.pewawancara(id) ON DELETE SET NULL,
  eksternal2_id TEXT REFERENCES public.pewawancara(id) ON DELETE SET NULL,
  undangan_terkirim BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- NOTIFIKASI
-- =========================
CREATE TABLE public.notifikasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  pesan TEXT NOT NULL,
  tipe public.notifikasi_tipe NOT NULL DEFAULT 'info',
  dibaca BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- AUDIT LOG
-- =========================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entitas TEXT NOT NULL,        -- 'pewawancara' | 'penugasan' | etc
  entitas_id TEXT NOT NULL,
  aksi TEXT NOT NULL,           -- 'create' | 'update' | 'delete'
  perubahan JSONB,
  actor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pendidikan_pewawancara ON public.pendidikan(pewawancara_id);
CREATE INDEX idx_karir_pewawancara ON public.karir(pewawancara_id);
CREATE INDEX idx_keahlian_pewawancara ON public.keahlian(pewawancara_id);
CREATE INDEX idx_penugasan_tanggal ON public.penugasan(tanggal);
CREATE INDEX idx_penugasan_eksternal1 ON public.penugasan(eksternal1_id);
CREATE INDEX idx_evaluasi_pewawancara ON public.evaluasi(pewawancara_id);
CREATE INDEX idx_jadwal_tanggal ON public.jadwal_mendatang(tanggal);
CREATE INDEX idx_audit_entitas ON public.audit_log(entitas, entitas_id);

-- =========================
-- updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_pewawancara_updated
BEFORE UPDATE ON public.pewawancara
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- RLS — Mode tanpa login (akses publik penuh sementara)
-- Akan diperketat saat modul login aktif.
-- =========================
ALTER TABLE public.pewawancara ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendidikan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karir ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keahlian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penugasan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_mendatang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['pewawancara','pendidikan','karir','keahlian','penugasan','evaluasi','jadwal_mendatang','notifikasi','audit_log']) LOOP
    EXECUTE format('CREATE POLICY "Public read %1$s" ON public.%1$I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "Public insert %1$s" ON public.%1$I FOR INSERT WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "Public update %1$s" ON public.%1$I FOR UPDATE USING (true) WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "Public delete %1$s" ON public.%1$I FOR DELETE USING (true);', t);
  END LOOP;
END $$;

-- =========================
-- STORAGE: dokumen-sk (publik)
-- =========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('dokumen-sk', 'dokumen-sk', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read dokumen-sk"
ON storage.objects FOR SELECT
USING (bucket_id = 'dokumen-sk');

CREATE POLICY "Public upload dokumen-sk"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dokumen-sk');

CREATE POLICY "Public update dokumen-sk"
ON storage.objects FOR UPDATE
USING (bucket_id = 'dokumen-sk');

CREATE POLICY "Public delete dokumen-sk"
ON storage.objects FOR DELETE
USING (bucket_id = 'dokumen-sk');
