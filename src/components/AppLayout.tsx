import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Star,
  CalendarDays,
  BarChart3,
  Bell,
  Download,
  Plus,
  Search,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useNotifikasi } from "@/data/queries";

const navItems = [
  { to: "/", label: "Ringkasan Eksekutif", icon: LayoutDashboard, end: true },
  { to: "/profil", label: "Profil Individu", icon: Users },
  { to: "/penugasan", label: "Riwayat Penugasan", icon: ClipboardList },
  { to: "/evaluasi", label: "Evaluasi Kinerja", icon: Star },
  { to: "/manajemen", label: "Manajemen Penugasan", icon: CalendarDays, badge: true },
  { to: "/analitik", label: "Pelaporan & Analitik", icon: BarChart3 },
];

const pageMeta: Record<string, { title: string; breadcrumb: string[] }> = {
  "/": { title: "Ringkasan Eksekutif", breadcrumb: ["DIMB", "Dashboard"] },
  "/profil": { title: "Profil Individu", breadcrumb: ["DIMB", "Tim Klarifikasi", "Profil"] },
  "/penugasan": { title: "Riwayat Penugasan PKK", breadcrumb: ["DIMB", "Tim Klarifikasi", "Riwayat"] },
  "/evaluasi": { title: "Evaluasi Kinerja Pewawancara", breadcrumb: ["DIMB", "Tim Klarifikasi", "Evaluasi"] },
  "/manajemen": { title: "Manajemen Penugasan", breadcrumb: ["DIMB", "Tim Klarifikasi", "Jadwal"] },
  "/analitik": { title: "Pelaporan & Analitik", breadcrumb: ["DIMB", "Tim Klarifikasi", "Analitik"] },
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meta = pageMeta[pathname] ?? pageMeta["/"];
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifikasi } = useNotifikasi();
  const unread = notifikasi.length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">OJK · DIMB</div>
            <div className="text-[11px] text-sidebar-foreground/60">Tim Klarifikasi PKK</div>
          </div>
        </div>

        <div className="mx-4 my-4 rounded-xl bg-sidebar-accent/60 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gradient text-sm font-semibold text-white">
              FP
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">Farhan P.</div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">
                Analyst · PCS Angkatan 8
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = item.end
              ? pathname === item.to
              : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground font-semibold shadow-soft"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-accent ring-2 ring-sidebar"
                    style={active ? { background: "white" } : undefined}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-6 py-4 text-[11px] text-sidebar-foreground/50">
          <div>Versi 1.0 · Internal</div>
          <div className="mt-0.5">© 2026 OJK Departemen DIMB</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              {meta.breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3" />}
                  {b}
                </span>
              ))}
            </div>
            <h1 className="truncate text-lg font-bold text-foreground md:text-xl">
              {meta.title}
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium">
              📅 Mei 2026
            </span>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary transition-colors">
              <Download className="h-3.5 w-3.5" /> Ekspor
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3 py-2 text-xs font-semibold text-white shadow-soft hover:opacity-95 transition-opacity">
              <Plus className="h-3.5 w-3.5" /> Tambah Pewawancara
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-[360px] rounded-xl border border-border bg-card shadow-elevated">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="text-sm font-bold">Notifikasi</div>
                    <button className="text-[11px] font-medium text-accent hover:underline">
                      Tandai semua dibaca
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                    {notifikasi.map((n) => (
                      <div
                        key={n.id}
                        className="flex gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/50"
                      >
                        <div
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            n.tipe === "urgent"
                              ? "bg-destructive"
                              : n.tipe === "warning"
                              ? "bg-warning"
                              : n.tipe === "success"
                              ? "bg-success"
                              : "bg-accent"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold">{n.judul}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {n.pesan}
                          </div>
                          <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {n.waktu}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

// ---- Shared UI primitives ----

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    aktif: "bg-success/15 text-success border-success/30",
    baru_terdaftar: "bg-accent/15 text-accent border-accent/30",
    tidak_aktif: "bg-muted text-muted-foreground border-border",
    selesai: "bg-success/15 text-success border-success/30",
    terjadwal: "bg-accent/15 text-accent border-accent/30",
  };
  const label: Record<string, string> = {
    aktif: "Aktif",
    baru_terdaftar: "Baru Terdaftar",
    tidak_aktif: "Tidak Aktif",
    selesai: "Selesai",
    terjadwal: "Terjadwal",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
        map[status] ?? map.aktif
      }`}
    >
      {label[status] ?? status}
    </span>
  );
}

export function PewawancaraPill({
  nama,
  warna,
  inisial,
  id,
}: {
  nama: string;
  warna?: string;
  inisial?: string;
  id?: string;
}) {
  const fallback = nama.split(" ").map((s) => s[0]).slice(0, 2).join("");
  const body = (
    <>
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
        style={{ background: warna ?? "oklch(0.5 0.05 260)" }}
      >
        {inisial ?? fallback}
      </span>
      <span className="truncate max-w-[140px]">{nama}</span>
    </>
  );
  const cls = "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary py-0.5 pl-0.5 pr-2.5 text-[11px] font-medium";
  if (id) {
    return (
      <Link to="/profil/$id" params={{ id }} className={`${cls} hover:bg-accent/10 hover:border-accent/40 transition-colors`}>
        {body}
      </Link>
    );
  }
  return <span className={cls}>{body}</span>;
}

export { Search };
