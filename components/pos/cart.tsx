"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Minus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/client";

export function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user?.id || !user.profile?.store_id) return;
    
    setProcessing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          store_id: user.profile.store_id,
          cashier_id: user.id,
          status: "completed",
          total_amount: total,
          payment_method: "cash",
        })
        .select()
        .single();

      if (orderError || !order) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.base_price,
        total_price: item.base_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
    } catch (error) {
      console.error("Error processing order:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col border rounded-lg bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Current Order</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${item.base_price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(0, item.quantity - 1))
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value) || 0)
                  }
                  className="w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            disabled={items.length === 0 || processing}
            onClick={handleCheckout}
          >
            {processing ? "Processing..." : "Complete Sale"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={items.length === 0 || processing}
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}