"use client";

import { useState } from "react";
import { ProductGrid } from "./product-grid";
import { Cart } from "./cart";
import { CategoryList } from "./category-list";
import { SearchBar } from "./search-bar";

export function POSLayout() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <SearchBar onSearch={setSearchQuery} />
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ProductGrid
          categoryId={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>
      <div className="w-full md:w-96 flex-shrink-0">
        <Cart />
      </div>
    </div>
  );
}