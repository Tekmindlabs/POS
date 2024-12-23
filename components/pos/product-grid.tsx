"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductGridProps {
  categoryId: string | null;
  searchQuery: string;
}

export function ProductGrid({ categoryId, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("name");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data } = await query;
      if (data) setProducts(data);
    };

    fetchProducts();
  }, [categoryId, searchQuery]);

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => addItem(product)}
          >
            {product.image_url && (
              <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-1">
              <h3 className="font-medium leading-none">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${product.base_price.toFixed(2)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}