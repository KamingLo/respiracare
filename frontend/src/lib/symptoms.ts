export type SymptomId = "batuk" | "demam" | "sesak" | "pilek" | "bab_cair" | "muntah";

export const SYMPTOMS: { id: SymptomId; label: string; longLabel: string; words: string[] }[] = [
  { id: "batuk", label: "Batuk", longLabel: "Batuk", words: ["batuk"] },
  { id: "demam", label: "Demam", longLabel: "Demam", words: ["demam", "panas", "hangat", "meriang"] },
  { id: "sesak", label: "Sesak", longLabel: "Sesak napas", words: ["sesak", "napas", "nafas", "ngik", "mengi"] },
  { id: "pilek", label: "Pilek", longLabel: "Pilek", words: ["pilek", "ingus", "hidung"] },
  { id: "bab_cair", label: "BAB Cair", longLabel: "BAB cair", words: ["diare", "mencret", "bab", "cair", "berak"] },
  { id: "muntah", label: "Muntah", longLabel: "Muntah", words: ["muntah", "mual", "muntaber"] },
];

export function symptomLabel(id: SymptomId): string {
  return SYMPTOMS.find((s) => s.id === id)?.longLabel ?? id;
}

/** Local stand-in for the Gemini classifier (POST /api/ai/classify). */
export function classifyStory(story: string): SymptomId[] {
  const text = story.toLowerCase();
  return SYMPTOMS.filter((s) => s.words.some((w) => text.includes(w))).map((s) => s.id);
}

export const AGE_GROUPS = [
  { id: "balita", label: "Balita" },
  { id: "anak", label: "Anak" },
  { id: "remaja", label: "Remaja" },
  { id: "dewasa", label: "Dewasa" },
  { id: "lansia", label: "Lansia" },
] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number]["id"];
