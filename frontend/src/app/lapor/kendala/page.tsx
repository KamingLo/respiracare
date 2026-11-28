"use client";

import { AlertTriangle, ChevronRight, RefreshCw, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimaryButton, Screen, ScreenHeader } from "@/components/screen";
import { Sheet } from "@/components/sheet";
import { KELURAHAN, getKelurahan } from "@/lib/data";
import { useReportFlow } from "@/lib/report-flow";

export default function Kendala() {
  const router = useRouter();
  const { draft, update } = useReportFlow();
  const [pick, setPick] = useState(false);
  const kel = getKelurahan(draft.kelurahanId);

  return (
    <Screen size="narrow">
      <ScreenHeader
        title="Kendala Koneksi"
        backHref="/lapor"
        right={
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fff0e0] text-[#c2570c]">
            <AlertTriangle size={22} aria-hidden="true" />
          </span>
        }
      />

      <section className="flex flex-col items-center gap-3 rounded-card border border-line bg-white px-6 py-8 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-[#fff0e0] text-[#c2570c]">
          <WifiOff size={44} aria-hidden="true" />
        </div>
        <h2 className="t-screen">Lokasi atau Jaringan Terputus</h2>
        <p className="t-body text-ink-soft">Izin GPS belum aktif atau sinyal lemah. Draf laporan Anda tetap aman.</p>
      </section>

      <section className="flex flex-col gap-3 rounded-card border border-line bg-white p-4">
        <h2 className="t-chip text-ink-soft">Opsi Lanjut Tanpa Sinyal / GPS</h2>
        <button
          type="button"
          onClick={() => setPick(true)}
          className="t-tile flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-4 text-left"
        >
          Pilih Kelurahan: {kel.short}
          <ChevronRight size={20} className="text-brand" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => router.push("/lapor")}
          className="t-tile flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-4 text-left"
        >
          Pilih 6 Ikon Gejala Manual
          <ChevronRight size={20} className="text-brand" aria-hidden="true" />
        </button>
      </section>

      <PrimaryButton
        className="mt-auto"
        onClick={() => {
          update({ locationMode: "manual" });
          router.replace("/lapor/memproses");
        }}
      >
        <RefreshCw size={20} aria-hidden="true" />
        Kirim Ulang Laporan
      </PrimaryButton>

      <Sheet open={pick} onClose={() => setPick(false)} title="Pilih kelurahan">
        <ul className="flex flex-col gap-2">
          {KELURAHAN.map((k) => (
            <li key={k.id}>
              <button
                type="button"
                onClick={() => {
                  update({ kelurahanId: k.id, locationMode: "manual" });
                  setPick(false);
                }}
                className={`t-tile w-full rounded-2xl border-2 px-4 py-3.5 text-left ${
                  k.id === draft.kelurahanId ? "border-brand bg-mint" : "border-line bg-white"
                }`}
              >
                {k.name}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </Screen>
  );
}
