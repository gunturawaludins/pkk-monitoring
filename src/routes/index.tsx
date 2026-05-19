import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, StatusBadge, PewawancaraPill } from "@/components/AppLayout";
import {
  TrendingUp, TrendingDown, Users, ClipboardCheck, Star, AlertTriangle,
  Calendar, ArrowRight, Bell, CheckCircle2, UserPlus,
} from "lucide-react";
import { pewawancara, penugasan, evaluasi, notifikasi, pewawancaraById, formatTanggalShort } from "@/data/seed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ringkasan Eksekutif — Dashboard PKK OJK DIMB" },
      { name: "description", content: "Ringkasan eksekutif Tim Klarifikasi Eksternal PKK." },
    ],
  }),
  component: RingkasanEksekutif,
});

function RingkasanEksekutif() {
  const totalPewawancara = pewawancara.length;
  const aktif = pewawancara.filter((p) => p.status === "aktif").length;
  const totalSesi = penugasan.length;
  const sesiBulanIni = penugasan.filter((s) => s.tanggal.startsWith("2026-05") || s.tanggal.startsWith("2026-04")).length;
  const avgSkor = (evaluasi.reduce((a, e) => a + e.nilaiAkhir, 0) / evaluasi.length).toFixed(1);
  const skExpireSoon = pewawancara.filter((p) => {
    const days = (new Date(p.tanggalSKExpire).getTime() - Date.now()) / 86400000;
    return days < 90;
  }).length;
  const tingkatAktif = Math.round((aktif / totalPewawancara) * 100);

  const aktivitasTerkini = [...penugasan]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-8 text-white shadow-elevated md:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-48 w-48 rounded-full bg-accent/30 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Departemen DIMB · Mei 2026
          </div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
            Selamat datang kembali, Farhan.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
            Pantau kinerja Tim Pewawancara Eksternal Penilaian Kemampuan & Kepatutan calon pihak utama perbankan secara real-time.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Total Pewawancara", value: totalPewawancara, sub: `${aktif} aktif` },
              { label: "Sesi PKK YTD", value: totalSesi, sub: "Januari – April 2026" },
              { label: "Avg Nilai Kinerja", value: avgSkor, sub: "Skala 0-100" },
              { label: "Tingkat Aktif", value: `${tingkatAktif}%`, sub: `${aktif} dari ${totalPewawancara}` },
            ].map((k) => (
              <div key={k.label}>
                <div className="text-[11px] uppercase tracking-wider text-white/60">{k.label}</div>
                <div className="mt-1 font-display text-4xl font-bold tracking-tight">{k.value}</div>
                <div className="mt-0.5 text-[11px] text-white/50">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metric cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Pewawancara Aktif"
          value={aktif.toString()}
          delta="+1 vs bulan lalu"
          trend="up"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Sesi Bulan Ini"
          value={sesiBulanIni.toString()}
          delta="3 sesi mendatang"
          trend="up"
        />
        <MetricCard
          icon={Star}
          label="Avg Skor Kinerja"
          value={avgSkor}
          delta="+1.2 vs kuartal lalu"
          trend="up"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Kontrak Perlu Diperbarui"
          value={skExpireSoon.toString()}
          delta="Berakhir < 90 hari"
          trend="warn"
        />
      </section>

      {/* Two columns */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Aktivitas terkini */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-base font-bold">Aktivitas Terkini</h3>
              <p className="text-xs text-muted-foreground">5 sesi PKK terbaru</p>
            </div>
            <Link
              to="/penugasan"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {aktivitasTerkini.map((s) => {
              const eks = pewawancaraById(s.eksternal1Id);
              return (
                <div key={s.id} className="grid grid-cols-12 gap-3 px-6 py-3.5 text-sm hover:bg-secondary/50">
                  <div className="col-span-2 text-xs font-medium text-muted-foreground">
                    {formatTanggalShort(s.tanggal)}
                  </div>
                  <div className="col-span-4">
                    <div className="font-semibold truncate">{s.bank}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.calon}</div>
                  </div>
                  <div className="col-span-3 text-xs text-muted-foreground truncate self-center">
                    {s.jabatan}
                  </div>
                  <div className="col-span-3 flex items-center">
                    {eks && <PewawancaraPill nama={eks.nama} warna={eks.warna} inisial={eks.inisial} />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Notifikasi */}
        <Card>
          <div className="border-b border-border px-6 py-4">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Bell className="h-4 w-4 text-accent" /> Perlu Perhatian
            </h3>
            <p className="text-xs text-muted-foreground">Alert & notifikasi penting</p>
          </div>
          <div className="space-y-1 p-3">
            {notifikasi.map((n) => {
              const Icon = n.tipe === "urgent" || n.tipe === "warning" ? AlertTriangle :
                          n.tipe === "success" ? CheckCircle2 :
                          n.judul.includes("baru") ? UserPlus : Calendar;
              const color = n.tipe === "urgent" ? "text-destructive bg-destructive/10" :
                            n.tipe === "warning" ? "text-warning bg-warning/15" :
                            n.tipe === "success" ? "text-success bg-success/10" :
                            "text-accent bg-accent/10";
              return (
                <div key={n.id} className="flex gap-3 rounded-lg p-3 hover:bg-secondary/60">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-tight">{n.judul}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.pesan}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{n.waktu}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, delta, trend,
}: { icon: any; label: string; value: string; delta: string; trend: "up" | "down" | "warn" }) {
  const TrendIcon = trend === "down" ? TrendingDown : trend === "warn" ? AlertTriangle : TrendingUp;
  const color = trend === "warn" ? "text-warning bg-warning/15" : trend === "down" ? "text-destructive bg-destructive/10" : "text-success bg-success/10";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}>
          <TrendIcon className="h-3 w-3" />
        </div>
      </div>
      <div className="mt-4 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
    </Card>
  );
}
