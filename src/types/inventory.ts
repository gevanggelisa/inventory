export interface InventoryItem {
  id: number;
  name: string;
  qty: number;
  updatedAt: string;
  createdAt: string;
  sku: string;
  category: string;
  price: number;
  supplier: string;
}

export interface StockItem {
  id: number;
  inventory_id: number;
  status: 'approved' | 'pending';
  action: 'add' | 'update' | 'delete';
  prev: number;
  current: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockGraph {
  date: string;
  qty: number;
}

export type InventoryTableItem = InventoryItem & {
  prev?: number
  current?: number
  stockId?: number
  status?: string
  action?: string
}
