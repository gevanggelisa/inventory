"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { useRoleStore } from "@/store"

export const RoleDropDown = () => {
  const { role, setRole } = useRoleStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {role}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setRole("staff")}>
          Staff
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("officer")}>
          Officer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
