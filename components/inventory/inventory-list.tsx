"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AddStockDialog } from "./add-stock-dialog";

interface InventoryItem {
  id: string;
  product: {
    name: string;
    sku: string;
  };
  quantity: number;
  min_quantity: number;
  max_quantity: number | null;
}

export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStock, setShowAddStock] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user?.profile?.store_id) return;

      const { data } = await supabase
        .from("inventory")
        .select(`
          id,
          quantity,
          min_quantity,
          max_quantity,
          product:products (
            name,
            sku
          )
        `)
        .eq("store_id", user.profile.store_id)
        .order("id");

      if (data) setItems(data);
    };

    fetchInventory();
  }, [user?.profile?.store_id]);

  const filteredItems = items.filter((item) =>
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddStock(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Min Stock</TableHead>
              <TableHead className="text-right">Max Stock</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.sku}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.min_quantity}</TableCell>
                <TableCell className="text-right">
                  {item.max_quantity || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.quantity <= item.min_quantity
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.quantity <= item.min_quantity ? "Low Stock" : "In Stock"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddStockDialog
        open={showAddStock}
        onOpenChange={setShowAddStock}
      />
    </div>
  );
}