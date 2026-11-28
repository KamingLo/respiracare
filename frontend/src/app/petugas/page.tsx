"use client";

import { AlertCircle, AlertOctagon, AlertTriangle, Bell, FileText, LogOut, MapPin, SlidersHorizontal, User, Wind } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AqiHero } from "@/components/aqi-hero";
import { ClusterDetailBody } from "@/components/cluster-detail";
import { Logo } from "@/components/logo";
import { MapCanvas, type MapMarker } from "@/components/map-canvas";
import { BottomTabs } from "@/components/screen";
import { CLUSTERS, DISEASE_LABEL, LEVEL_STYLE, type Cluster } from "@/lib/data";
import { signOutOfficer, useOfficer } from "@/lib/officer-session";

const LEVEL_ICON = { prioritas: AlertOctagon, siaga: AlertCircle, waspada: AlertTriangle } as const;

function useMarkers(activeId: string): MapMarker[] {
  return useMemo(
    () =>
      CLUSTERS.map((c) => ({
        id: c.id,
        x: c.x,
        y: c.y,
        r: c.r,
        count: c.reports,
        color: LEVEL_STYLE[c.level].dot,
        label: c.name,
        active: c.id === activeId,
      })),
    [activeId],
  );
}

function LevelBadge({ level }: { level: Cluster["level"] }) {
  const s = LEVEL_STYLE[level];
  return (
    <span className="t-chip shrink-0 rounded-full px-3 py-1" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

export default function DasborPetugas() {
  const router = useRouter();
  const officer = useOfficer();
  const [activeId, setActiveId] = useState(CLUSTERS[0].id);
  const markers = useMarkers(activeId);
  const active = CLUSTERS.find((c) => c.id === activeId) ?? CLUSTERS[0];
  const top = CLUSTERS[0];

  useEffect(() => {
    if (officer === null) router.replace("/petugas/login");
  }, [officer, router]);

  if (!officer) {
    return <div className="grid min-h-dvh place-items-center" aria-busy="true" />;
  }

  const logout = () => {
    signOutOfficer();
    router.replace("/petugas/login");
  };

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-surface sm:border-x sm:border-line lg:h-full lg:max-w-none lg:flex-row lg:border-0">
        {/* Sidebar (desktop) */}
        <aside className="fade-in hidden w-[288px] shrink-0 flex-col gap-6 border-r border-line bg-white p-5 lg:flex">
          <div className="flex items-center gap-3">
            <Logo variant="mark" className="w-11" />
            <div className="min-w-0">
              <p className="t-section">RespiraCare</p>
              <p className="t-label text-ink-soft">{officer.puskesmas}</p>
            </div>
          </div>
          <nav aria-label="Menu surveilans">
            <ul className="flex flex-col gap-1">
              {[
                { label: "Peta Klaster", Icon: MapPin, on: true },
                { label: "Daftar Laporan", Icon: FileText, on: false },
                { label: "Tren Kualitas Udara", Icon: Wind, on: false },
                { label: "Akun Petugas", Icon: User, on: false },
              ].map(({ label, Icon, on }) => (
                <li key={label}>
                  <button
                    type="button"
                    aria-current={on ? "page" : undefined}
                    className={`t-tile flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left ${
                      on ? "bg-brand text-white" : "text-ink hover:bg-mint"
                    }`}
                  >
                    <Icon size={20} aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <section aria-labelledby="klaster-aktif" className="flex flex-col gap-2">
            <h2 id="klaster-aktif" className="t-chip text-ink-soft">
              {CLUSTERS.length} Klaster Aktif (72 Jam)
            </h2>
            {CLUSTERS.map((c) => {
              const Icon = LEVEL_ICON[c.level];
              const s = LEVEL_STYLE[c.level];
              const on = c.id === activeId;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActiveId(c.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 ${on ? "border-brand bg-mint" : "border-line bg-white"}`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: s.bg, color: s.fg }}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="t-tile block truncate">{c.short}</span>
                    <span className="t-label block text-ink-soft">
                      {c.reports} {DISEASE_LABEL[c.disease]} • {s.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </section>
          <button type="button" onClick={logout} className="t-tile mt-auto flex h-12 items-center gap-3 rounded-2xl px-4 text-ink-soft hover:bg-mint">
            <LogOut size={20} aria-hidden="true" />
            Keluar
          </button>
        </aside>

        {/* Centre column */}
        <main className="stagger-in flex flex-1 flex-col gap-5 px-5 pt-[max(20px,env(safe-area-inset-top))] pb-6 lg:min-w-0 lg:gap-4 lg:p-5">
          {/* mobile header */}
          <header className="flex items-start justify-between gap-3 lg:hidden">
            <div>
              <p className="t-label text-ink-soft">{officer.puskesmas}</p>
              <h1 className="t-screen">Dasbor Klaster</h1>
            </div>
            <button type="button" className="t-chip flex h-11 items-center gap-2 rounded-2xl border border-line bg-white px-3.5">
              <SlidersHorizontal size={18} className="text-brand" aria-hidden="true" />
              72 Jam
            </button>
          </header>

          {/* desktop filter bar */}
          <div className="hidden items-center justify-between gap-3 lg:flex">
            <h1 className="sr-only">Peta Klaster</h1>
            <div className="flex flex-wrap gap-2">
              {["Kec. Banjarmasin Selatan", "ISPA & Diare", "72 Jam Terakhir"].map((t) => (
                <button key={t} type="button" className="t-chip h-11 rounded-2xl border border-line bg-white px-4">
                  {t}
                </button>
              ))}
            </div>
            <span className="t-chip flex h-11 items-center gap-2 rounded-2xl bg-[#fde7e4] px-4 text-[#8f1b11]">
              <Bell size={18} aria-hidden="true" />1 Klaster Baru
            </span>
          </div>

          {/* mobile hero for newest cluster */}
          <Link href={`/petugas/klaster/${top.id}`} className="block rounded-[28px] lg:hidden" aria-label={`Buka detail ${top.name}`}>
            <AqiHero
              title="Klaster Baru: RW 04"
              subtitle={`Kelayan Slt. • ${top.reports} laporan ${DISEASE_LABEL[top.disease]}`}
              aqi={top.aqi}
              badge={{ label: "Prioritas", icon: "octagon" }}
            />
          </Link>

          <section className="overflow-hidden rounded-card border border-line bg-white lg:min-h-0 lg:flex-1">
            <MapCanvas markers={markers} onSelect={setActiveId} fill className="lg:h-full" caption="Peta klaster aktif" />
          </section>

          {/* mobile list */}
          <section aria-label="Klaster lain" className="flex flex-col gap-2.5 lg:hidden">
            {CLUSTERS.slice(1).map((c) => {
              const Icon = LEVEL_ICON[c.level];
              const s = LEVEL_STYLE[c.level];
              return (
                <Link
                  key={c.id}
                  href={`/petugas/klaster/${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-[20px] border border-line bg-white p-3.5"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ background: s.bg, color: s.fg }}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="t-tile block truncate">{c.short}</span>
                      <span className="t-label block text-ink-soft">
                        {c.reports} laporan {DISEASE_LABEL[c.disease]}
                      </span>
                    </span>
                  </span>
                  <LevelBadge level={c.level} />
                </Link>
              );
            })}
          </section>

          <button type="button" onClick={logout} className="t-chip self-center rounded-full px-4 py-2 text-ink-soft lg:hidden">
            Keluar dari akun
          </button>
        </main>

        {/* Detail panel (desktop) */}
        <aside aria-label="Detail klaster" className="fade-in hidden w-[432px] shrink-0 overflow-y-auto border-l border-line bg-white p-5 lg:block">
          <ClusterDetailBody cluster={active} key={active.id} />
        </aside>

        <div className="lg:hidden">
          <BottomTabs active="petugas" />
        </div>
      </div>
    </div>
  );
}
