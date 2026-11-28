"use client";

import { Bell, ChevronDown, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { AqiHero } from "@/components/aqi-hero";
import { MapCanvas, type MapMarker } from "@/components/map-canvas";
import { IconButton, PrimaryButton, Screen } from "@/components/screen";
import { Sheet } from "@/components/sheet";
import { KELURAHAN, PUBLIC_ZONES, TONE_DOT, getKelurahan, type DiseaseFilter } from "@/lib/data";
import { getAqiInfo } from "@/lib/aqi";

const FILTERS: { id: DiseaseFilter; label: string }[] = [
  { id: "semua", label: "ISPA & Diare" },
  { id: "ispa", label: "ISPA" },
  { id: "diare", label: "Diare" },
];

export default function PetaPublik() {
  const [kelId, setKelId] = useState("kelayan-selatan");
  const [filter, setFilter] = useState<DiseaseFilter>("semua");
  const [pick, setPick] = useState(false);
  const kel = getKelurahan(kelId);

  const markers = useMemo<MapMarker[]>(
    () =>
      PUBLIC_ZONES.filter((z) => filter === "semua" || z.disease === filter).map((z) => ({
        id: z.id,
        x: z.x,
        y: z.y,
        r: z.r,
        count: z.count,
        color: z.disease === "ispa" ? TONE_DOT.prioritas : TONE_DOT.waspada,
        label: `Zona ${z.disease === "ispa" ? "ISPA" : "diare"}`,
      })),
    [filter],
  );

  const isEmpty = kel.reports === 0;
  const total = PUBLIC_ZONES.filter(
    (z) => z.kelurahanId === kel.id && (filter === "semua" || z.disease === filter),
  ).reduce((n, z) => n + z.count, 0);
  const info = getAqiInfo(kel.aqi);
  const cycle = () => setFilter((f) => FILTERS[(FILTERS.findIndex((x) => x.id === f) + 1) % FILTERS.length].id);

  return (
    <Screen
      tab="peta"
      cta={
        <PrimaryButton href="/lapor">
          <FileText size={20} aria-hidden="true" />
          Lapor Gejala
        </PrimaryButton>
      }
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="t-body text-ink-soft">Halo, Rina</p>
          <h1 className="t-screen lg:text-[32px] lg:leading-10">Pantau Udara &amp; Gejala</h1>
        </div>
        <IconButton label="Notifikasi">
          <Bell size={22} aria-hidden="true" />
        </IconButton>
      </header>

      <div className="flex flex-1 flex-col gap-5 lg:grid lg:flex-none lg:grid-cols-[minmax(340px,400px)_1fr] lg:items-stretch lg:gap-6">
      <div className="lg:self-start">
        <AqiHero
          title={kel.name}
          subtitle={`${kel.area} • ${kel.kecamatan}`}
          aqi={kel.aqi}
          extra={
            <button
              type="button"
              onClick={() => setPick(true)}
              className="t-chip mt-4 flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1.5 text-white ring-1 ring-white/40"
            >
              Ganti wilayah
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          }
        />
        <p className="sr-only">Status udara: {info.label}</p>
        <section className="mt-6 hidden flex-col gap-3 rounded-card border border-line bg-white p-5 lg:flex">
          <h2 className="t-section">Mengalami gejala?</h2>
          <p className="t-body text-ink-soft">
            Laporkan gejala ISPA atau diare di sekitar Anda. Data warga membantu petugas Puskesmas bertindak lebih cepat.
          </p>
          <PrimaryButton href="/lapor">
            <FileText size={20} aria-hidden="true" />
            Lapor Gejala
          </PrimaryButton>
        </section>
      </div>

      {isEmpty ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-card border border-line bg-white px-6 py-8 text-center lg:min-h-[420px]">
          <div className="flex size-24 items-center justify-center rounded-full bg-mint">
            <svg viewBox="0 0 64 64" className="size-14" fill="none" stroke="#02824b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="14" y="10" width="36" height="46" rx="8" />
              <path d="M24 24h16M24 34h16M24 44h8" />
              <circle cx="48" cy="48" r="10" fill="#e7f5ec" />
              <path d="M44 48l3 3 5-6" />
            </svg>
          </div>
          <h2 className="t-screen">Belum Ada Laporan Warga</h2>
          <p className="t-body text-ink-soft">Tidak ada laporan gejala ISPA atau diare dalam 72 jam terakhir di area ini.</p>
          <p className="t-chip rounded-full bg-mint px-4 py-2 text-brand-deep">Pantauan aktif • Diperbarui 5 menit lalu</p>
        </section>
      ) : (
        <section className="flex flex-col overflow-hidden rounded-card border border-line bg-white">
          <div className="lg:relative lg:min-h-[440px] lg:flex-1 lg:overflow-hidden">
            <MapCanvas
              markers={markers}
              className="lg:absolute lg:inset-0 lg:h-full lg:overflow-visible"
              caption={`Peta sebaran laporan di ${kel.landmark}`}
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
            <p className="t-body min-w-0 flex-1">
              {kel.landmark} • {total} laporan
            </p>
            <button
              type="button"
              onClick={cycle}
              aria-label={`Filter penyakit: ${FILTERS.find((f) => f.id === filter)?.label}. Ketuk untuk ganti.`}
              className="t-chip shrink-0 rounded-full bg-mint px-3 py-1.5 text-brand-deep"
            >
              {FILTERS.find((f) => f.id === filter)?.label}
            </button>
          </div>
          <p className="t-label border-t border-line bg-surface px-4 py-2 text-ink-soft">
            Lokasi laporan disamarkan 100 sampai 200 meter demi privasi warga.
          </p>
        </section>
      )}
      </div>

      <Sheet open={pick} onClose={() => setPick(false)} title="Pilih wilayah">
        <ul className="flex flex-col gap-2">
          {KELURAHAN.map((k) => (
            <li key={k.id}>
              <button
                type="button"
                onClick={() => {
                  setKelId(k.id);
                  setPick(false);
                }}
                aria-current={k.id === kelId}
                className={`t-tile flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left ${
                  k.id === kelId ? "border-brand bg-mint" : "border-line bg-white"
                }`}
              >
                <span>
                  {k.name}
                  <span className="t-label block text-ink-soft">
                    {k.area} • {k.kecamatan}
                  </span>
                </span>
                <span className="t-chip rounded-full bg-white px-3 py-1 text-ink ring-1 ring-line">AQI {k.aqi}</span>
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </Screen>
  );
}
