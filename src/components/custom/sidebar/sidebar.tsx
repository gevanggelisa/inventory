// src/components/layout/Sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
} from "lucide-react"
import { RoleDropDown } from "../dropdown"

const menus = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
  },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r bg-background flex flex-col justify-between py-10 px-4">
      <div>
        <div className="text-lg font-semibold">
          Inventory App
        </div>

        <nav className="flex-1 space-y-1">
          {menus.map((menu) => {
            const Icon = menu.icon
            const isActive = pathname === menu.href

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {menu.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <RoleDropDown />
    </aside>
  )
}