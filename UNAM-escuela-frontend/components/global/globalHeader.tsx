import { ReactNode } from "react";

interface GlobalHeaderProps {
  children: ReactNode;
}

export function GlobalHeader({ children }: GlobalHeaderProps) {
  return <div className="text-content">{children}</div>;
}
