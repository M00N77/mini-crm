"use client";

import type { ReactNode } from "react";

// TODO: Add QueryClientProvider (TanStack Query)
// TODO: Add AuthProvider context

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
