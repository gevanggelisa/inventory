import moment from "moment"
import { http, HttpResponse } from "msw"

import { InventoryItem, StockItem } from "@/types"
import { getInventory, getStock, setInventory, setStock } from "./storage"

const BASE_URL = '/api/inventory'

export const handlers = [
  http.get(BASE_URL, async() => {
    const inventory = getInventory()
    return HttpResponse.json(inventory)
  }),

  http.get(`${BASE_URL}/stock`, async() => {
    const inventory = getStock()
    return HttpResponse.json(inventory)
  }),

  // CREATE OR UPDATE STOCK
  http.put(`${BASE_URL}/stock/:inventory_id`, async ({ params, request }) => {
    const stock = getStock()

    const inventId = Number(params?.inventory_id)
    const body = (await request.json()) as Partial<StockItem>

    const filterStock = stock?.filter((data: StockItem) => data.inventory_id === inventId)
    const findPendingStock = filterStock?.find((data: StockItem) => data?.status === 'pending')

    let updatedStock: StockItem[] = []

    if (filterStock?.length > 0) {
      if (findPendingStock?.id) {
        updatedStock = stock.map((item: StockItem) =>
          item.id === findPendingStock.id
            ? {
                ...item,
                prev: body?.prev ?? item.prev,
                current: body?.current ?? item.current,
                status: 'pending',
                action: 'update',
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
              }
            : item
        )
      } else {
        updatedStock = [
          ...stock,
          {
            id: stock[stock?.length - 1]?.id + 1,
            inventory_id: inventId,
            prev: body?.prev || 0,
            current: body?.current || 0,
            createdAt: moment().toISOString(),
            updatedAt: moment().toISOString(),
            status: 'pending',
            action: 'update',
          },
        ]
      }
    } else {
      const newItem: StockItem = {
        id: stock[stock?.length - 1]?.id + 1,
        inventory_id: inventId,
        prev: body?.prev || 0,
        current: body?.current || 0,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
        status: 'pending',
        action: 'add',
      }

      updatedStock = [...stock, newItem]
    }

    setStock(updatedStock)

    return HttpResponse.json({ success: true })
  }),

  // UPDATE DELETE STOCK
  http.put(`${BASE_URL}/stock/action/:id`, async ({ params, request }) => {
    const stock = getStock()
    const inventory = getInventory()

    const id = Number(params?.id)
    const body = (await request.json()) as { action: string }

    let updatedStock: StockItem[] = []
    let updatedData: InventoryItem[] = []
    const findData = stock?.find((item) => item?.id === id)

    if (body?.action === 'approved') {
      if (findData?.action === 'add' || findData?.action === 'update') {
        updatedStock = stock.map((item) => {
          if (item?.id === id) {
            return {
              ...item,
              status: "approved",
              action: findData?.action,
            }
          }
          return item
        })

        updatedData = inventory?.map((item) => {
          if (item?.id === findData?.inventory_id) {
            return {
              ...item,
              qty: findData?.current
            }
          }
          return item
        })
      } else if (findData?.action === 'delete') {
        updatedStock = stock?.filter((item) => item?.id !== id)
      }
    } else {
      if (findData?.action === 'add' || findData?.action === 'update') {
        updatedStock = stock?.filter((item) => item?.id !== id)
      } else if (findData?.action === 'delete') {
        updatedStock = stock.map((item) => {
          if (item?.id === id) {
            return {
              ...item,
              status: "approved",
              action: 'update',
            }
          }
          return item
        })
      }
    }

    setStock(updatedStock)
    setInventory(updatedData)

    return HttpResponse.json({ success: true })
  }),

  // DELETE
  http.delete(`${BASE_URL}/stock/:id`, ({ params }) => {
    const stock = getStock()

    const id = Number(params.id)

    const itemIdx = stock.findIndex((data: StockItem) => data.id === id)

    if (itemIdx === -1) {
      return HttpResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const updatedStock: StockItem[] = stock.map((item, idx) => {
      if (idx === itemIdx) {
        return {
          ...item,
          status: "pending",
          action: "delete",
        }
      }
      return item
    })

    setStock(updatedStock)

    return HttpResponse.json({
      success: true,
      message: "Deletion request submitted",
    })
  }),
]
