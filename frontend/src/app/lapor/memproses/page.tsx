"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconButton, Screen, ScreenHeader } from "@/components/screen";
import { useReportFlow } from "@/lib/report-flow";
import { classifyStory } from "@/lib/symptoms";

function getPosition(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return resolve();
    navigator.geolocation.getCurrentPosition(() => resolve(), () => reject(new Error("gps")), { timeout: 5000 });
  });
}

export default function Memproses() {
  const router = useRouter();
  const { draft, update } = useReportFlow();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!navigator.onLine) throw new Error("offline");
        if (draft.locationMode === "gps") await getPosition();
        // stand-in for POST /api/ai/classify
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) return;
        const ai = classifyStory(draft.story);
        const confirmed = Array.from(new Set([...ai, ...draft.manual]));
        update({ ai, confirmed });
        router.replace("/lapor/konfirmasi");
      } catch {
        if (!cancelled) router.replace("/lapor/kendala");
      }
    })();
    return () => {
      cancelled = true;
    };
    // run once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen tab="lapor" size="narrow">
      <ScreenHeader
        title="Memproses Data"
        backHref="/lapor"
        right={
          <IconButton label="Muat ulang" onClick={() => router.refresh()}>
            <RefreshCw size={20} aria-hidden="true" />
          </IconButton>
        }
      />
      <section className="rounded-card border border-line bg-white p-5" role="status" aria-busy="true">
        <h2 className="t-section">Memetakan cerita gejala...</h2>
        <p className="t-body text-ink-soft">Mohon tunggu sebentar</p>
        <div className="mt-4 flex flex-col gap-3" aria-hidden="true">
          <div className="shimmer h-4 w-full rounded-full" />
          <div className="shimmer h-4 w-4/5 rounded-full" />
          <div className="shimmer h-4 w-3/5 rounded-full" />
        </div>
      </section>
      <section className="rounded-card border border-line bg-white p-5">
        <h2 className="t-section">Memuat peta &amp; kualitas udara...</h2>
        <div className="shimmer mt-4 h-44 rounded-[20px]" aria-hidden="true" />
      </section>
    </Screen>
  );
}
