import { InventoryItem } from "@/types"
import { INVENTORY_DUMMY } from "../data/inventory"

const KEY = 'inventory_item'

export function getInventory(): InventoryItem[] {
  if (typeof window === 'undefined') return INVENTORY_DUMMY

  const data = localStorage.getItem(KEY)

  if (!data) {
    localStorage.setItem(KEY, JSON.stringify(INVENTORY_DUMMY))
    return INVENTORY_DUMMY
  }

  return JSON.parse(data)
}

export function setInventory(data: InventoryItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}
