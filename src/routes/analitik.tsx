import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { TrendingUp, Users, Star, Building2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/AppLayout";
import { pewawancara, penugasan, evaluasi } from "@/data/seed";

export const Route = createFileRoute("/analitik")({
  head: () => ({
    meta: [
      { title: "Pelaporan & Analitik — Tim Klarifikasi PKK" },
      { name: "description", content: "Distribusi penugasan, tren volume sesi, dan top bank PKK." },
    ],
  }),
  component: Analitik,
});

function Analitik() {
  const totalSesi = penugasan.length;
  const totalUsed = new Set(penugasan.map((s) => s.eksternal1Id)).size;
  const avgSkor = (evaluasi.reduce((a, e) => a + e.nilaiAkhir, 0) / evaluasi.length).toFixed(1);

  const distribusi = useMemo(() => {
    return pewawancara.map((p) => ({
      p,
      count: penugasan.filter((s) => s.eksternal1Id === p.id).length,
    })).sort((a, b) => b.count - a.count);
  }, []);

  const maxDist = Math.max(...distribusi.map((d) => d.count), 1);

  const topBank = useMemo(() => {
    const map = new Map<string, number>();
    penugasan.forEach((s) => map.set(s.bank, (map.get(s.bank) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);
  const maxBank = Math.max(...topBank.map(([, c]) => c), 1);

  const tren = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    return months.map((m, i) => {
      const monthStr = String(i + 1).padStart(2, "0");
      const count = penugasan.filter((s) => s.tanggal.startsWith(`2026-${monthStr}`)).length;
      return { m, count, isProyeksi: i >= 4 };
    });
  }, []);
  const maxTren = Math.max(...tren.map((t) => t.count), 1);

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BigMetric icon={TrendingUp} label="Total Sesi YTD" value={totalSesi.toString()} sub="+18% vs tahun lalu" />
        <BigMetric icon={Users} label="Pewawancara Aktif" value={`${totalUsed}/${pewawancara.length}`} sub={`${pewawancara.length - totalUsed} belum bertugas`} warn={pewawancara.length - totalUsed > 0} />
        <BigMetric icon={Star} label="Rata-rata Skor Akhir" value={avgSkor} sub="Kategori Baik" />
        <BigMetric icon={Building2} label="Bank Frekuensi Tertinggi" value={topBank[0]?.[1].toString() ?? "0"} sub={topBank[0]?.[0].replace("PT ", "").slice(0, 28) ?? "-"} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribusi penugasan */}
        <Card>
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-bold">Distribusi Penugasan</h3>
            <p className="text-xs text-muted-foreground">Jumlah sesi per pewawancara eksternal</p>
          </div>
          <div className="space-y-3 p-5">
            {distribusi.map(({ p, count }) => {
              const pct = totalSesi ? Math.round((count / totalSesi) * 100) : 0;
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: p.warna }}
                      >
                        {p.inisial}
                      </span>
                      <span className="font-semibold">{p.nama}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{count}</span>
                      <span className="text-muted-foreground">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(count / maxDist) * 100}%`, background: p.warna }}
                    />
                  </div>
                  {count === 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-warning">
                      <AlertTriangle className="h-3 w-3" /> Belum mendapat penugasan
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top bank */}
        <Card>
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-bold">Top Bank Frekuensi PKK</h3>
            <p className="text-xs text-muted-foreground">5 bank dengan sesi terbanyak</p>
          </div>
          <div className="space-y-3 p-5">
            {topBank.map(([bank, count], i) => (
              <div key={bank}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="font-semibold truncate max-w-[280px]">{bank}</span>
                  </div>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent-gradient"
                    style={{ width: `${(count / maxBank) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tren bulanan */}
      <Card>
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-base font-bold">Tren Volume Sesi PKK 2026</h3>
          <p className="text-xs text-muted-foreground">Jumlah sesi PKK per bulan</p>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-3 h-48">
            {tren.map((t) => (
              <div key={t.m} className="group relative flex-1 flex flex-col items-center">
                <div className="absolute -top-7 z-10 hidden rounded-md bg-foreground px-2 py-1 text-[10px] font-bold text-background group-hover:block">
                  {t.count} sesi
                </div>
                <div className="flex-1 flex w-full items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all ${t.isProyeksi ? "bg-accent/40 border-2 border-dashed border-accent" : "bg-accent-gradient"}`}
                    style={{ height: `${(t.count / maxTren) * 100}%`, minHeight: t.count ? "8px" : "0" }}
                  />
                </div>
                <div className="mt-2 text-[11px] font-semibold">{t.m}</div>
                <div className="text-[10px] text-muted-foreground">{t.count}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent-gradient" /> Aktual</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-dashed border-accent bg-accent/30" /> Proyeksi / berjalan</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BigMetric({ icon: Icon, label, value, sub, warn }: { icon: any; label: string; value: string; sub: string; warn?: boolean }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${warn ? "bg-warning/15 text-warning" : "bg-accent/15 text-accent"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground truncate">{sub}</div>
    </Card>
  );
}
