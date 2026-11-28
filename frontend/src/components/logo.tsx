import Image from "next/image";

const VARIANTS = {
  full: { src: "/logo.png", w: 1200, h: 188, alt: "RespiraCare" },
  word: { src: "/logo-wordmark.png", w: 1000, h: 163, alt: "RespiraCare" },
  mark: { src: "/logo-mark.png", w: 796, h: 640, alt: "" },
} as const;

export function Logo({
  variant = "full",
  className,
  priority,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  priority?: boolean;
}) {
  const v = VARIANTS[variant];
  return (
    <Image
      src={v.src}
      width={v.w}
      height={v.h}
      alt={v.alt}
      priority={priority}
      className={className}
      style={{ height: "auto" }}
    />
  );
}
