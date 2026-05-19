import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, GraduationCap, Briefcase, Phone, CreditCard, FileText, Upload, Download, Trash2, Edit, Mail, Star, ClipboardList } from "lucide-react";
import { Card, StatusBadge } from "@/components/AppLayout";
import { pewawancara, penugasan, evaluasi, type Pewawancara, type Status } from "@/data/seed";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil Individu — Tim Klarifikasi PKK" },
      { name: "description", content: "Profil lengkap pewawancara eksternal." },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"semua" | Status | "belum">("semua");
  const [selected, setSelected] = useState<Pewawancara | null>(null);

  const list = useMemo(() => {
    return pewawancara.filter((p) => {
      const matchQ = p.nama.toLowerCase().includes(q.toLowerCase()) ||
                     p.keahlian.some((k) => k.toLowerCase().includes(q.toLowerCase()));
      const sesiCount = penugasan.filter((s) => s.eksternal1Id === p.id).length;
      const matchF =
        filter === "semua" ? true :
        filter === "belum" ? sesiCount === 0 :
        p.status === filter;
      return matchQ && matchF;
    });
  }, [q, filter]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau keahlian..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-secondary p-1">
            {([
              ["semua", "Semua"],
              ["aktif", "Aktif"],
              ["baru_terdaftar", "Baru Terdaftar"],
              ["belum", "Belum Bertugas"],
            ] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === k
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const sesiCount = penugasan.filter((s) => s.eksternal1Id === p.id).length;
          const evals = evaluasi.filter((e) => e.pewawancaraId === p.id);
          const avg = evals.length ? (evals.reduce((a, e) => a + e.nilaiAkhir, 0) / evals.length).toFixed(1) : "-";
          return (
            <Card key={p.id} className="overflow-hidden transition-all hover:shadow-elevated cursor-pointer group" >
              <button onClick={() => setSelected(p)} className="w-full text-left">
                <div className="relative h-24 bg-hero">
                  <div className="absolute inset-x-0 -bottom-9 flex justify-center">
                    <div
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-card text-2xl font-bold text-white shadow-soft"
                      style={{ background: p.warna }}
                    >
                      {p.inisial}
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-12 text-center">
                  <h3 className="font-display text-base font-bold leading-tight">{p.nama}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {p.jabatanTerakhir} · {p.instansiTerakhir}
                  </p>
                  <div className="mt-2 flex justify-center">
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {p.keahlian.slice(0, 3).map((k) => (
                      <span key={k} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                        {k}
                      </span>
                    ))}
                    {p.keahlian.length > 3 && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                        +{p.keahlian.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-1 border-t border-border pt-3">
                    <Stat label="Sesi" value={sesiCount.toString()} />
                    <Stat label="Avg" value={avg} />
                    <Stat label="Keahlian" value={p.keahlian.length.toString()} />
                  </div>
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      {/* Drawer */}
      {selected && <DetailDrawer p={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-base font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function DetailDrawer({ p, onClose }: { p: Pewawancara; onClose: () => void }) {
  const sesi = penugasan.filter((s) => s.eksternal1Id === p.id);
  const evals = evaluasi.filter((e) => e.pewawancaraId === p.id);
  const avg = evals.length ? (evals.reduce((a, e) => a + e.nilaiAkhir, 0) / evals.length).toFixed(1) : "-";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[640px] overflow-y-auto bg-background shadow-elevated scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
          <div className="font-bold">Detail Profil</div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
              <Edit className="h-3 w-3" /> Edit
            </button>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="relative bg-hero px-6 pb-10 pt-8 text-white">
          <div className="flex items-center gap-5">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/30 text-3xl font-bold shadow-elevated"
              style={{ background: p.warna }}
            >
              {p.inisial}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold leading-tight">{p.nama}</h2>
              <p className="mt-1 text-sm text-white/70">{p.jabatanTerakhir}</p>
              <p className="text-xs text-white/50">{p.instansiTerakhir}</p>
              <div className="mt-2"><StatusBadge status={p.status} /></div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <HeroStat label="Total Sesi" value={sesi.length.toString()} icon={ClipboardList} />
            <HeroStat label="Avg Skor" value={avg} icon={Star} />
            <HeroStat label="Keahlian" value={p.keahlian.length.toString()} icon={Briefcase} />
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <Section title="Data Identitas" icon={Phone}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="NIK" value={p.nik} />
              <Field label="NPWP" value={p.npwp} />
              <Field label="No. Telepon" value={p.noTelepon} />
              <Field label="Email" value={p.email ?? "-"} />
              <Field label="No. Rekening" value={p.rekening} span={2} />
            </div>
          </Section>

          <Section title="Status & Surat Keputusan" icon={FileText}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Nomor SK" value={p.nomorSK} />
              <Field label="Tanggal SK" value={p.tanggalSK} />
              <Field label="Tanggal Bergabung" value={p.tanggalBergabung} />
              <Field label="SK Berakhir" value={p.tanggalSKExpire} highlight />
            </div>
          </Section>

          <Section title="Pendidikan" icon={GraduationCap}>
            <div className="space-y-2">
              {p.pendidikan.map((e, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                      {e.jenjang}
                    </span>
                    <div className="text-sm font-semibold">{e.bidang}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{e.institusi}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Riwayat Karir" icon={Briefcase}>
            <div className="relative space-y-0 pl-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-border">
              {p.karir.map((k, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-[10px] top-1.5 h-3 w-3 rounded-full border-2 border-card bg-accent" />
                  <div className="text-sm font-semibold">{k.jabatan}</div>
                  <div className="text-xs text-muted-foreground">{k.instansi}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground/80">{k.periode}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Bidang Keahlian" icon={Star}>
            <div className="flex flex-wrap gap-1.5">
              {p.keahlian.map((k) => (
                <span key={k} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">
                  {k}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Dokumen Pendukung" icon={FileText} action={
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95">
              <Upload className="h-3 w-3" /> Upload Dokumen
            </button>
          }>
            <div className="space-y-2">
              {[
                { nama: `CV_${p.nama.replaceAll(" ", "_")}.pdf`, tipe: "cv", ukuran: "1.2 MB" },
                { nama: `${p.nomorSK}.pdf`, tipe: "sk", ukuran: "340 KB" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{d.nama}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.tipe} · {d.ukuran}</div>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <div className="flex gap-2 border-t border-border pt-4">
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
              <Mail className="h-4 w-4" /> Kirim Email
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95">
              <CreditCard className="h-4 w-4" /> Tugaskan ke Sesi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function HeroStat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <Icon className="h-4 w-4 text-white/60" />
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );
}

function Section({ title, icon: Icon, action, children }: { title: string; icon: any; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, span = 1, highlight = false }: { label: string; value: string; span?: number; highlight?: boolean }) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-medium ${highlight ? "text-warning" : ""}`}>{value}</div>
    </div>
  );
}
