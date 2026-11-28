import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-8 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4">
        <Logo variant="full" className="w-56" />
        <h1 className="t-screen">Halaman tidak ditemukan</h1>
        <p className="t-body text-ink-soft">Alamat yang Anda buka tidak ada atau sudah dipindah.</p>
        <Link href="/peta" className="t-cta flex h-14 items-center rounded-[20px] bg-brand px-8 text-white">
          Kembali ke Peta
        </Link>
      </div>
    </main>
  );
}
