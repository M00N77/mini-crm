"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "./modal-provider";
import { ToastContainer } from "@/shared/ui";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 минута кэша (предотвращает лишние повторные сетевые запросы)
            gcTime: 1000 * 60 * 5, // 5 минут хранения неактивных данных в памяти
            refetchOnWindowFocus: false, // Исключает избыточные рефетчи при переключении вкладок
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ModalProvider />
      <ToastContainer />
    </QueryClientProvider>
  );
}
