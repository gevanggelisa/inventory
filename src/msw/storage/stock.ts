import { StockItem } from "@/types"
import { STOCK_DUMMY } from "../data/stock"

const KEY = 'stock_log'

export function getStock(): StockItem[] {
  if (typeof window === 'undefined') return STOCK_DUMMY

  const data = localStorage.getItem(KEY)

  if (!data) {
    localStorage.setItem(KEY, JSON.stringify(STOCK_DUMMY))
    return STOCK_DUMMY
  }

  return JSON.parse(data)
}

export function setStock(data: StockItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}
