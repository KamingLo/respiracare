"use client";

import { Download } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { ClusterDetailBody } from "@/components/cluster-detail";
import { IconButton, Screen, ScreenHeader } from "@/components/screen";
import { getCluster } from "@/lib/data";
import { useOfficer } from "@/lib/officer-session";

export default function DetailKlaster({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const officer = useOfficer();
  const cluster = getCluster(id);

  useEffect(() => {
    if (officer === null) router.replace("/petugas/login");
  }, [officer, router]);

  if (!cluster) notFound();
  if (!officer) return <div className="grid min-h-dvh place-items-center" aria-busy="true" />;

  return (
    <Screen size="form">
      <ScreenHeader
        title="Detail Klaster"
        backHref="/petugas"
        right={
          <IconButton label="Cetak atau simpan sebagai PDF" onClick={() => window.print()}>
            <Download size={22} aria-hidden="true" />
          </IconButton>
        }
      />
      <ClusterDetailBody cluster={cluster} wide />
    </Screen>
  );
}
