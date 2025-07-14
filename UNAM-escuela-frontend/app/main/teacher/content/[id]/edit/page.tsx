import React from "react";
import ClientRouteGuard from "@/components/auth/client-route-guard";
import EditContentServer from "./edit-content-server";

interface EditContentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditContentPage({
  params,
}: EditContentPageProps) {
  const { id } = await params;

  return (
    <ClientRouteGuard>
      <EditContentServer contentId={id} />
    </ClientRouteGuard>
  );
}
