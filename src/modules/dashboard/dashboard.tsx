'use client'

import { useRoleStore } from "@/store"

export const DashboardComponent = () => {
  const { role } = useRoleStore()

  return (
    <div>
      You are login as <span className="capitalize">{role}</span>
    </div>
  )
}
