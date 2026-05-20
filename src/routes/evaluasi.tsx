import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star, Plus, TrendingUp } from "lucide-react";
import { Card, PewawancaraPill } from "@/components/AppLayout";
import { formatTanggalShort } from "@/data/seed";
import { usePewawancara, usePenugasan, useEvaluasi } from "@/data/queries";

export const Route = createFileRoute("/evaluasi")({
  head: () => ({
    meta: [
      { title: "Evaluasi Kinerja — Tim Klarifikasi PKK" },
      { name: "description", content: "Penilaian Availability, Kualitas Proses, dan Substansi pewawancara." },
    ],
  }),
  component: EvaluasiKinerja,
});

function EvaluasiKinerja() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const { data: pewawancara } = usePewawancara();
  const { data: penugasan } = usePenugasan();
  const { data: evaluasi } = useEvaluasi();
  const pewawancaraById = (id: string) => pewawancara.find((p) => p.id === id);

  const summary = useMemo(() => {
    return pewawancara.map((p) => {
      const evals = evaluasi.filter((e) => e.pewawancaraId === p.id);
      if (!evals.length) return { p, count: 0, avg: 0, avail: 0, kualitas: 0, substansi: 0, evals };
      const avg = (s: number) => s / evals.length;
      return {
        p,
        count: evals.length,
        avg: avg(evals.reduce((a, e) => a + e.nilaiAkhir, 0)),
        avail: avg(evals.reduce((a, e) => a + e.availability, 0)),
        kualitas: avg(evals.reduce((a, e) => a + e.kualitas, 0)),
        substansi: avg(evals.reduce((a, e) => a + e.substansi, 0)),
        evals,
      };
    });
  }, [pewawancara, evaluasi]);

  const detailEvals = useMemo(() => {
    if (!selectedId) return evaluasi;
    return evaluasi.filter((e) => e.pewawancaraId === selectedId);
  }, [selectedId, evaluasi]);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summary.map(({ p, count, avg, avail, kualitas, substansi, evals }) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold shadow-soft"
                style={{ background: p.warna }}
              >
                {p.inisial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{p.nama}</div>
                <div className="truncate text-xs text-muted-foreground">{p.jabatanTerakhir}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold">
                  {count ? avg.toFixed(1) : "—"}
                </div>
                <div className="flex justify-end gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        count && avg >= s * 18 ? "fill-warning text-warning" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-b border-border bg-secondary/30 p-4">
              <SubScore label="Availability" value={count ? avail : null} weight="20%" />
              <SubScore label="Kualitas" value={count ? kualitas : null} weight="40%" />
              <SubScore label="Substansi" value={count ? substansi : null} weight="40%" />
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>Trend Skor per Sesi</span>
                <span>{count} sesi</span>
              </div>
              {count > 0 ? (
                <div className="flex items-end gap-1 h-16">
                  {evals.map((e, i) => {
                    const h = (e.nilaiAkhir / 100) * 100;
                    const color = e.nilaiAkhir < 80 ? "bg-destructive" : e.nilaiAkhir < 85 ? "bg-warning" : "bg-success";
                    return (
                      <div key={i} className="group relative flex-1 flex items-end">
                        <div className={`w-full rounded-t ${color} transition-all`} style={{ height: `${h}%` }} />
                        <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-0.5 text-[10px] font-bold text-background group-hover:block whitespace-nowrap z-10">
                          {e.nilaiAkhir}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-16 items-center justify-center text-xs text-muted-foreground">
                  Belum ada data evaluasi
                </div>
              )}
              <button
                onClick={() => setSelectedId(p.id)}
                className="mt-3 w-full rounded-lg border border-border bg-secondary py-2 text-xs font-semibold hover:bg-card transition-colors"
              >
                Lihat Detail Sesi →
              </button>
            </div>
          </Card>
        ))}
      </section>

      {/* Detail table */}
      <Card>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-bold">
              {selectedId ? `Detail Evaluasi · ${pewawancaraById(selectedId)?.nama}` : "Semua Evaluasi Sesi"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {detailEvals.length} sesi tercatat
            </p>
          </div>
          <div className="flex gap-2">
            {selectedId && (
              <button onClick={() => setSelectedId(null)} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
                Tampilkan Semua
              </button>
            )}
            <button onClick={() => setModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95">
              <Plus className="h-3 w-3" /> Beri Nilai
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Sesi</th>
                <th className="px-4 py-3">Pewawancara</th>
                <th className="px-4 py-3 text-center">Availability</th>
                <th className="px-4 py-3 text-center">Kualitas</th>
                <th className="px-4 py-3 text-center">Substansi</th>
                <th className="px-4 py-3 text-center">Nilai Akhir</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {detailEvals.map((e, i) => {
                const sesi = penugasan.find((s) => s.id === e.penugasanId);
                const p = pewawancaraById(e.pewawancaraId);
                const status = e.nilaiAkhir >= 90 ? "sangat-baik" : e.nilaiAkhir >= 80 ? "baik" : "perlu-perhatian";
                return (
                  <tr key={`${e.penugasanId}-${e.pewawancaraId}`} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold">{sesi ? formatTanggalShort(sesi.tanggal) : "-"}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[260px]">{sesi?.bank}</div>
                    </td>
                    <td className="px-4 py-3">{p && <PewawancaraPill nama={p.nama} warna={p.warna} inisial={p.inisial} />}</td>
                    <td className="px-4 py-3 text-center font-medium">{e.availability}</td>
                    <td className="px-4 py-3 text-center font-medium">{e.kualitas}</td>
                    <td className="px-4 py-3 text-center font-medium">{e.substansi}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-display text-base font-bold">{e.nilaiAkhir}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        status === "sangat-baik" ? "border-success/30 bg-success/15 text-success" :
                        status === "baik" ? "border-accent/30 bg-accent/15 text-accent" :
                        "border-destructive/30 bg-destructive/15 text-destructive"
                      }`}>
                        {status === "sangat-baik" ? "Sangat Baik" : status === "baik" ? "Baik" : "Perlu Perhatian"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && <ModalEvaluasi onClose={() => setModal(false)} />}
    </div>
  );
}

function SubScore({ label, value, weight }: { label: string; value: number | null; weight: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="font-display text-lg font-bold">{value !== null ? value.toFixed(0) : "—"}</span>
        <span className="text-[10px] text-muted-foreground">/ {weight}</span>
      </div>
    </div>
  );
}

function ModalEvaluasi({ onClose }: { onClose: () => void }) {
  const [v, setV] = useState({ availability: 85, kualitas: 85, substansi: 85 });
  const nilaiAkhir = (v.availability * 0.2 + v.kualitas * 0.4 + v.substansi * 0.4).toFixed(1);
  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card shadow-elevated">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-base font-bold">Input Nilai Evaluasi</h3>
          <p className="text-xs text-muted-foreground">Skala 0-100. Nilai akhir terhitung otomatis.</p>
        </div>
        <div className="space-y-5 px-6 py-5">
          {([
            ["availability", "Availability", 0.2],
            ["kualitas", "Kualitas Proses Wawancara", 0.4],
            ["substansi", "Substansi dan Ketajaman Penilaian", 0.4],
          ] as const).map(([key, label, bobot]) => (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{label} <span className="text-xs text-muted-foreground">(bobot {bobot * 100}%)</span></span>
                <span className="font-display text-lg font-bold">{v[key]}</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={v[key]}
                onChange={(e) => setV({ ...v, [key]: Number(e.target.value) })}
                className="w-full accent-[oklch(0.66_0.2_42)]"
              />
            </div>
          ))}
          <div className="rounded-xl bg-hero p-4 text-white">
            <div className="text-[11px] uppercase tracking-wider text-white/60">Nilai Akhir (preview)</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold">{nilaiAkhir}</span>
              <span className="text-sm text-white/70">/ 100</span>
              <TrendingUp className="ml-auto h-5 w-5 text-accent" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catatan Evaluasi</label>
            <textarea
              rows={3}
              placeholder="Catatan tambahan..."
              className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
        <div className="flex gap-2 border-t border-border px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold hover:bg-secondary">Batal</button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-accent-gradient py-2.5 text-sm font-semibold text-white hover:opacity-95">Simpan Nilai</button>
        </div>
      </div>
    </>
  );
}
