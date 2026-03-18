/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import moment from 'moment';

import { InventoryItem, InventoryTableItem, StockGraph, StockItem } from '@/types'

type SortOrder = 'asc' | 'desc'

interface InventoryState {
  data: InventoryTableItem[];
  allData: InventoryTableItem[];
  stockData: StockItem[];
  selected: InventoryItem | null;
  loading: boolean;
  isEditStock: boolean;

  search: string;
  sortBy: keyof InventoryTableItem | '';
  order: SortOrder;
  page: number;
  totalPage: number;
  totalData: number;

  isOpenModal: boolean;
  modalType: 'view' | 'history' | 'delete' | 'add' | '';
  activeTab: 'all' | 'pending';

  setSearch: (value: string) => void;
  setSort: (key: keyof InventoryTableItem) => void;
  setPage: (value: number) => void;
  setStockData: (value: StockItem[]) => void;

  setSelected: (value: InventoryItem | null) => void;
  setIsOpenModal: (value: boolean) => void;
  setIsEditStock: (value: boolean) => void;
  setModalType: (value: 'view' | 'history' | 'delete' | 'add' | '') => void;
  setActiveTab: (value: 'all' | 'pending') => void;

  fetchData: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  buildChartData: (id: number, data: StockItem[]) => StockGraph[];
  updateItem: (inventory_id: number, payload: Partial<StockItem>) => Promise<void>;
  approveRejectItem: (id: number, action: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  data: [],
  allData: [],
  stockData: [],
  loading: false,

  search: '',
  sortBy: '' as const,
  order: 'asc',
  page: 0,
  totalPage: 0,
  totalData: 0,
  selected: null,

  isOpenModal: false,
  modalType: '',
  activeTab: 'all',
  isEditStock: false,

  setSearch: (value) => set({ search: value, page: 0 }),
  setPage: (value) => set({ page: value }),
  setStockData: (value) => set({ stockData: value }),
  setSelected: (value) => set({ selected: value }),
  setIsOpenModal: (value) => set({ isOpenModal: value }),
  setModalType: (value) => set({ modalType: value }),
  setActiveTab: (value) => set({ activeTab: value }),
  setIsEditStock: (value) => set({ isEditStock: value }),

  setSort: (key) => {
    const { sortBy, order } = get()

    if (sortBy === key) {
      set({ order: order === 'asc' ? 'desc' : 'asc' })
    } else {
      set({ sortBy: key, order: 'asc' })
    }
  },

  fetchAllData: async () => {
    set({ loading: true })

    const res = await fetch('/api/inventory')
    const data = await res.json()

    const resStock = await fetch('/api/inventory/stock')
    const dataStock = await resStock.json()

    const pendingStock = dataStock?.filter(
      (s: StockItem) => s?.status === 'pending'
    )

    const pendingInventoryIds = new Set(
      pendingStock.map((s: StockItem) => s.inventory_id)
    )

    const allData = data?.filter(
      (invent: InventoryItem) =>
        !pendingInventoryIds.has(invent.id)
    )

    set({
      allData,
      loading: false,
    })
  },

  fetchData: async () => {
    set({ loading: true })

    const res = await fetch('/api/inventory')
    const data = await res.json()

    const resStock = await fetch('/api/inventory/stock')
    const dataStock = await resStock.json()

    const { search, sortBy, order, page, activeTab } = get()

    let result = []
    if (activeTab === 'all') {
      result = [...data]
    } else {
      result = [...dataStock]
        .filter((stock) => stock?.status === 'pending')
        .map((stock) => {
          const findData = data?.find((inven: InventoryItem) => inven?.id === stock?.inventory_id)

          return {
            ...findData,
            prev: stock?.prev,
            current: stock?.current,
            stockId: stock?.id,
            createdAt: stock?.createdAt,
            status: stock?.status,
            action: stock?.action,
            updatedAt: stock?.updatedAt,
          }
        })
    }

    const totalData = data?.length;

    if (search) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sortBy) {
      result.sort((a: any, b: any) => {
        if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1
        if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1
        return 0
      })
    }

    const totalPage = Math.ceil(result?.length / 10)

    const from = (page) * 10;
    const to = from + 10 - 1;

    result = result.slice(from, to)

    set({
      data: result,
      stockData: dataStock,
      totalPage,
      totalData,
      loading: false,
    })
  },

  buildChartData: (id: number, data: StockItem[]) => {
    const filtered = data
      .filter((item) => item.inventory_id === id && item?.status !== 'pending')
      .sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() -
          new Date(b.updatedAt).getTime()
      )

    const result: StockGraph[] = []

    filtered.forEach((item, index) => {
      if (index === 0) {
        result.push({
          date: moment(item.updatedAt).format("DD MMM"),
          qty: item.prev,
        })
      }

      result.push({
        date: moment(item.updatedAt).format("DD MMM"),
        qty: item.current,
      })
    })

    return result
  },

  updateItem: async (inventory_id: number, payload: Partial<StockItem>) => {
    await fetch(`/api/inventory/stock/${inventory_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    get().fetchData()
  },

  approveRejectItem: async (id: number, action: string) => {
    await fetch(`/api/inventory/stock/action/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
      }),
    })

    get().fetchData()
  }
}))
