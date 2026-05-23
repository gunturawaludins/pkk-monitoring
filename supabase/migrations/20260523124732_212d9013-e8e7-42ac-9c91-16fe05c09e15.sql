
ALTER TABLE public.pewawancara ADD COLUMN IF NOT EXISTS foto_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('foto-profil', 'foto-profil', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read foto-profil" ON storage.objects
  FOR SELECT USING (bucket_id = 'foto-profil');
CREATE POLICY "Public insert foto-profil" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'foto-profil');
CREATE POLICY "Public update foto-profil" ON storage.objects
  FOR UPDATE USING (bucket_id = 'foto-profil');
CREATE POLICY "Public delete foto-profil" ON storage.objects
  FOR DELETE USING (bucket_id = 'foto-profil');
