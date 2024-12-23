"use client";

import { Shell } from "@/components/layout/shell";
import { POSLayout } from "@/components/pos/pos-layout";
import { useAuth } from "@/hooks/use-auth";

export default function POSPage() {
  const { user } = useAuth();
  
  return (
    <Shell user={user?.profile}>
      <POSLayout />
    </Shell>
  );
}