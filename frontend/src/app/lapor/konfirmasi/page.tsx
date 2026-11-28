"use client";

import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrimaryButton, Screen, ScreenHeader } from "@/components/screen";
import { SymptomIcon } from "@/components/symptom-icon";
import { DISEASE_LABEL, getKelurahan } from "@/lib/data";
import { useReportFlow } from "@/lib/report-flow";
import { AGE_GROUPS, SYMPTOMS, type SymptomId } from "@/lib/symptoms";

export default function Konfirmasi() {
  const router = useRouter();
  const { draft, update } = useReportFlow();
  const kel = getKelurahan(draft.kelurahanId);
  const age = AGE_GROUPS.find((a) => a.id === draft.ageGroup)?.label ?? "";
  const hasInput = draft.manual.length > 0 || draft.story.trim().length > 0;

  useEffect(() => {
    if (!hasInput) router.replace("/lapor");
  }, [hasInput, router]);

  function toggle(id: SymptomId) {
    update({
      confirmed: draft.confirmed.includes(id) ? draft.confirmed.filter((s) => s !== id) : [...draft.confirmed, id],
    });
  }

  function statusOf(id: SymptomId, on: boolean) {
    if (!on) return "Ketuk pilih";
    return draft.ai.includes(id) ? "Terdeteksi AI" : "Dipilih";
  }

  const story = draft.story.trim() || "Anda tidak menulis cerita. Gejala dipilih manual dari ikon.";

  return (
    <Screen size="form">
      <ScreenHeader
        title="Konfirmasi Gejala"
        backHref="/lapor"
        right={
          <span className="flex size-12 items-center justify-center rounded-2xl bg-mint text-brand" title="Dibantu AI">
            <Sparkles size={22} aria-hidden="true" />
          </span>
        }
      />

      <section className="rounded-card border border-line bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
            <Sparkles size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="t-section">Ringkasan Keluhan</h2>
            <p className="t-label text-ink-soft">
              {DISEASE_LABEL[draft.disease]} • {age} ({draft.count} orang) • {kel.short}
            </p>
          </div>
        </div>
        <blockquote className="t-body mt-4 rounded-2xl bg-mint p-4 text-ink">“{story}”</blockquote>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="t-section">Gejala terdeteksi</h2>
          <p className="t-chip text-ink-soft">Ketuk untuk ubah</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {SYMPTOMS.map((s) => {
            const on = draft.confirmed.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s.id)}
                className={`flex items-center gap-3 rounded-[20px] border-2 p-3 text-left transition-colors ${
                  on ? "border-brand bg-mint" : "border-line bg-white"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                    on ? "bg-brand text-white" : "bg-surface text-ink-soft"
                  }`}
                >
                  <SymptomIcon id={s.id} size={22} />
                </span>
                <span className="min-w-0">
                  <span className="t-tile block">{s.longLabel}</span>
                  <span className={`t-label block ${on ? "text-[#026836]" : "text-ink-mute"}`}>{statusOf(s.id, on)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <PrimaryButton
        className="mt-auto lg:mx-auto lg:max-w-sm"
        disabled={draft.confirmed.length === 0}
        onClick={() => router.push("/lapor/hasil")}
      >
        <Check size={20} aria-hidden="true" />
        Konfirmasi
      </PrimaryButton>
    </Screen>
  );
}
