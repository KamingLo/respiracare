"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/logo";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/peta");
    const t = setTimeout(() => router.replace("/peta"), 1900);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="grid min-h-dvh place-items-center bg-white px-8">
      <Logo variant="full" priority className="w-[min(82vw,440px)] animate-rise" />
      <Link href="/peta" className="t-chip fade-in absolute bottom-10 rounded-full px-4 py-2 text-ink-soft transition-colors hover:bg-mint">
        Lewati
      </Link>
    </main>
  );
}
