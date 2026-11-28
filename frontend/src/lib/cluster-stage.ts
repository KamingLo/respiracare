"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getCluster } from "./data";

const listeners = new Set<() => void>();
const overrides = new Map<string, number>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Handling stage of a cluster. Kept in memory until the cluster endpoints exist. */
export function useClusterStage(id: string): [number, (stage: number) => void] {
  const stage = useSyncExternalStore(
    subscribe,
    () => overrides.get(id) ?? getCluster(id)?.stage ?? 0,
    () => getCluster(id)?.stage ?? 0,
  );
  const set = useCallback(
    (next: number) => {
      overrides.set(id, next);
      listeners.forEach((l) => l());
    },
    [id],
  );
  return [stage, set];
}
