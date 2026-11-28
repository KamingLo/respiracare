export type AqiTone = "baik" | "sedang" | "waspada" | "prioritas" | "berbahaya";
export type StatusIcon = "shield" | "triangle" | "octagon";

export interface AqiInfo {
  tone: AqiTone;
  /** index 0..4 on the five-colour scale */
  level: number;
  label: string;
  badge: string;
  icon: StatusIcon;
  /** deep background so white text keeps AA contrast */
  bg: string;
}

const TIERS: { max: number; min: number; info: Omit<AqiInfo, "level"> }[] = [
  { min: 0, max: 50, info: { tone: "baik", label: "Udara Baik", badge: "Aman", icon: "shield", bg: "#0e7c4a" } },
  { min: 51, max: 100, info: { tone: "sedang", label: "Udara Sedang", badge: "Normal", icon: "shield", bg: "#7a6a08" } },
  { min: 101, max: 125, info: { tone: "waspada", label: "Udara Tidak Sehat", badge: "Waspada", icon: "triangle", bg: "#c2570c" } },
  { min: 126, max: 200, info: { tone: "prioritas", label: "Udara Sangat Buruk", badge: "Prioritas", icon: "octagon", bg: "#b42318" } },
  { min: 201, max: 300, info: { tone: "berbahaya", label: "Udara Berbahaya", badge: "Prioritas", icon: "octagon", bg: "#7a1f5c" } },
];

export const AQI_SEGMENTS = ["#34c77b", "#f2d14b", "#f59e3b", "#ef5b4b", "#a23b8c"];

export function getAqiInfo(aqi: number): AqiInfo {
  const found = TIERS.findIndex((t) => aqi <= t.max);
  const i = found === -1 ? TIERS.length - 1 : found;
  return { ...TIERS[i].info, level: i };
}

/** Position of the marker on the 5-segment bar, 0..100 */
export function aqiMarkerPct(aqi: number): number {
  const info = getAqiInfo(aqi);
  const t = TIERS[info.level];
  const span = t.max - t.min + 1;
  const frac = Math.min(1, Math.max(0, (aqi - t.min) / span));
  return Math.min(98, (info.level + frac) * 20);
}
