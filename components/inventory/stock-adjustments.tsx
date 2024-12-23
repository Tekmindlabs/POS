"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/client";

export function StockAdjustments() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profile?.store_id) return;

    setLoading(true);
    try {
      // Create inventory transaction
      const { error: transactionError } = await supabase
        .from("inventory_transactions")
        .insert({
          store_id: user.profile.store_id,
          product_id: productId,
          type: "adjustment",
          quantity: parseInt(quantity),
          notes: reason,
          created_by: user.id,
        });

      if (transactionError) throw transactionError;

      // Update inventory quantity
      const { error: inventoryError } = await supabase.rpc("update_inventory", {
        p_store_id: user.profile.store_id,
        p_product_id: productId,
        p_quantity: parseInt(quantity),
      });

      if (inventoryError) throw inventoryError;

      // Reset form
      setProductId("");
      setQuantity("");
      setReason("");
    } catch (error) {
      console.error("Error adjusting stock:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Adjustment</CardTitle>
        <CardDescription>
          Adjust stock levels and record the reason for the adjustment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdjustment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={productId}
              onValueChange={setProductId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {/* Products will be fetched and mapped here */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Adjustment Quantity (positive or negative)
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity (e.g., -5 or +10)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for adjustment"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Adjusting..." : "Submit Adjustment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}