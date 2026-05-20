import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, Plus, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, PewawancaraPill } from "@/components/AppLayout";
import { formatTanggalShort } from "@/data/seed";
import { usePenugasan, usePewawancara } from "@/data/queries";

export const Route = createFileRoute("/penugasan")({
  head: () => ({
    meta: [
      { title: "Riwayat Penugasan PKK — OJK DIMB" },
      { name: "description", content: "Riwayat penugasan sesi PKK pewawancara eksternal." },
    ],
  }),
  component: RiwayatPenugasan,
});

const PER_PAGE = 15;

function RiwayatPenugasan() {
  const [q, setQ] = useState("");
  const [tahun, setTahun] = useState("semua");
  const [page, setPage] = useState(1);
  const { data: penugasan } = usePenugasan();
  const { data: pewawancara } = usePewawancara();
  const pewawancaraById = (id: string) => pewawancara.find((p) => p.id === id);


  const filtered = useMemo(() => {
    return penugasan.filter((s) => {
      const matchQ = !q ||
        s.bank.toLowerCase().includes(q.toLowerCase()) ||
        s.calon.toLowerCase().includes(q.toLowerCase()) ||
        s.eksternal2Nama.toLowerCase().includes(q.toLowerCase());
      const matchT = tahun === "semua" || s.tanggal.startsWith(tahun);
      return matchQ && matchT;
    }).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [q, tahun, penugasan]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Cari bank, calon pihak utama, atau pewawancara..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-secondary p-1">
            {["semua", "2026", "2025"].map((t) => (
              <button
                key={t}
                onClick={() => { setTahun(t); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  tahun === t ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "semua" ? "Semua Tahun" : t}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary">
            <Download className="h-3.5 w-3.5" /> Export Excel
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-2 text-xs font-semibold text-white shadow-soft hover:opacity-95">
            <Plus className="h-3.5 w-3.5" /> Tambah Sesi
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">
                  <button className="inline-flex items-center gap-1">Tanggal <ArrowUpDown className="h-3 w-3" /></button>
                </th>
                <th className="px-4 py-3 font-semibold">Bank</th>
                <th className="px-4 py-3 font-semibold">Calon Pihak Utama</th>
                <th className="px-4 py-3 font-semibold">Jabatan Dilamar</th>
                <th className="px-4 py-3 font-semibold">Pewawancara Internal</th>
                <th className="px-4 py-3 font-semibold">Pewawancara Eksternal 1</th>
                <th className="px-4 py-3 font-semibold">Pewawancara Eksternal 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((s, i) => {
                const eks = pewawancaraById(s.eksternal1Id);
                const idx = (page - 1) * PER_PAGE + i + 1;
                return (
                  <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-muted-foreground">{idx}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{formatTanggalShort(s.tanggal)}</td>
                    <td className="px-4 py-3 font-semibold">{s.bank}</td>
                    <td className="px-4 py-3">{s.calon}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.jabatan}</td>
                    <td className="px-4 py-3 text-xs">{s.internal}</td>
                    <td className="px-4 py-3">{eks && <PewawancaraPill nama={eks.nama} warna={eks.warna} inisial={eks.inisial} />}</td>
                    <td className="px-4 py-3"><PewawancaraPill nama={s.eksternal2Nama} /></td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-muted-foreground">
                    Tidak ada sesi yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs">
          <div className="text-muted-foreground">
            Menampilkan {paginated.length} dari {filtered.length} sesi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-semibold">Hal. {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
