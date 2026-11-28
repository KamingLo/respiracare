import { MapPin } from "lucide-react";
import { Screen } from "@/components/screen";
import { PUSKESMAS } from "@/lib/data";

export const metadata = { title: "Puskesmas terdekat" };

export default function Klinik() {
  return (
    <Screen tab="klinik">
      <header>
        <p className="t-body text-ink-soft">Dekat Kelayan Selatan</p>
        <h1 className="t-screen lg:text-[32px] lg:leading-10">Puskesmas Terdekat</h1>
      </header>
      <ul className="stagger-items flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {PUSKESMAS.map((p) => (
          <li key={p.id} className="flex items-center gap-4 rounded-card border border-line bg-white p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-18px_rgba(2,104,54,0.45)] lg:p-5">
            <div className="min-w-0 flex-1">
              <h2 className="t-section">{p.name}</h2>
              <p className="t-body text-ink-soft">
                {p.distance} • {p.hours}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka ${p.name} di peta`}
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white"
            >
              <MapPin size={22} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
