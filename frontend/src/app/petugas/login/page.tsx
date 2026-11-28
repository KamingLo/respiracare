"use client";

import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/logo";
import { Screen, ScreenHeader } from "@/components/screen";
import { signInOfficer } from "@/lib/officer-session";

export default function LoginPetugas() {
  const router = useRouter();
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Isi email Puskesmas dengan format yang benar.");
    if (password.length < 6) return setError("Kata sandi minimal 6 karakter.");
    signInOfficer(email);
    router.replace("/petugas");
  }

  return (
    <Screen size="form" className="lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-8 lg:gap-y-6">
      <ScreenHeader
        className="lg:col-span-2"
        title="Login Petugas"
        backHref="/peta"
        right={
          <span className="flex size-12 items-center justify-center rounded-2xl bg-mint text-brand">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
        }
      />

      <section className="rounded-[28px] bg-brand p-6 text-white lg:col-start-1 lg:row-span-2 lg:row-start-2 lg:p-10">
        <Logo variant="mark" className="mb-4 w-14 rounded-2xl bg-white p-2" />
        <h2 className="t-screen">Surveilans Puskesmas</h2>
        <p className="t-body mt-1 text-white/95">
          Pantau klaster laporan ISPA &amp; diare warga di wilayah kerja Puskesmas secara real-time.
        </p>
      </section>

      <form id="login" onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-card border border-line bg-white p-5 lg:col-start-2 lg:row-start-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="t-chip">
            Email Puskesmas
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 focus-within:border-brand">
            <Mail size={20} className="shrink-0 text-brand" aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="nama.pkm@banjarmasin.go.id"
              className="t-tile h-full w-full bg-transparent outline-none placeholder:font-medium placeholder:text-ink-soft/60"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="t-label">
            Kata Sandi
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 focus-within:border-brand">
            <Lock size={20} className="shrink-0 text-brand" aria-hidden="true" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="t-tile h-full w-full bg-transparent outline-none placeholder:font-medium placeholder:text-ink-soft/60"
            />
          </div>
        </div>
        {error && (
          <p role="alert" className="t-chip text-danger">
            {error}
          </p>
        )}
        <div className="rounded-2xl bg-mint p-4">
          <p className="t-chip text-brand-deep">Khusus Tim Surveilans Puskesmas</p>
          <p className="t-label mt-0.5 text-ink-soft">Kendala akun? Hubungi Admin Dinkes Kota Banjarmasin.</p>
        </div>
      </form>

      <button
        type="submit"
        form="login"
        className="t-cta mt-auto flex h-14 w-full items-center justify-center rounded-[20px] bg-brand text-white transition-colors hover:bg-brand-deep lg:col-start-2 lg:row-start-3 lg:self-start"
      >
        Masuk Dasbor
      </button>
    </Screen>
  );
}
