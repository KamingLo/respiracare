const DAYS = ["H-6", "H-5", "H-4", "H-3", "H-2", "H-1", "Kini"];

export function TrendChart({ cases, aqi, className = "" }: { cases: number[]; aqi: number[]; className?: string }) {
  const W = 320;
  const H = 150;
  const padL = 8;
  const padR = 8;
  const top = 12;
  const bottom = 26;
  const plotH = H - top - bottom;
  const step = (W - padL - padR) / cases.length;
  const maxCase = Math.max(...cases, 1);
  const minAqi = Math.min(...aqi) - 10;
  const maxAqi = Math.max(...aqi) + 6;
  const bx = (i: number) => padL + step * i + step / 2;
  const ay = (v: number) => top + plotH - ((v - minAqi) / (maxAqi - minAqi)) * plotH;
  const line = aqi.map((v, i) => `${i === 0 ? "M" : "L"}${bx(i).toFixed(1)} ${ay(v).toFixed(1)}`).join(" ");
  const summary = `Kasus per hari ${cases.join(", ")}. AQI per hari ${aqi.join(", ")}.`;

  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Tren 7 hari. ${summary}`}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={padL} x2={W - padR} y1={top + plotH * f} y2={top + plotH * f} stroke="#e1eee6" strokeWidth="1" />
        ))}
        {cases.map((v, i) => {
          const h = Math.max(4, (v / maxCase) * plotH);
          const last = i === cases.length - 1;
          return (
            <g key={i}>
              <rect
                className="chart-bar"
                style={{ animationDelay: `${i * 70}ms` }}
                x={bx(i) - step * 0.28}
                y={top + plotH - h}
                width={step * 0.56}
                height={h}
                rx="6"
                fill={last ? "#02824b" : "#bfe6cf"}
              />
              {last && (
                <text x={bx(i)} y={top + plotH - h - 5} textAnchor="middle" fontSize="11" fontWeight="800" fill="#026836">
                  {v}
                </text>
              )}
              <text x={bx(i)} y={H - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="#355244">
                {DAYS[i]}
              </text>
            </g>
          );
        })}
        <path d={line} pathLength={1} className="chart-line" fill="none" stroke="#e8710a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {aqi.map((v, i) => (
          <circle key={i} className="map-marker" style={{ animationDelay: `${500 + i * 90}ms` }} cx={bx(i)} cy={ay(v)} r={i === aqi.length - 1 ? 4.5 : 3} fill="#fff" stroke="#e8710a" strokeWidth="2" />
        ))}
      </svg>
      <figcaption className="t-label mt-1 flex items-center gap-4 text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-brand" aria-hidden="true" />
          Kasus
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded bg-[#e8710a]" aria-hidden="true" />
          AQI
        </span>
      </figcaption>
    </figure>
  );
}
