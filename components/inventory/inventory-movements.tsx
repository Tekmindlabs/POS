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
import { format } from "date-fns";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Movement {
  id: string;
  type: "receive" | "sale" | "adjustment" | "transfer";
  quantity: number;
  created_at: string;
  product: {
    name: string;
    sku: string;
  };
  created_by_user: {
    full_name: string;
  };
}

export function InventoryMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovements = async () => {
      if (!user?.profile?.store_id) return;

      const { data } = await supabase
        .from("inventory_transactions")
        .select(`
          id,
          type,
          quantity,
          created_at,
          product:products (
            name,
            sku
          ),
          created_by_user:user_profiles (
            full_name
          )
        `)
        .eq("store_id", user.profile.store_id)
        .order("created_at", { ascending: false });

      if (data) setMovements(data);
    };

    fetchMovements();
  }, [user?.profile?.store_id]);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Created By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>
                {format(new Date(movement.created_at), "PPp")}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    movement.type === "receive"
                      ? "bg-green-100 text-green-800"
                      : movement.type === "sale"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {movement.type}
                </span>
              </TableCell>
              <TableCell>{movement.product.name}</TableCell>
              <TableCell>{movement.product.sku}</TableCell>
              <TableCell className="text-right">
                {movement.type === "sale" ? "-" : "+"}
                {movement.quantity}
              </TableCell>
              <TableCell>{movement.created_by_user.full_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}