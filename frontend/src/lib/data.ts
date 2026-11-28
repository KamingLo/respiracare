import type { AqiTone } from "./aqi";

export type Disease = "ispa" | "diare";
export type DiseaseFilter = Disease | "semua";

export interface Kelurahan {
  id: string;
  name: string;
  short: string;
  area: string;
  kecamatan: string;
  aqi: number;
  reports: number;
  landmark: string;
}

export const KELURAHAN: Kelurahan[] = [
  {
    id: "kelayan-selatan",
    name: "Kel. Kelayan Selatan",
    short: "Kelayan Slt.",
    area: "RW 04",
    kecamatan: "Banjarmasin Selatan",
    aqi: 118,
    reports: 7,
    landmark: "Sungai Kelayan",
  },
  {
    id: "pekauman",
    name: "Kel. Pekauman",
    short: "Pekauman",
    area: "RW 02",
    kecamatan: "Banjarmasin Selatan",
    aqi: 96,
    reports: 4,
    landmark: "Sungai Martapura",
  },
  {
    id: "sungai-baru",
    name: "Kel. Sungai Baru",
    short: "Sungai Baru",
    area: "RW 02",
    kecamatan: "Banjarmasin Tengah",
    aqi: 38,
    reports: 0,
    landmark: "Sungai Martapura",
  },
];

export function getKelurahan(id: string): Kelurahan {
  return KELURAHAN.find((k) => k.id === id) ?? KELURAHAN[0];
}

/* Public map zones. Positions are deliberately coarse (privacy by design). */
export interface PublicZone {
  id: string;
  x: number;
  y: number;
  r: number;
  count: number;
  disease: Disease;
  kelurahanId: string;
}

export const PUBLIC_ZONES: PublicZone[] = [
  { id: "z1", x: 118, y: 96, r: 30, count: 4, disease: "ispa", kelurahanId: "kelayan-selatan" },
  { id: "z2", x: 176, y: 138, r: 22, count: 3, disease: "diare", kelurahanId: "kelayan-selatan" },
  { id: "z3", x: 262, y: 84, r: 24, count: 4, disease: "diare", kelurahanId: "pekauman" },
];

export type ClusterLevel = "prioritas" | "siaga" | "waspada";
export const CLUSTER_STAGES = ["Baru", "Dipantau", "Verifikasi", "Selesai"] as const;

export interface Cluster {
  id: string;
  name: string;
  short: string;
  disease: Disease;
  reports: number;
  vulnerablePct: number;
  level: ClusterLevel;
  aqi: number;
  cases7d: number[];
  aqi7d: number[];
  summary: string;
  stage: number;
  /** map position for the officer map */
  x: number;
  y: number;
  r: number;
}

export const CLUSTERS: Cluster[] = [
  {
    id: "rw04-kelayan-selatan",
    name: "RW 04 Kelayan Selatan",
    short: "RW 04 Kelayan Slt.",
    disease: "ispa",
    reports: 14,
    vulnerablePct: 64,
    level: "prioritas",
    aqi: 132,
    cases7d: [2, 3, 3, 5, 7, 10, 14],
    aqi7d: [96, 101, 108, 112, 121, 127, 132],
    summary:
      "Lonjakan 14 laporan ISPA di RW 04 Kelayan Selatan berbarengan dengan kenaikan AQI 132. Tindak lanjut: koordinasi kader Posyandu RW 04 untuk verifikasi lapangan dan pembagian masker.",
    stage: 0,
    x: 126,
    y: 104,
    r: 38,
  },
  {
    id: "rw02-pekauman",
    name: "RW 02 Pekauman",
    short: "RW 02 Pekauman",
    disease: "diare",
    reports: 11,
    vulnerablePct: 45,
    level: "siaga",
    aqi: 96,
    cases7d: [1, 2, 4, 4, 6, 8, 11],
    aqi7d: [88, 90, 93, 91, 95, 94, 96],
    summary:
      "11 laporan diare dalam tiga hari terakhir, sebagian besar dari permukiman dekat tepi sungai. Tindak lanjut: cek sumber air bersih bersama kader dan bagikan oralit.",
    stage: 1,
    x: 262,
    y: 86,
    r: 30,
  },
  {
    id: "rw07-mantuil",
    name: "RW 07 Mantuil",
    short: "RW 07 Mantuil",
    disease: "ispa",
    reports: 6,
    vulnerablePct: 33,
    level: "waspada",
    aqi: 109,
    cases7d: [1, 1, 2, 2, 3, 5, 6],
    aqi7d: [99, 101, 104, 103, 106, 108, 109],
    summary:
      "6 laporan ISPA naik pelan seiring AQI 109. Tindak lanjut: pantau 24 jam ke depan dan siapkan edukasi penggunaan masker di posyandu.",
    stage: 0,
    x: 222,
    y: 168,
    r: 24,
  },
];

export function getCluster(id: string): Cluster | undefined {
  return CLUSTERS.find((c) => c.id === id);
}

export const LEVEL_STYLE: Record<ClusterLevel, { label: string; fg: string; bg: string; dot: string }> = {
  prioritas: { label: "Prioritas", fg: "#8f1b11", bg: "#fde7e4", dot: "#ef5b4b" },
  siaga: { label: "Siaga", fg: "#9a4306", bg: "#ffeedb", dot: "#f59e3b" },
  waspada: { label: "Waspada", fg: "#6b5600", bg: "#fff5c9", dot: "#f2d14b" },
};

export const DISEASE_LABEL: Record<Disease, string> = { ispa: "ISPA", diare: "Diare" };

export const TONE_DOT: Record<AqiTone, string> = {
  baik: "#34c77b",
  sedang: "#f2d14b",
  waspada: "#f59e3b",
  prioritas: "#ef5b4b",
  berbahaya: "#a23b8c",
};

export interface Puskesmas {
  id: string;
  name: string;
  distance: string;
  hours: string;
  mapsQuery: string;
}

export const PUSKESMAS: Puskesmas[] = [
  {
    id: "kelayan-timur",
    name: "Puskesmas Kelayan Timur",
    distance: "1.2 km",
    hours: "Buka 24 Jam (UGD)",
    mapsQuery: "Puskesmas Kelayan Timur Banjarmasin",
  },
  {
    id: "pekauman",
    name: "Puskesmas Pekauman",
    distance: "2.4 km",
    hours: "Buka 07.30 - 14.00",
    mapsQuery: "Puskesmas Pekauman Banjarmasin",
  },
  {
    id: "mantuil",
    name: "Puskesmas Mantuil",
    distance: "3.9 km",
    hours: "Buka 07.30 - 14.00",
    mapsQuery: "Puskesmas Mantuil Banjarmasin",
  },
];
