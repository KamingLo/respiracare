"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, FileText, Home, MapPin, User } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./logo";

export type TabId = "peta" | "lapor" | "klinik" | "petugas";

const TABS: { id: TabId; href: string; label: string; Icon: typeof MapPin }[] = [
  { id: "peta", href: "/peta", label: "Peta", Icon: MapPin },
  { id: "lapor", href: "/lapor", label: "Lapor", Icon: FileText },
  { id: "klinik", href: "/klinik", label: "Klinik", Icon: Home },
  { id: "petugas", href: "/petugas", label: "Petugas", Icon: User },
];

export function BottomTabs({ active, children }: { active: TabId; children?: ReactNode }) {
  return (
    <nav
      aria-label="Menu utama"
      className="sticky bottom-0 z-20 bg-gradient-to-t from-surface via-surface to-transparent px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden print:hidden"
    >
      {children && <div className="px-1 pb-3">{children}</div>}
      <ul className="flex items-center justify-between rounded-[28px] border border-line bg-white p-2 shadow-[0_8px_24px_-12px_rgba(2,104,54,0.35)]">
        {TABS.map(({ id, href, label, Icon }) => {
          const on = id === active;
          return (
            <li key={id}>
              <Link
                href={href}
                aria-label={label}
                aria-current={on ? "page" : undefined}
                className={
                  on
                    ? "t-chip flex h-12 items-center gap-2 rounded-[20px] bg-brand px-5 text-white"
                    : "flex h-12 w-14 items-center justify-center rounded-[20px] text-ink-soft transition-colors hover:bg-mint"
                }
              >
                <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                {on && <span>{label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Top navigation bar, only shown on desktop (lg and up). Mobile uses BottomTabs. */
export function TopNav() {
  const pathname = usePathname();
  const onLapor = pathname.startsWith("/lapor");
  return (
    <header className="sticky top-0 z-30 hidden h-[72px] border-b border-line bg-white/85 backdrop-blur-md lg:block print:hidden">
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-8 px-8">
        <Link href="/peta" aria-label="RespiraCare, ke halaman Peta" className="shrink-0">
          <Logo variant="full" className="w-44" />
        </Link>
        <nav aria-label="Menu utama" className="flex-1">
          <ul className="flex items-center justify-center gap-1">
            {TABS.map(({ id, href, label, Icon }) => {
              const on = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={id}>
                  <Link
                    href={href}
                    aria-current={on ? "page" : undefined}
                    className={`t-tile flex h-11 items-center gap-2 rounded-2xl px-4 transition-colors ${
                      on ? "bg-mint text-brand-deep" : "text-ink-soft hover:bg-mint/60 hover:text-ink"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex w-44 shrink-0 justify-end">
          {!onLapor && (
            <Link
              href="/lapor"
              className="t-chip flex h-11 items-center gap-2 rounded-2xl bg-brand px-5 text-white transition-[transform,background-color] hover:bg-brand-deep active:scale-[0.98]"
            >
              <FileText size={18} aria-hidden="true" />
              Lapor Gejala
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const WIDTH = {
  /** dashboards, map, lists */
  wide: "lg:max-w-[1200px]",
  /** forms and result screens */
  form: "lg:max-w-[960px]",
  /** single card screens (error states etc.) */
  narrow: "lg:max-w-[680px]",
} as const;

/**
 * Responsive page shell.
 * - below lg: phone-width column with bottom tab bar
 * - lg and up: full-width web layout with a top navbar and a centred content area
 */
export function Screen({
  children,
  tab,
  cta,
  size = "wide",
  className = "",
}: {
  children: ReactNode;
  tab?: TabId;
  /** primary action pinned above the tab bar (mobile only, desktop has it in the navbar) */
  cta?: ReactNode;
  size?: keyof typeof WIDTH;
  className?: string;
}) {
  return (
    <div className="min-h-dvh lg:bg-surface">
      <TopNav />
      <div
        className={`mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-surface sm:border-x sm:border-line sm:shadow-[0_0_60px_-30px_rgba(2,104,54,0.4)] lg:min-h-[calc(100dvh-72px)] lg:border-0 lg:shadow-none ${WIDTH[size]}`}
      >
        <main
          className={`stagger-in flex flex-1 flex-col gap-5 px-5 pt-[max(20px,env(safe-area-inset-top))] pb-6 lg:gap-6 lg:px-8 lg:pt-10 lg:pb-16 ${className}`}
        >
          {children}
        </main>
        {tab && <BottomTabs active={tab}>{cta}</BottomTabs>}
      </div>
    </div>
  );
}

export function ScreenHeader({
  title,
  right,
  backHref,
  className = "",
}: {
  title: string;
  right?: ReactNode;
  backHref?: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <header className={`grid grid-cols-[48px_1fr_48px] items-center gap-2 print:hidden ${className}`}>
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Kembali"
          className="flex size-12 items-center justify-center rounded-2xl border border-line bg-white text-ink"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex size-12 items-center justify-center rounded-2xl border border-line bg-white text-ink"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
      )}
      <h1 className="t-screen text-center lg:text-left">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  );
}

export function IconButton({
  label,
  children,
  onClick,
  pressed,
  tone = "light",
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
  tone?: "light" | "brand";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex size-12 items-center justify-center rounded-2xl border transition-colors ${
        tone === "brand" || pressed
          ? "border-brand bg-brand text-white"
          : "border-line bg-white text-brand-deep hover:bg-mint"
      }`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  href,
  onClick,
  type = "button",
  disabled,
  variant = "solid",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const base =
    "t-cta flex h-14 w-full items-center justify-center gap-2 rounded-[20px] transition-[transform,background-color] active:scale-[0.99] disabled:opacity-50 print:hidden";
  const look =
    variant === "solid"
      ? "bg-brand text-white hover:bg-brand-deep"
      : "t-tile border-2 border-brand/25 bg-white text-brand-deep hover:bg-mint";
  const cls = `${base} ${look} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
