// app/providers.tsx
"use client";

import QueryProviderWrapper from "@/components/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProviderWrapper>{children}</QueryProviderWrapper>;
}
