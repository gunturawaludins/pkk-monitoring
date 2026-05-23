import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Star, Briefcase, ClipboardList, GraduationCap, Phone, FileText,
  Mail, CreditCard, Edit, Trash2, TrendingUp, Calendar, Building2, Award,
} from "lucide-react";
import { Card, StatusBadge, PewawancaraPill } from "@/components/AppLayout";
import { formatTanggal, formatTanggalShort } from "@/data/seed";
import {
  usePewawancaraById, usePenugasan, useEvaluasi, useDeletePewawancara,
} from "@/data/queries";
import { PewawancaraFormDialog } from "@/components/PewawancaraFormDialog";

export const Route = createFileRoute("/profil/$id")({
  head: () => ({
    meta: [
      { title: "Profil Pewawancara — OJK DIMB" },
      { name: "description", content: "Detail profil, riwayat penugasan, dan evaluasi kinerja pewawancara eksternal." },
    ],
  }),
  component: ProfilDetail,
});

function ProfilDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const p = usePewawancaraById(id);
  const { data: penugasan } = usePenugasan();
  const { data: evaluasi } = useEvaluasi();
  const del = useDeletePewawancara();
  const [tab, setTab] = useState<"profil" | "penugasan" | "evaluasi">("profil");
  const [editOpen, setEditOpen] = useState(false);

  const sesi = useMemo(() => penugasan.filter((s) => s.eksternal1Id === id), [penugasan, id]);
  const evals = useMemo(() => evaluasi.filter((e) => e.pewawancaraId === id), [evaluasi, id]);
  const avg = evals.length ? evals.reduce((a, e) => a + e.nilaiAkhir, 0) / evals.length : 0;
  const avgAvail = evals.length ? evals.reduce((a, e) => a + e.availability, 0) / evals.length : 0;
  const avgKual = evals.length ? evals.reduce((a, e) => a + e.kualitas, 0) / evals.length : 0;
  const avgSub = evals.length ? evals.reduce((a, e) => a + e.substansi, 0) / evals.length : 0;

  if (!p) {
    return (
      <Card className="p-12 text-center">
        <div className="text-sm text-muted-foreground">Profil tidak ditemukan.</div>
        <Link to="/profil" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
          <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
        </Link>
      </Card>
    );
  }

  const onDelete = () => {
    if (!confirm(`Hapus profil ${p.nama}? Tindakan ini tidak bisa dibatalkan.`)) return;
    del.mutate(p.id, { onSuccess: () => navigate({ to: "/profil" }) });
  };

  return (
    <div className="space-y-6">
      <Link to="/profil" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke daftar pewawancara
      </Link>

      {/* HERO */}
      <Card className="overflow-hidden">
        <div className="relative bg-hero px-8 py-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div
              className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/30 text-4xl font-bold shadow-elevated"
              style={{ background: p.warna }}
            >
              {p.fotoUrl ? <img src={p.fotoUrl} alt={p.nama} className="h-full w-full object-cover" /> : p.inisial}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-bold leading-tight">{p.nama}</h1>
              <p className="mt-1 text-sm text-white/80">{p.jabatanTerakhir}</p>
              <p className="text-xs text-white/60">{p.instansiTerakhir}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={p.status} />
                {p.keahlian.slice(0, 4).map((k) => (
                  <span key={k} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 md:flex-col">
              <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur hover:bg-white/25">
                <Edit className="h-3.5 w-3.5" /> Edit Profil
              </button>
              <button onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur hover:bg-destructive/80">
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <HeroStat icon={ClipboardList} label="Total Sesi" value={sesi.length.toString()} />
            <HeroStat icon={Star} label="Nilai Rata-rata" value={avg ? avg.toFixed(1) : "—"} />
            <HeroStat icon={Award} label="Keahlian" value={p.keahlian.length.toString()} />
            <HeroStat icon={Calendar} label="Bergabung" value={p.tanggalBergabung ? formatTanggalShort(p.tanggalBergabung) : "—"} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-6 pt-3">
          {([
            ["profil", "Profil Lengkap", FileText],
            ["penugasan", `Riwayat Penugasan (${sesi.length})`, ClipboardList],
            ["evaluasi", `Evaluasi Kinerja (${evals.length})`, Star],
          ] as const).map(([k, l, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
                tab === k
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {l}
            </button>
          ))}
        </div>
      </Card>

      {tab === "profil" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <SectionHead icon={Phone} title="Data Identitas & Kontak" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="NIK" value={p.nik} />
              <Field label="NPWP" value={p.npwp} />
              <Field label="No. Telepon" value={p.noTelepon} />
              <Field label="Email" value={p.email ?? "-"} />
              <Field label="No. Rekening" value={p.rekening} span={2} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionHead icon={FileText} title="Surat Keputusan" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Nomor SK" value={p.nomorSK} />
              <Field label="Tanggal SK" value={p.tanggalSK ? formatTanggal(p.tanggalSK) : "-"} />
              <Field label="Tanggal Bergabung" value={p.tanggalBergabung ? formatTanggal(p.tanggalBergabung) : "-"} />
              <Field label="SK Berakhir" value={p.tanggalSKExpire ? formatTanggal(p.tanggalSKExpire) : "-"} highlight />
            </div>
          </Card>

          <Card className="p-6">
            <SectionHead icon={GraduationCap} title="Pendidikan" />
            {p.pendidikan.length === 0 ? (
              <Empty text="Belum ada data pendidikan" />
            ) : (
              <div className="space-y-2">
                {p.pendidikan.map((e, i) => (
                  <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">{e.jenjang}</span>
                      <div className="text-sm font-semibold">{e.bidang}</div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /> {e.institusi}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <SectionHead icon={Briefcase} title="Riwayat Karir" />
            {p.karir.length === 0 ? (
              <Empty text="Belum ada data karir" />
            ) : (
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
            )}
          </Card>

          <Card className="p-6 lg:col-span-2">
            <SectionHead icon={Award} title="Bidang Keahlian" />
            {p.keahlian.length === 0 ? (
              <Empty text="Belum ada keahlian terdaftar" />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {p.keahlian.map((k) => (
                  <span key={k} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">{k}</span>
                ))}
              </div>
            )}
            {p.catatan && (
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                <span className="font-bold uppercase tracking-wider">Catatan:</span> {p.catatan}
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "penugasan" && (
        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-bold">Riwayat Penugasan PKK</h3>
            <p className="text-xs text-muted-foreground">{sesi.length} sesi tercatat untuk {p.nama}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Bank</th>
                  <th className="px-4 py-3">Calon Pihak Utama</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Pewawancara Internal</th>
                  <th className="px-4 py-3">Eksternal 2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sesi.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Belum ada penugasan tercatat.</td></tr>
                ) : sesi.sort((a, b) => b.tanggal.localeCompare(a.tanggal)).map((s) => (
                  <tr key={s.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{formatTanggalShort(s.tanggal)}</td>
                    <td className="px-4 py-3 font-semibold">{s.bank}</td>
                    <td className="px-4 py-3">{s.calon}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.jabatan}</td>
                    <td className="px-4 py-3 text-xs">{s.internal}</td>
                    <td className="px-4 py-3"><PewawancaraPill nama={s.eksternal2Nama} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "evaluasi" && (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <ScoreCard label="Nilai Akhir" value={avg ? avg.toFixed(1) : "—"} accent />
            <ScoreCard label="Availability" sub="bobot 20%" value={avgAvail ? avgAvail.toFixed(0) : "—"} />
            <ScoreCard label="Kualitas" sub="bobot 40%" value={avgKual ? avgKual.toFixed(0) : "—"} />
            <ScoreCard label="Substansi" sub="bobot 40%" value={avgSub ? avgSub.toFixed(0) : "—"} />
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-base font-bold">Detail Skor per Sesi</h3>
                <p className="text-xs text-muted-foreground">{evals.length} evaluasi tercatat</p>
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Sesi</th>
                    <th className="px-4 py-3 text-center">Availability</th>
                    <th className="px-4 py-3 text-center">Kualitas</th>
                    <th className="px-4 py-3 text-center">Substansi</th>
                    <th className="px-4 py-3 text-center">Nilai Akhir</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {evals.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">Belum ada evaluasi tercatat.</td></tr>
                  ) : evals.map((e) => {
                    const s = penugasan.find((x) => x.id === e.penugasanId);
                    const status = e.nilaiAkhir >= 90 ? "sangat-baik" : e.nilaiAkhir >= 80 ? "baik" : "perlu-perhatian";
                    return (
                      <tr key={e.penugasanId} className="hover:bg-secondary/40">
                        <td className="px-4 py-3">
                          <div className="text-xs font-semibold">{s ? formatTanggalShort(s.tanggal) : "-"}</div>
                          <div className="text-xs text-muted-foreground">{s?.bank}</div>
                        </td>
                        <td className="px-4 py-3 text-center">{e.availability}</td>
                        <td className="px-4 py-3 text-center">{e.kualitas}</td>
                        <td className="px-4 py-3 text-center">{e.substansi}</td>
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
        </div>
      )}

      <PewawancaraFormDialog open={editOpen} onOpenChange={setEditOpen} initial={p} />
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <Icon className="h-4 w-4 text-white/60" />
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );
}
function SectionHead({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {title}
    </h4>
  );
}
function Field({ label, value, span = 1, highlight }: { label: string; value: string; span?: number; highlight?: boolean }) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-medium ${highlight ? "text-warning" : ""}`}>{value || "-"}</div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">{text}</div>;
}
function ScoreCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <Card className={`p-5 ${accent ? "bg-hero text-white" : ""}`}>
      <div className={`text-[11px] uppercase tracking-wider ${accent ? "text-white/60" : "text-muted-foreground"}`}>{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold">{value}</span>
        {sub && <span className={`text-xs ${accent ? "text-white/60" : "text-muted-foreground"}`}>{sub}</span>}
      </div>
    </Card>
  );
}
