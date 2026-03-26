"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner"


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
  position="bottom-right"
  expand={false}
  richColors
 
  offset={16}
  toastOptions={{
    classNames: {
      toast:
        "z-[9999] w-[360px] rounded-xl border border-gray-200 bg-white shadow-xl",
      title: "text-sm font-medium",
      description: "text-sm text-gray-500",
    },
  }}
/>
    </QueryClientProvider>
  );
}