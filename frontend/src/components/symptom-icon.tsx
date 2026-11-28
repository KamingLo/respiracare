import { Droplet, Droplets, Frown, Thermometer, type LucideProps } from "lucide-react";
import type { SymptomId } from "@/lib/symptoms";

function Svg(props: LucideProps & { children: React.ReactNode }) {
  const { children, size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function Batuk(props: LucideProps) {
  return (
    <Svg {...props}>
      <circle cx="7" cy="12" r="3.2" />
      <path d="M13 7.5l3.5-2.5M14.5 12H20M13 16.5l3.5 2.5" />
    </Svg>
  );
}

function Sesak(props: LucideProps) {
  return (
    <Svg {...props}>
      <path d="M12 3v8" />
      <path d="M12 11c-1-2-2.8-3-4.8-3C4.800 8 3.800 11 3.800 15.500c0 3.200 1 4.500 2.700 4.500 2.400 0 5.500-1.800 5.500-5" />
      <path d="M12 11c1-2 2.800-3 4.800-3 2.400 0 3.400 3 3.400 7.500 0 3.200-1 4.500-2.700 4.500-2.400 0-5.500-1.800-5.500-5" />
    </Svg>
  );
}

export function SymptomIcon({ id, ...props }: { id: SymptomId } & LucideProps) {
  switch (id) {
    case "batuk":
      return <Batuk {...props} />;
    case "demam":
      return <Thermometer aria-hidden="true" {...props} />;
    case "sesak":
      return <Sesak {...props} />;
    case "pilek":
      return <Droplet aria-hidden="true" {...props} />;
    case "bab_cair":
      return <Droplets aria-hidden="true" {...props} />;
    case "muntah":
      return <Frown aria-hidden="true" {...props} />;
  }
}
