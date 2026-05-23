import { useEffect, useState } from "react";
import { X, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import { useUpsertPewawancara, uploadFotoProfil } from "@/data/queries";
import type { Pewawancara, Status } from "@/data/seed";
import { toast } from "sonner";

const WARNA_PRESET = [
  "oklch(0.55 0.18 28)", "oklch(0.55 0.18 145)", "oklch(0.55 0.18 245)",
  "oklch(0.55 0.18 295)", "oklch(0.6 0.18 80)", "oklch(0.55 0.18 195)",
  "oklch(0.5 0.15 350)", "oklch(0.55 0.16 60)",
];

function inisialFrom(nama: string) {
  return nama.trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Pewawancara | null;
  onSaved?: (id: string) => void;
};

export function PewawancaraFormDialog({ open, onOpenChange, initial, onSaved }: Props) {
  const upsert = useUpsertPewawancara();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(() => emptyForm());

  useEffect(() => {
    if (!open) return;
    setForm(initial ? fromPewawancara(initial) : emptyForm());
  }, [open, initial]);

  if (!open) return null;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadFotoProfil(f);
      set("fotoUrl", url);
      toast.success("Foto berhasil diunggah");
    } catch (err) {
      toast.error(`Gagal upload: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.nama.trim()) return toast.error("Nama wajib diisi");
    const inisial = form.inisial || inisialFrom(form.nama);
    const id = await upsert.mutateAsync({
      ...form,
      inisial,
      id: initial?.id,
    });
    onSaved?.(id);
    onOpenChange(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[760px] max-w-[95vw] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-card shadow-elevated">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-bold">{initial ? "Edit Pewawancara" : "Tambah Pewawancara"}</h3>
            <p className="text-xs text-muted-foreground">Lengkapi data sesuai profil individu PKK.</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-5 max-h-[calc(92vh-130px)] scrollbar-thin">
          {/* Foto + identitas */}
          <Section title="Identitas">
            <div className="flex gap-5">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-border bg-secondary text-2xl font-bold text-white overflow-hidden"
                  style={{ background: form.warna }}
                >
                  {form.fotoUrl ? (
                    <img src={form.fotoUrl} alt="Foto" className="h-full w-full object-cover" />
                  ) : (
                    inisialFrom(form.nama) || "—"
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold hover:bg-secondary">
                  {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Foto
                  <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
                </label>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3">
                <FieldText label="Nama Lengkap" value={form.nama} onChange={(v) => set("nama", v)} required span={2} />
                <FieldText label="Jabatan Terakhir" value={form.jabatanTerakhir} onChange={(v) => set("jabatanTerakhir", v)} />
                <FieldText label="Instansi Terakhir" value={form.instansiTerakhir} onChange={(v) => set("instansiTerakhir", v)} />
                <div>
                  <Label>Status</Label>
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as Status)}
                    className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="baru_terdaftar">Baru Terdaftar</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div>
                  <Label>Warna Avatar</Label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {WARNA_PRESET.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => set("warna", w)}
                        className={`h-6 w-6 rounded-full border-2 ${form.warna === w ? "border-foreground" : "border-transparent"}`}
                        style={{ background: w }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Data Kontak & Administratif">
            <div className="grid grid-cols-2 gap-3">
              <FieldText label="NIK" value={form.nik} onChange={(v) => set("nik", v)} />
              <FieldText label="NPWP" value={form.npwp} onChange={(v) => set("npwp", v)} />
              <FieldText label="No. Telepon" value={form.noTelepon} onChange={(v) => set("noTelepon", v)} />
              <FieldText label="Email" value={form.email} onChange={(v) => set("email", v)} />
              <FieldText label="No. Rekening" value={form.rekening} onChange={(v) => set("rekening", v)} span={2} />
            </div>
          </Section>

          <Section title="Surat Keputusan">
            <div className="grid grid-cols-2 gap-3">
              <FieldText label="Nomor SK" value={form.nomorSK} onChange={(v) => set("nomorSK", v)} />
              <FieldText label="Tanggal Bergabung" type="date" value={form.tanggalBergabung} onChange={(v) => set("tanggalBergabung", v)} />
              <FieldText label="Tanggal SK" type="date" value={form.tanggalSK} onChange={(v) => set("tanggalSK", v)} />
              <FieldText label="SK Berakhir" type="date" value={form.tanggalSKExpire} onChange={(v) => set("tanggalSKExpire", v)} />
            </div>
          </Section>

          <RepeaterSection
            title="Pendidikan"
            items={form.pendidikan}
            onAdd={() => set("pendidikan", [...form.pendidikan, { jenjang: "", bidang: "", institusi: "" }])}
            onRemove={(i) => set("pendidikan", form.pendidikan.filter((_, idx) => idx !== i))}
            render={(it, i) => (
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="S1/S2/S3" value={it.jenjang} onChange={(v) => update(form, set, "pendidikan", i, { ...it, jenjang: v })} />
                <Input placeholder="Bidang studi" value={it.bidang} onChange={(v) => update(form, set, "pendidikan", i, { ...it, bidang: v })} />
                <Input placeholder="Institusi" value={it.institusi} onChange={(v) => update(form, set, "pendidikan", i, { ...it, institusi: v })} />
              </div>
            )}
          />

          <RepeaterSection
            title="Riwayat Karir"
            items={form.karir}
            onAdd={() => set("karir", [...form.karir, { jabatan: "", instansi: "", periode: "" }])}
            onRemove={(i) => set("karir", form.karir.filter((_, idx) => idx !== i))}
            render={(it, i) => (
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Jabatan" value={it.jabatan} onChange={(v) => update(form, set, "karir", i, { ...it, jabatan: v })} />
                <Input placeholder="Instansi" value={it.instansi} onChange={(v) => update(form, set, "karir", i, { ...it, instansi: v })} />
                <Input placeholder="Periode (mis. 2010-2018)" value={it.periode} onChange={(v) => update(form, set, "karir", i, { ...it, periode: v })} />
              </div>
            )}
          />

          <Section title="Bidang Keahlian">
            <TagInput
              tags={form.keahlian}
              onChange={(t) => set("keahlian", t)}
              placeholder="Ketik keahlian lalu Enter (mis. Manajemen Risiko)"
            />
          </Section>

          <Section title="Catatan">
            <textarea
              rows={2}
              value={form.catatan}
              onChange={(e) => set("catatan", e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 text-sm"
              placeholder="Catatan tambahan (opsional)"
            />
          </Section>
        </div>

        <div className="flex gap-2 border-t border-border bg-card px-6 py-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold hover:bg-secondary">
            Batal
          </button>
          <button
            onClick={submit}
            disabled={upsert.isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-gradient py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {upsert.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial ? "Simpan Perubahan" : "Tambah Pewawancara"}
          </button>
        </div>
      </div>
    </>
  );
}

// helpers
function emptyForm() {
  return {
    nama: "",
    jabatanTerakhir: "",
    instansiTerakhir: "",
    inisial: "",
    warna: WARNA_PRESET[0],
    status: "baru_terdaftar" as Status,
    nik: "",
    npwp: "",
    noTelepon: "",
    email: "",
    rekening: "",
    tanggalBergabung: "",
    tanggalSK: "",
    tanggalSKExpire: "",
    nomorSK: "",
    fotoUrl: "",
    pendidikan: [] as { jenjang: string; bidang: string; institusi: string }[],
    karir: [] as { jabatan: string; instansi: string; periode: string }[],
    keahlian: [] as string[],
    catatan: "",
  };
}
function fromPewawancara(p: Pewawancara): ReturnType<typeof emptyForm> {
  return {
    nama: p.nama, jabatanTerakhir: p.jabatanTerakhir, instansiTerakhir: p.instansiTerakhir,
    inisial: p.inisial, warna: p.warna, status: p.status,
    nik: p.nik, npwp: p.npwp, noTelepon: p.noTelepon, email: p.email ?? "",
    rekening: p.rekening, tanggalBergabung: p.tanggalBergabung,
    tanggalSK: p.tanggalSK, tanggalSKExpire: p.tanggalSKExpire, nomorSK: p.nomorSK,
    fotoUrl: p.fotoUrl ?? "",
    pendidikan: [...p.pendidikan], karir: [...p.karir], keahlian: [...p.keahlian],
    catatan: p.catatan ?? "",
  };
}
function update<F extends Record<string, unknown>, K extends keyof F>(
  form: F, set: (k: K, v: F[K]) => void, key: K, idx: number, value: unknown
) {
  const arr = [...(form[key] as unknown[])];
  arr[idx] = value;
  set(key, arr as F[K]);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>;
}
function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
    />
  );
}
function FieldText({ label, value, onChange, span = 1, required, type }: { label: string; value: string; onChange: (v: string) => void; span?: number; required?: boolean; type?: string }) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input value={value} onChange={onChange} type={type} />
    </div>
  );
}

function RepeaterSection<T>({ title, items, onAdd, onRemove, render }: {
  title: string; items: T[]; onAdd: () => void; onRemove: (i: number) => void; render: (it: T, i: number) => React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-semibold hover:bg-secondary">
          <Plus className="h-3 w-3" /> Tambah
        </button>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-2">
            <div className="flex-1">{render(it, i)}</div>
            <button type="button" onClick={() => onRemove(i)} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
            Belum ada data — klik "Tambah".
          </div>
        )}
      </div>
    </div>
  );
}

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim()) {
            e.preventDefault();
            if (!tags.includes(v.trim())) onChange([...tags, v.trim()]);
            setV("");
          }
        }}
        placeholder={placeholder}
        className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}
