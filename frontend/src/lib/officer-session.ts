"use client";

import { useSyncExternalStore } from "react";

export interface OfficerSession {
  name: string;
  email: string;
  puskesmas: string;
}

const KEY = "respiracare.officer";
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: OfficerSession | null } = { raw: null, value: null };

function read(): OfficerSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw === cache.raw) return cache.value;
    cache = { raw, value: raw ? (JSON.parse(raw) as OfficerSession) : null };
    return cache.value;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** undefined while hydrating, null when signed out */
export function useOfficer(): OfficerSession | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

/**
 * Demo sign-in. Swap this body for POST /api/auth/login once the frontend talks
 * to the backend; keep the session shape the same.
 */
export function signInOfficer(email: string): OfficerSession {
  const local = email.split("@")[0] ?? "petugas";
  const name = local.split(".")[0] ?? "petugas";
  const session: OfficerSession = {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email,
    puskesmas: "PKM Kelayan Timur",
  };
  sessionStorage.setItem(KEY, JSON.stringify(session));
  listeners.forEach((l) => l());
  return session;
}

export function signOutOfficer() {
  sessionStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}
