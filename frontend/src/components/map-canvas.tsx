"use client";

import { useId } from "react";

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  r: number;
  count: number;
  color: string;
  label: string;
  active?: boolean;
}

/**
 * Stylised neighbourhood map (the Figma uses an illustrated map as well).
 * Replace the SVG base with a real tile layer once GIS data is wired in;
 * the marker contract stays the same.
 */
export function MapCanvas({
  markers,
  onSelect,
  className = "",
  caption,
  fill = false,
}: {
  markers: MapMarker[];
  onSelect?: (id: string) => void;
  className?: string;
  caption?: string;
  /** cover the whole box instead of keeping 360x230 */
  fill?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 360 230"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={caption ?? "Peta sebaran laporan"}
      className={`block w-full ${fill ? "h-full overflow-visible" : "h-auto"} ${className}`}
    >
      <defs>
        {markers.map((m) => (
          <radialGradient key={m.id} id={`${uid}-${m.id}`}>
            <stop offset="0%" stopColor={m.color} stopOpacity="0.75" />
            <stop offset="60%" stopColor={m.color} stopOpacity="0.38" />
            <stop offset="100%" stopColor={m.color} stopOpacity="0" />
          </radialGradient>
        ))}
        <path id={`${uid}-river`} d="M-500 190 C -380 150, -200 190, -90 140 S -30 130, -10 150 C 60 120, 110 190, 180 160 S 300 90, 380 120 S 520 170, 800 110" />
      </defs>

      <rect x="-700" y="-500" width="1760" height="1230" fill="#e4f1e8" />
      {/* city blocks */}
      {[
        [14, 14, 70, 44],
        [96, 22, 58, 36],
        [170, 12, 80, 40],
        [268, 18, 78, 52],
        [20, 176, 64, 40],
        [112, 190, 70, 30],
        [214, 186, 60, 36],
        [290, 170, 56, 46],
        [-90, 14, 80, 44],
        [-190, 22, 70, 40],
        [-110, 176, 70, 40],
        [-200, 190, 66, 32],
        [376, 14, 70, 44],
        [460, 22, 80, 40],
        [372, 186, 70, 34],
        [460, 176, 66, 44],
        [20, -70, 64, 46],
        [170, -66, 70, 44],
        [290, -64, 70, 40],
        [110, 256, 70, 44],
        [250, 262, 70, 40],
        [10, 258, 66, 40],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill="#d3e9db" />
      ))}
      {/* roads */}
      <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M-700 70 H1060" />
        <path d="M92 -400 V630" />
        <path d="M-700 214 H1060" />
        <path d="M250 -400 C 246 60, 262 120, 252 630" />
        <path d="M-96 -400 V630" />
        <path d="M440 -400 V630" />
        <path d="M-700 -8 H1060" />
        <path d="M-700 244 H1060" />
      </g>
      {/* river */}
      <use href={`#${uid}-river`} stroke="#bfe4ec" strokeWidth="30" fill="none" strokeLinecap="round" />
      <use href={`#${uid}-river`} stroke="#d9f1f5" strokeWidth="18" fill="none" strokeLinecap="round" />
      <text fontSize="9" fontWeight="700" fill="#3f8a99" letterSpacing="0.6">
        <textPath href={`#${uid}-river`} startOffset="52%">
          Sungai
        </textPath>
      </text>

      {markers.map((m, i) => (
        <g
          key={m.id}
          style={{ animationDelay: `${250 + i * 90}ms` }}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          aria-label={`${m.label}, ${m.count} laporan`}
          aria-pressed={onSelect ? !!m.active : undefined}
          onClick={onSelect ? () => onSelect(m.id) : undefined}
          onKeyDown={
            onSelect
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(m.id);
                  }
                }
              : undefined
          }
          className={`map-marker ${onSelect ? "cursor-pointer outline-none focus-visible:[&>circle:first-child]:stroke-brand" : ""}`}
        >
          <circle cx={m.x} cy={m.y} r={m.r + 14} fill={`url(#${uid}-${m.id})`} />
          <circle
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill="none"
            stroke={m.color}
            strokeWidth={m.active ? 2.5 : 1.5}
            strokeDasharray="4 4"
            opacity="0.9"
          />
          <circle cx={m.x} cy={m.y} r="13" fill={m.color} stroke="#fff" strokeWidth="3" />
          <text x={m.x} y={m.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
            {m.count}
          </text>
        </g>
      ))}
    </svg>
  );
}
