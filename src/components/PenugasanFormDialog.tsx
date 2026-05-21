import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpsertPenugasan, type PenugasanInput } from "@/data/queries";
import type { Penugasan, Pewawancara } from "@/data/seed";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Penugasan | null;
  pewawancara: Pewawancara[];
};

export function PenugasanFormDialog({ open, onOpenChange, initial, pewawancara }: Props) {
  const upsert = useUpsertPenugasan();
  const [form, setForm] = useState<PenugasanInput>(blank());

  function blank(): PenugasanInput {
    return {
      tanggal: "", bank: "", calon: "", jabatan: "", internal: "",
      eksternal1Id: "", eksternal2Nama: "", status: "selesai",
    };
  }

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        id: initial.id, tanggal: initial.tanggal, bank: initial.bank, calon: initial.calon,
        jabatan: initial.jabatan, internal: initial.internal,
        eksternal1Id: initial.eksternal1Id, eksternal2Nama: initial.eksternal2Nama,
        status: initial.status,
      } : blank());
    }
  }, [open, initial]);

  const handle = (k: keyof PenugasanInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
          <DialogTitle>{initial ? "Edit Sesi Penugasan" : "Tambah Sesi Penugasan"}</DialogTitle>
          <DialogDescription>Catat sesi PKK ke riwayat penugasan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <Field label="Tanggal *">
            <Input type="date" value={form.tanggal} onChange={handle("tanggal")} required />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={handle("status")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="selesai">Selesai</option>
              <option value="terjadwal">Terjadwal</option>
            </select>
          </Field>
          <Field label="Bank *" className="col-span-2">
            <Input value={form.bank} onChange={handle("bank")} required />
          </Field>
          <Field label="Calon Pihak Utama *" className="col-span-2">
            <Input value={form.calon} onChange={handle("calon")} required />
          </Field>
          <Field label="Jabatan Dilamar" className="col-span-2">
            <Input value={form.jabatan} onChange={handle("jabatan")} />
          </Field>
          <Field label="Pewawancara Internal" className="col-span-2">
            <Input value={form.internal} onChange={handle("internal")} />
          </Field>
          <Field label="Eksternal 1">
            <select
              value={form.eksternal1Id ?? ""}
              onChange={handle("eksternal1Id")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="">— Pilih —</option>
              {pewawancara.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </Field>
          <Field label="Eksternal 2 (nama)">
            <Input value={form.eksternal2Nama ?? ""} onChange={handle("eksternal2Nama")} placeholder="Nama bebas" />
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
