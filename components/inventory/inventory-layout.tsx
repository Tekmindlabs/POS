"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryList } from "./inventory-list";
import { InventoryMovements } from "./inventory-movements";
import { StockAdjustments } from "./stock-adjustments";
import { LowStockAlerts } from "./low-stock-alerts";

export function InventoryLayout() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inventory">Current Stock</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <InventoryList />
        </TabsContent>

        <TabsContent value="movements">
          <InventoryMovements />
        </TabsContent>

        <TabsContent value="adjustments">
          <StockAdjustments />
        </TabsContent>

        <TabsContent value="alerts">
          <LowStockAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
}