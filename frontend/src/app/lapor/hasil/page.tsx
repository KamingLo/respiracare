"use client";

import { MapPin } from "lucide-react";
import { AqiHero } from "@/components/aqi-hero";
import { PrimaryButton, Screen } from "@/components/screen";
import { SymptomIcon } from "@/components/symptom-icon";
import { PUSKESMAS, getKelurahan } from "@/lib/data";
import { useReportFlow } from "@/lib/report-flow";
import { getAqiInfo } from "@/lib/aqi";
import type { SymptomId } from "@/lib/symptoms";

function advice(disease: "ispa" | "diare", tone: string): { icon: SymptomId; text: string; strong?: boolean }[] {
  if (disease === "diare") {
    return [
      { icon: "bab_cair", text: "Beri oralit atau air matang sedikit demi sedikit" },
      { icon: "pilek", text: "Cuci tangan pakai sabun sebelum makan" },
      { icon: "muntah", text: "Segera ke Puskesmas bila lemas atau BAB berdarah", strong: true },
    ];
  }
  return [
    { icon: "batuk", text: tone === "baik" ? "Tetap jaga kebersihan dan ventilasi rumah" : "Pakai masker saat beraktivitas di luar" },
    { icon: "demam", text: "Beri anak air hangat & istirahat cukup" },
    { icon: "sesak", text: "Segera ke Puskesmas bila napas cepat", strong: true },
  ];
}

export default function Hasil() {
  const { draft } = useReportFlow();
  const kel = getKelurahan(draft.kelurahanId);
  const info = getAqiInfo(kel.aqi);
  const pkm = PUSKESMAS[0];
  const items = advice(draft.disease, info.tone);

  return (
    <Screen size="form">
      <div className="flex flex-1 flex-col gap-5 lg:grid lg:flex-none lg:grid-cols-2 lg:items-start lg:gap-8">
      <AqiHero title="Laporan Terkirim" subtitle={`${kel.area} • Bukan alat diagnosis`} aqi={kel.aqi} />

      <div className="flex flex-1 flex-col gap-5">
      <section className="flex flex-col gap-3">
        <h2 className="t-section">3 Saran Hari Ini</h2>
        <ul className="flex flex-col gap-2.5">
          {items.map((it) => (
            <li key={it.text} className="flex items-center gap-3 rounded-[20px] border border-line bg-white p-3">
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                  it.strong ? "bg-[#fde7e4] text-danger" : "bg-mint text-brand"
                }`}
              >
                <SymptomIcon id={it.icon} size={22} />
              </span>
              <p className={it.strong ? "t-tile" : "t-body"}>{it.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center gap-4 rounded-card border border-line bg-white p-3">
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px] bg-mint">
          <svg viewBox="0 0 48 48" className="size-11" fill="none" aria-hidden="true">
            <rect x="8" y="16" width="32" height="24" rx="3" fill="#fff" stroke="#02824b" strokeWidth="2.5" />
            <path d="M6 18 24 7l18 11" stroke="#02824b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M24 22v10M19 27h10" stroke="#02824b" strokeWidth="3" strokeLinecap="round" />
            <rect x="20" y="33" width="8" height="7" rx="1" fill="#cfeedc" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="t-section">{pkm.name}</h2>
          <p className="t-body text-ink-soft">
            {pkm.distance} • {pkm.hours}
          </p>
        </div>
      </section>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkm.mapsQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="t-cta mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-brand text-white hover:bg-brand-deep"
      >
        <MapPin size={20} aria-hidden="true" />
        Cari Puskesmas Terdekat
      </a>
      <PrimaryButton href="/peta" variant="outline">
        Kembali ke Peta
      </PrimaryButton>
      </div>
      </div>
    </Screen>
  );
}
