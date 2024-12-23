"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Store,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: Store },
    { name: "POS", href: "/pos", icon: ShoppingCart },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Users", href: "/users", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  manager: [
    { name: "Dashboard", href: "/dashboard", icon: Store },
    { name: "POS", href: "/pos", icon: ShoppingCart },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ],
  cashier: [
    { name: "POS", href: "/pos", icon: ShoppingCart },
    { name: "Dashboard", href: "/dashboard", icon: Store },
  ],
};

interface MainNavProps {
  userRole?: "admin" | "manager" | "cashier";
}

export function MainNav({ userRole = "cashier" }: MainNavProps) {
  const pathname = usePathname();
  const navItems = navigation[userRole] || navigation.cashier;

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="h-5 w-5 mr-2" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}