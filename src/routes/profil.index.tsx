import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card, StatusBadge } from "@/components/AppLayout";
import { type Status } from "@/data/seed";
import { usePewawancara, usePenugasan, useEvaluasi } from "@/data/queries";
import { PewawancaraFormDialog } from "@/components/PewawancaraFormDialog";

export const Route = createFileRoute("/profil/")({
  head: () => ({
    meta: [
      { title: "Profil Individu — Tim Klarifikasi PKK" },
      { name: "description", content: "Daftar pewawancara eksternal — klik untuk melihat profil lengkap." },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"semua" | Status | "belum">("semua");
  const [addOpen, setAddOpen] = useState(false);
  const { data: pewawancara } = usePewawancara();
  const { data: penugasan } = usePenugasan();
  const { data: evaluasi } = useEvaluasi();

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
  }, [q, filter, pewawancara, penugasan]);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau keahlian..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
                  filter === k ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-2 text-xs font-semibold text-white shadow-soft hover:opacity-95"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Pewawancara
          </button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const sesiCount = penugasan.filter((s) => s.eksternal1Id === p.id).length;
          const evals = evaluasi.filter((e) => e.pewawancaraId === p.id);
          const avg = evals.length ? (evals.reduce((a, e) => a + e.nilaiAkhir, 0) / evals.length).toFixed(1) : "-";
          return (
            <Card key={p.id} className="overflow-hidden transition-all hover:shadow-elevated">
              <Link to="/profil/$id" params={{ id: p.id }} className="block">
                <div className="relative h-24 bg-hero">
                  <div className="absolute inset-x-0 -bottom-9 flex justify-center">
                    <div
                      className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-4 border-card text-2xl font-bold text-white shadow-soft"
                      style={{ background: p.warna }}
                    >
                      {p.fotoUrl ? <img src={p.fotoUrl} alt={p.nama} className="h-full w-full object-cover" /> : p.inisial}
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-12 text-center">
                  <h3 className="font-display text-base font-bold leading-tight">{p.nama}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {p.jabatanTerakhir} · {p.instansiTerakhir}
                  </p>
                  <div className="mt-2 flex justify-center"><StatusBadge status={p.status} /></div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {p.keahlian.slice(0, 3).map((k) => (
                      <span key={k} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{k}</span>
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
              </Link>
            </Card>
          );
        })}
        {list.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center text-sm text-muted-foreground">
              Belum ada pewawancara yang cocok. Klik "Tambah Pewawancara" untuk menambah.
            </Card>
          </div>
        )}
      </div>

      <PewawancaraFormDialog open={addOpen} onOpenChange={setAddOpen} />
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
