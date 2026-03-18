import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Role } from "@/types"

interface RoleState {
  role: Role
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: "staff",
      setRole: (role) => set({ role }),
    }),
    {
      name: "active_role",
    }
  )
)