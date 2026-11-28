import { ReportFlowProvider } from "@/lib/report-flow";

export default function LaporLayout({ children }: LayoutProps<"/lapor">) {
  return <ReportFlowProvider>{children}</ReportFlowProvider>;
}
