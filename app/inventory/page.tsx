"use client";

import { Shell } from "@/components/layout/shell";
import { InventoryLayout } from "@/components/inventory/inventory-layout";
import { useAuth } from "@/hooks/use-auth";

export default function InventoryPage() {
  const { user } = useAuth();
  
  return (
    <Shell user={user?.profile}>
      <InventoryLayout />
    </Shell>
  );
}