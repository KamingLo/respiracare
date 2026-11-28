"use client";

import { Check, Download, Sparkles } from "lucide-react";
import { AqiHero } from "./aqi-hero";
import { PrimaryButton } from "./screen";
import { TrendChart } from "./trend-chart";
import { useClusterStage } from "@/lib/cluster-stage";
import { CLUSTER_STAGES, DISEASE_LABEL, LEVEL_STYLE, type Cluster } from "@/lib/data";
import type { StatusIcon } from "@/lib/aqi";

const LEVEL_ICON: Record<Cluster["level"], StatusIcon> = {
  prioritas: "octagon",
  siaga: "triangle",
  waspada: "triangle",
};

function exportCsv(c: Cluster) {
  const today = new Date();
  const rows = c.cases7d.map((cases, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (c.cases7d.length - 1 - i));
    return [d.toISOString().slice(0, 10), cases, c.aqi7d[i]].join(",");
  });
  const csv = ["tanggal,kasus,aqi", ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `klaster-${c.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function StageStepper({ clusterId }: { clusterId: string }) {
  const [stage, setStage] = useClusterStage(clusterId);
  return (
    <div role="radiogroup" aria-label="Tahap penanganan" className="grid grid-cols-4 gap-2 rounded-[20px] bg-mint p-1.5">
      {CLUSTER_STAGES.map((label, i) => {
        const on = i === stage;
        const done = i < stage;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setStage(i)}
            className={`t-chip flex h-11 items-center justify-center gap-1 rounded-2xl transition-colors ${
              on ? "bg-brand text-white" : done ? "bg-mint-strong text-brand-deep" : "text-ink-soft hover:bg-white/70"
            }`}
          >
            {done && <Check size={14} aria-hidden="true" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function ClusterDetailBody({
  cluster,
  className = "",
  wide = false,
}: {
  cluster: Cluster;
  className?: string;
  /** two-column arrangement on desktop (full page). The dashboard side panel keeps one column. */
  wide?: boolean;
}) {
  const level = LEVEL_STYLE[cluster.level];
  return (
    <div
      className={`stagger-in flex flex-col gap-5 ${
        wide ? "lg:grid lg:grid-cols-2 lg:items-start lg:gap-6" : ""
      } ${className}`}
    >
      <AqiHero
        title={cluster.name}
        subtitle={`${cluster.reports} Laporan ${DISEASE_LABEL[cluster.disease]} • ${cluster.vulnerablePct}% Rentan`}
        aqi={cluster.aqi}
        badge={{ label: level.label, icon: LEVEL_ICON[cluster.level] }}
      />

      <StageStepper clusterId={cluster.id} />

      <section className={`rounded-card border border-line bg-white p-5 ${wide ? "lg:col-start-2 lg:row-span-2 lg:row-start-1" : ""}`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="t-section">Tren 7 Hari &amp; Ringkasan</h2>
          <span className="t-chip flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-brand-deep">
            <Sparkles size={14} aria-hidden="true" />
            Dibuat AI
          </span>
        </div>
        <TrendChart cases={cluster.cases7d} aqi={cluster.aqi7d} className="mt-4" />
        <p className="t-body mt-3 text-ink-soft">{cluster.summary}</p>
      </section>

      <div className={`grid grid-cols-2 gap-3 print:hidden ${wide ? "lg:col-span-2" : ""}`}>
        <PrimaryButton variant="outline" onClick={() => exportCsv(cluster)}>
          Ekspor CSV
        </PrimaryButton>
        <PrimaryButton onClick={() => window.print()}>
          <Download size={20} aria-hidden="true" />
          Ekspor PDF
        </PrimaryButton>
      </div>
    </div>
  );
}
