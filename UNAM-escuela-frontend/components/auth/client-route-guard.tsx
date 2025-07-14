"use client";

import { RouteGuard } from "@/components/auth/route-guard";

interface ClientRouteGuardProps {
  children: React.ReactNode;
}

export default function ClientRouteGuard({ children }: ClientRouteGuardProps) {
  return <RouteGuard requiredPage="/main/teacher">{children}</RouteGuard>;
}
