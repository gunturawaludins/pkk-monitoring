import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpsertJadwal, type JadwalInput } from "@/data/queries";
import type { JadwalMendatang, Pewawancara } from "@/data/seed";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: JadwalMendatang | null;
  pewawancara: Pewawancara[];
  defaultDate?: string | null;
};

export function JadwalFormDialog({ open, onOpenChange, initial, pewawancara, defaultDate }: Props) {
  const upsert = useUpsertJadwal();
  const [form, setForm] = useState<JadwalInput>(blank());

  function blank(): JadwalInput {
    return {
      tanggal: defaultDate ?? "", waktu: "09:00", bank: "", calon: "", jabatan: "",
      internal: "", eksternal1Id: "", eksternal2Id: "",
    };
  }

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        id: initial.id, tanggal: initial.tanggal, waktu: initial.waktu, bank: initial.bank,
        calon: initial.calon, jabatan: initial.jabatan, internal: initial.internal,
        eksternal1Id: initial.eksternal1Id ?? "", eksternal2Id: initial.eksternal2Id ?? "",
        undanganTerkirim: initial.undanganTerkirim,
      } : { ...blank(), tanggal: defaultDate ?? "" });
    }
  }, [open, initial, defaultDate]);

  const handle = (k: keyof JadwalInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tanggal || !form.bank || !form.calon) return;
    await upsert.mutateAsync(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Jadwal Sesi" : "Tambah Jadwal Sesi PKK"}</DialogTitle>
          <DialogDescription>Lengkapi data jadwal wawancara PKK.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <Field label="Tanggal *">
            <Input type="date" value={form.tanggal} onChange={handle("tanggal")} required />
          </Field>
          <Field label="Waktu *">
            <Input type="time" value={form.waktu} onChange={handle("waktu")} required />
          </Field>
          <Field label="Bank *" className="col-span-2">
            <Input value={form.bank} onChange={handle("bank")} placeholder="Bank XYZ" required />
          </Field>
          <Field label="Calon Pihak Utama *" className="col-span-2">
            <Input value={form.calon} onChange={handle("calon")} placeholder="Nama lengkap" required />
          </Field>
          <Field label="Jabatan Dilamar" className="col-span-2">
            <Input value={form.jabatan} onChange={handle("jabatan")} placeholder="Direktur Utama" />
          </Field>
          <Field label="Pewawancara Internal" className="col-span-2">
            <Input value={form.internal} onChange={handle("internal")} placeholder="Nama analis OJK" />
          </Field>
          <Field label="Eksternal 1">
            <Select value={form.eksternal1Id ?? ""} onChange={handle("eksternal1Id")} list={pewawancara} />
          </Field>
          <Field label="Eksternal 2">
            <Select value={form.eksternal2Id ?? ""} onChange={handle("eksternal2Id")} list={pewawancara} />
          </Field>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={upsert.isPending}>
              {upsert.isPending ? "Menyimpan..." : initial ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Select({ value, onChange, list }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  list: Pewawancara[];
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="">— Pilih —</option>
      {list.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
    </select>
  );
}
