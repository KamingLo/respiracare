import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RespiraCare",
    template: "%s | RespiraCare",
  },
  description:
    "Pantau kualitas udara dan laporkan gejala ISPA atau diare di sekitar Anda. Data warga membantu petugas Puskesmas bertindak lebih cepat.",
  applicationName: "RespiraCare",
};

export const viewport: Viewport = {
  themeColor: "#02824b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
