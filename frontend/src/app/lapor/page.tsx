"use client";

import { Check, Mic, MapPin, Minus, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { IconButton, PrimaryButton, Screen, ScreenHeader } from "@/components/screen";
import { Sheet } from "@/components/sheet";
import { SymptomIcon } from "@/components/symptom-icon";
import { KELURAHAN, getKelurahan, type Disease } from "@/lib/data";
import { useReportFlow } from "@/lib/report-flow";
import { AGE_GROUPS, SYMPTOMS, type SymptomId } from "@/lib/symptoms";

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognition(): SpeechRec | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export default function FormLapor() {
  const router = useRouter();
  const { draft, update } = useReportFlow();
  const [sheet, setSheet] = useState<"usia" | "lokasi" | null>(null);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const canDictate = useSyncExternalStore(
    () => () => {},
    () => getRecognition() !== null,
    () => false,
  );
  const rec = useRef<SpeechRec | null>(null);
  const kel = getKelurahan(draft.kelurahanId);
  const age = AGE_GROUPS.find((a) => a.id === draft.ageGroup)?.label ?? "Balita";

  useEffect(() => () => rec.current?.stop(), []);

  function toggleSymptom(id: SymptomId) {
    const has = draft.manual.includes(id);
    update({ manual: has ? draft.manual.filter((s) => s !== id) : [...draft.manual, id] });
    setError("");
  }

  function toggleDictation() {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const r = getRecognition();
    if (!r) return;
    rec.current = r;
    r.lang = "id-ID";
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (e) => {
      const text = Array.from(e.results)
        .map((x) => x[0].transcript)
        .join(" ");
      update({ story: `${draft.story} ${text}`.trim() });
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    setListening(true);
  }

  function submit() {
    if (draft.manual.length === 0 && draft.story.trim().length < 5) {
      setError("Pilih minimal satu gejala atau ceritakan keluhan Anda.");
      return;
    }
    router.push("/lapor/memproses");
  }

  return (
    <Screen size="form" className="lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-8 lg:gap-y-6">
      <ScreenHeader
        className="lg:col-span-2"
        title="Lapor Gejala"
        backHref="/peta"
        right={
          canDictate ? (
            <IconButton label={listening ? "Hentikan rekaman suara" : "Ceritakan dengan suara"} pressed={listening} onClick={toggleDictation}>
              <Mic size={22} aria-hidden="true" />
            </IconButton>
          ) : undefined
        }
      />

      <section aria-label="Jenis keluhan" className="flex flex-col gap-3 lg:col-start-1">
        <div role="radiogroup" aria-label="Jenis penyakit" className="grid grid-cols-2 gap-3">
          {(["ispa", "diare"] as Disease[]).map((d) => {
            const on = draft.disease === d;
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => update({ disease: d })}
                className={`t-tile flex h-16 items-center justify-center gap-2.5 rounded-[20px] border-2 transition-colors ${
                  on ? "border-brand bg-mint text-brand-deep" : "border-line bg-white text-ink"
                }`}
              >
                <SymptomIcon id={d === "ispa" ? "sesak" : "bab_cair"} size={24} />
                {d === "ispa" ? "ISPA" : "Diare"}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSheet("usia")}
            className="t-tile flex h-14 items-center gap-2 rounded-2xl border border-line bg-white px-3.5 text-left"
          >
            <Users size={20} className="shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate">
              {age} • {draft.count} org
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSheet("lokasi")}
            className="t-tile flex h-14 items-center gap-2 rounded-2xl border border-line bg-white px-3.5 text-left"
          >
            <MapPin size={20} className="shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate">{kel.short}</span>
          </button>
        </div>
      </section>

      <section aria-label="Gejala" className="flex flex-col gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-2">
        <h2 className="t-section">Gejala yang dialami</h2>
        <div className="grid grid-cols-3 gap-3">
          {SYMPTOMS.map((s) => {
            const on = draft.manual.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSymptom(s.id)}
                className={`t-tile relative flex h-[104px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 transition-colors ${
                  on ? "border-brand bg-mint text-brand-deep" : "border-line bg-white text-ink"
                }`}
              >
                {on && (
                  <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand text-white">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <SymptomIcon id={s.id} size={30} className={on ? "text-brand" : "text-ink-soft"} />
                {s.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2 lg:col-start-1">
        <label htmlFor="cerita" className="t-section">
          Ceritakan keluhan
        </label>
        <div className="relative">
          <textarea
            id="cerita"
            rows={4}
            value={draft.story}
            onChange={(e) => {
              update({ story: e.target.value });
              setError("");
            }}
            placeholder="Contoh: Anak batuk sudah 3 hari, napas agak bunyi dan badan hangat sejak kemarin sore..."
            className="t-body w-full resize-none rounded-[20px] border border-line bg-white p-4 pr-14 text-ink placeholder:text-ink-soft/70"
          />
          {canDictate && (
            <button
              type="button"
              onClick={toggleDictation}
              aria-label={listening ? "Hentikan rekaman suara" : "Ceritakan dengan suara"}
              className={`absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full ${
                listening ? "bg-brand text-white" : "bg-mint text-brand-deep"
              }`}
            >
              <Mic size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="t-chip text-danger">
            {error}
          </p>
        )}
      </section>

      <PrimaryButton onClick={submit} className="mt-auto lg:col-span-2 lg:mx-auto lg:max-w-sm">
        Kirim Laporan
      </PrimaryButton>

      <Sheet open={sheet === "usia"} onClose={() => setSheet(null)} title="Siapa yang sakit?">
        <div role="radiogroup" aria-label="Kelompok usia" className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={draft.ageGroup === a.id}
              onClick={() => update({ ageGroup: a.id })}
              className={`t-tile rounded-full border-2 px-5 py-2.5 ${
                draft.ageGroup === a.id ? "border-brand bg-mint text-brand-deep" : "border-line bg-white"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-surface p-3">
          <span className="t-tile">Jumlah orang</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Kurangi"
              disabled={draft.count <= 1}
              onClick={() => update({ count: draft.count - 1 })}
              className="flex size-11 items-center justify-center rounded-xl border border-line bg-white disabled:opacity-40"
            >
              <Minus size={18} aria-hidden="true" />
            </button>
            <output className="t-section w-8 text-center" aria-live="polite">
              {draft.count}
            </output>
            <button
              type="button"
              aria-label="Tambah"
              disabled={draft.count >= 20}
              onClick={() => update({ count: draft.count + 1 })}
              className="flex size-11 items-center justify-center rounded-xl border border-line bg-white disabled:opacity-40"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <PrimaryButton onClick={() => setSheet(null)}>Simpan</PrimaryButton>
      </Sheet>

      <Sheet open={sheet === "lokasi"} onClose={() => setSheet(null)} title="Lokasi laporan">
        <button
          type="button"
          onClick={() => {
            update({ locationMode: "gps" });
            setSheet(null);
          }}
          aria-pressed={draft.locationMode === "gps"}
          className={`t-tile flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left ${
            draft.locationMode === "gps" ? "border-brand bg-mint" : "border-line bg-white"
          }`}
        >
          <MapPin size={20} className="text-brand" aria-hidden="true" />
          Gunakan lokasi saya (GPS)
        </button>
        <p className="t-label text-ink-soft">Atau pilih kelurahan secara manual:</p>
        <ul className="flex flex-col gap-2">
          {KELURAHAN.map((k) => (
            <li key={k.id}>
              <button
                type="button"
                onClick={() => {
                  update({ kelurahanId: k.id, locationMode: "manual" });
                  setSheet(null);
                }}
                aria-current={draft.locationMode === "manual" && draft.kelurahanId === k.id}
                className={`t-tile w-full rounded-2xl border-2 px-4 py-3.5 text-left ${
                  draft.locationMode === "manual" && draft.kelurahanId === k.id ? "border-brand bg-mint" : "border-line bg-white"
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
