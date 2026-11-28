"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Disease } from "./data";
import type { AgeGroup, SymptomId } from "./symptoms";

export interface ReportDraft {
  disease: Disease;
  ageGroup: AgeGroup;
  count: number;
  kelurahanId: string;
  locationMode: "gps" | "manual";
  story: string;
  /** chosen by hand on the form */
  manual: SymptomId[];
  /** picked up from the story by the classifier */
  ai: SymptomId[];
  /** final selection on the confirmation screen */
  confirmed: SymptomId[];
}

const INITIAL: ReportDraft = {
  disease: "ispa",
  ageGroup: "balita",
  count: 2,
  kelurahanId: "kelayan-selatan",
  locationMode: "gps",
  story: "",
  manual: [],
  ai: [],
  confirmed: [],
};

interface Ctx {
  draft: ReportDraft;
  update: (patch: Partial<ReportDraft>) => void;
  reset: () => void;
}

const ReportFlowContext = createContext<Ctx | null>(null);

export function ReportFlowProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ReportDraft>(INITIAL);
  const update = useCallback((patch: Partial<ReportDraft>) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft(INITIAL), []);
  const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset]);
  return <ReportFlowContext.Provider value={value}>{children}</ReportFlowContext.Provider>;
}

export function useReportFlow(): Ctx {
  const ctx = useContext(ReportFlowContext);
  if (!ctx) throw new Error("useReportFlow must be used inside ReportFlowProvider");
  return ctx;
}
