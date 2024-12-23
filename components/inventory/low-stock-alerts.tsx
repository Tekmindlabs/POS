"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface LowStockItem {
  id: string;
  product: {
    name: string;
    sku: string;
  };
  quantity: number;
  min_quantity: number;
}

export function LowStockAlerts() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLowStock = async () => {
      if (!user?.profile?.store_id) return;

      const { data } = await supabase
        .from("inventory")
        .select(`
          id,
          quantity,
          min_quantity,
          product:products (
            name,
            sku
          )
        `)
        .eq("store_id", user.profile.store_id)
        .lte("quantity", supabase.raw("min_quantity"))
        .order("quantity");

      if (data) setItems(data);
    };

    fetchLowStock();
  }, [user?.profile?.store_id]);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>
            No products are currently below their minimum stock level.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Alert variant="destructive" key={item.id}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {item.product.name} (SKU: {item.product.sku}) is running low.
            Current stock: {item.quantity}, Minimum required: {item.min_quantity}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}