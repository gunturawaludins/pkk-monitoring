import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Send, CheckCircle2, Clock, Users, MapPin,
  Pencil, Trash2, CheckCheck,
} from "lucide-react";
import { Card, PewawancaraPill } from "@/components/AppLayout";
import { formatTanggal, type JadwalMendatang } from "@/data/seed";
import {
  useJadwalMendatang, usePewawancara, useDeleteJadwal,
  useKirimUndangan, useTandaiSelesai,
} from "@/data/queries";
import { JadwalFormDialog } from "@/components/JadwalFormDialog";

export const Route = createFileRoute("/manajemen")({
  head: () => ({
    meta: [
      { title: "Manajemen Penugasan — Tim Klarifikasi PKK" },
      { name: "description", content: "Penjadwalan sesi PKK dan pengiriman undangan." },
    ],
  }),
  component: ManajemenPenugasan,
});

const namaBulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const namaHari = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

function ManajemenPenugasan() {
  const [bulan, setBulan] = useState(4);
  const [tahun, setTahun] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JadwalMendatang | null>(null);

  const { data: jadwalMendatang } = useJadwalMendatang();
  const { data: pewawancara } = usePewawancara();
  const pewawancaraById = (id: string) => pewawancara.find((p) => p.id === id);
  const delJadwal = useDeleteJadwal();
  const kirim = useKirimUndangan();
  const tandai = useTandaiSelesai();

  const days = useMemo(() => {
    const first = new Date(Date.UTC(tahun, bulan, 1));
    const startWeekday = first.getUTCDay();
    const daysInMonth = new Date(Date.UTC(tahun, bulan + 1, 0)).getUTCDate();
    const cells: ({ d: number; iso: string } | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${tahun}-${String(bulan + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ d, iso });
    }
    return cells;
  }, [bulan, tahun]);

  const jadwalDates = new Set(jadwalMendatang.map((j) => j.tanggal));
  const selectedJadwal = selectedDate ? jadwalMendatang.filter((j) => j.tanggal === selectedDate) : [];

  const next = () => { if (bulan === 11) { setBulan(0); setTahun(tahun + 1); } else setBulan(bulan + 1); };
  const prev = () => { if (bulan === 0) { setBulan(11); setTahun(tahun - 1); } else setBulan(bulan - 1); };

  const openNew = (date?: string | null) => { setEditing(null); setSelectedDate(date ?? selectedDate); setDialogOpen(true); };
  const openEdit = (j: JadwalMendatang) => { setEditing(j); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold">{namaBulan[bulan]} {tahun}</h3>
              <p className="text-xs text-muted-foreground">Kalender ketersediaan & sesi terjadwal</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => { setBulan(4); setTahun(2026); }} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary">Hari Ini</button>
              <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {namaHari.map((h) => (
              <div key={h} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((c, i) => {
              if (!c) return <div key={i} className="aspect-square" />;
              const hasJadwal = jadwalDates.has(c.iso);
              const selected = c.iso === selectedDate;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(c.iso)}
                  className={`aspect-square rounded-lg border p-2 text-left transition-all hover:border-accent ${
                    selected ? "border-accent bg-accent/10 shadow-soft" : "border-border bg-background"
                  }`}
                >
                  <div className={`text-sm font-bold ${selected ? "text-accent" : ""}`}>{c.d}</div>
                  {hasJadwal && <div className="mt-1 flex gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" /></div>}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Ada sesi terjadwal</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-border" /> Tersedia</div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5">
          <h3 className="font-display text-base font-bold">
            {selectedDate ? formatTanggal(selectedDate) : "Pilih tanggal"}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {selectedJadwal.length > 0 ? `${selectedJadwal.length} sesi terjadwal` : "Tidak ada sesi pada tanggal ini"}
          </p>

          {selectedJadwal.length > 0 ? (
            <div className="mt-4 space-y-3">
              {selectedJadwal.map((j) => (
                <div key={j.id} className="rounded-xl border border-border bg-secondary/50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Clock className="h-4 w-4 text-accent" /> {j.waktu} WIB
                      </div>
                      <div className="mt-1 text-sm font-semibold">{j.bank}</div>
                      <div className="text-xs text-muted-foreground">{j.calon} · {j.jabatan}</div>
                    </div>
                    <div className="flex gap-1">
                      <IconBtn onClick={() => openEdit(j)} title="Edit"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn onClick={() => confirm("Hapus jadwal ini?") && delJadwal.mutate(j.id)} title="Hapus" danger>
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => openNew(selectedDate)}
                className="w-full rounded-xl border-2 border-dashed border-border py-3 text-xs font-medium text-muted-foreground hover:border-accent hover:bg-accent/5"
              >
                <Plus className="mx-auto mb-0.5 h-4 w-4" /> Tambah Jadwal Lain
              </button>
            </div>
          ) : (
            <button
              onClick={() => openNew(selectedDate)}
              disabled={!selectedDate}
              className="mt-4 w-full rounded-xl border-2 border-dashed border-border py-8 text-sm font-medium text-muted-foreground hover:border-accent hover:bg-accent/5 disabled:opacity-50 disabled:hover:border-border"
            >
              <Plus className="mx-auto mb-1 h-5 w-5" />
              {selectedDate ? "Tambah Jadwal Baru" : "Pilih tanggal dulu"}
            </button>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-bold">Sesi Mendatang & Penugasan Pewawancara</h3>
            <p className="text-xs text-muted-foreground">{jadwalMendatang.length} sesi terjadwal</p>
          </div>
          <button
            onClick={() => openNew()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
          >
            <Plus className="h-3 w-3" /> Tambah Jadwal
          </button>
        </div>
        <div className="divide-y divide-border">
          {jadwalMendatang.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">
              Belum ada sesi terjadwal. Klik <strong>Tambah Jadwal</strong> untuk mulai.
            </div>
          )}
          {jadwalMendatang.map((j) => {
            const eks1 = j.eksternal1Id ? pewawancaraById(j.eksternal1Id) : null;
            const eks2 = j.eksternal2Id ? pewawancaraById(j.eksternal2Id) : null;
            return (
              <div key={j.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/40">
                <div className="col-span-12 md:col-span-2">
                  <div className="rounded-xl bg-hero p-3 text-center text-white inline-block min-w-[80px]">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">
                      {new Date(j.tanggal).toLocaleString("id-ID", { month: "short", timeZone: "UTC" })}
                    </div>
                    <div className="font-display text-2xl font-bold leading-none">
                      {new Date(j.tanggal).getUTCDate()}
                    </div>
                    <div className="mt-1 text-[10px] text-white/70">{j.waktu}</div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className="text-sm font-bold">{j.bank}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    <MapPin className="inline h-3 w-3 mr-0.5" /> {j.calon} · {j.jabatan}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Internal: <span className="font-medium text-foreground">{j.internal}</span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Users className="inline h-3 w-3 mr-1" /> Pewawancara Eksternal
                  </div>
                  {eks1
                    ? <PewawancaraPill nama={eks1.nama} warna={eks1.warna} inisial={eks1.inisial} />
                    : <span className="block text-[11px] text-muted-foreground italic">Slot 1 kosong</span>}
                  {eks2
                    ? <PewawancaraPill nama={eks2.nama} warna={eks2.warna} inisial={eks2.inisial} />
                    : <span className="block text-[11px] text-muted-foreground italic">Slot 2 kosong</span>}
                </div>
                <div className="col-span-12 md:col-span-2 flex md:flex-col gap-1.5 md:items-end">
                  {j.undanganTerkirim ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase text-success">
                      <CheckCircle2 className="h-3 w-3" /> Terkirim
                    </span>
                  ) : (
                    <button
                      onClick={() => kirim.mutate(j.id)}
                      disabled={kirim.isPending}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" /> Kirim Undangan
                    </button>
                  )}
                  <div className="flex gap-1">
                    <IconBtn onClick={() => openEdit(j)} title="Edit"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn onClick={() => confirm(`Tandai sesi ${j.bank} sudah selesai?`) && tandai.mutate(j)} title="Tandai Selesai">
                      <CheckCheck className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn onClick={() => confirm("Hapus jadwal ini?") && delJadwal.mutate(j.id)} title="Hapus" danger>
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <JadwalFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        pewawancara={pewawancara}
        defaultDate={editing ? null : selectedDate}
      />
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: {
  children: React.ReactNode; onClick: () => void; title: string; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card transition-colors ${
        danger ? "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" : "hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
