import { AlertOctagon, AlertTriangle, ShieldCheck } from "lucide-react";
import { AQI_SEGMENTS, aqiMarkerPct, getAqiInfo, type StatusIcon } from "@/lib/aqi";
import type { ReactNode } from "react";

const ICONS: Record<StatusIcon, typeof ShieldCheck> = {
  shield: ShieldCheck,
  triangle: AlertTriangle,
  octagon: AlertOctagon,
};

export function AqiScale({ aqi }: { aqi: number }) {
  const pct = aqiMarkerPct(aqi);
  return (
    <div className="relative mt-4" role="img" aria-label={`Skala AQI, posisi ${aqi}`}>
      <div className="flex h-3 gap-1 overflow-hidden rounded-full">
        {AQI_SEGMENTS.map((c) => (
          <div key={c} className="flex-1 first:rounded-l-full last:rounded-r-full" style={{ background: c }} />
        ))}
      </div>
      <span
        className="aqi-marker absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-ink shadow"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

export function AqiHero({
  title,
  subtitle,
  aqi,
  badge,
  extra,
  className = "",
}: {
  title: string;
  subtitle: string;
  aqi: number;
  badge?: { label: string; icon: StatusIcon };
  extra?: ReactNode;
  className?: string;
}) {
  const info = getAqiInfo(aqi);
  const b = badge ?? { label: info.badge, icon: info.icon };
  const Icon = ICONS[b.icon];
  return (
    <section
      className={`rounded-[28px] p-5 text-white ${className}`}
      style={{ background: `linear-gradient(160deg, ${info.bg} 0%, ${info.bg} 55%, color-mix(in srgb, ${info.bg} 80%, black) 100%)` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="t-section">{title}</h2>
          <p className="t-label mt-0.5 text-white/90">{subtitle}</p>
        </div>
        <span className="t-chip flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-ink">
          <Icon size={16} style={{ color: info.bg }} aria-hidden="true" />
          {b.label}
        </span>
      </div>
      <div className="mt-5 flex items-end gap-4">
        <p className="t-big" aria-label={`AQI ${aqi}`}>
          {aqi}
        </p>
        <div className="pb-1">
          <p className="t-tile">{info.label}</p>
          <p className="t-label text-white/90">Indeks Kualitas Udara (AQI)</p>
        </div>
      </div>
      <AqiScale aqi={aqi} />
      {extra}
    </section>
  );
}
