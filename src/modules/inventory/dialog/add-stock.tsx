"use client"

import React, { useEffect, useMemo, useState } from "react"
import moment from "moment"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useInventoryStore } from "@/store"
import { StockItem } from "@/types"

export const AddStockDialog = () => {
  const {
    isOpenModal,
    modalType,
    setIsOpenModal,
    setModalType,
    updateItem,
    selected,
    setSelected,
    stockData,
    fetchAllData,
    allData,
  } = useInventoryStore()

  const [qty, setQty] = useState<number>(0)

  const onClose = () => {
    setIsOpenModal(false)
    setModalType("")
    setQty(0)
  }

  const stocks = useMemo(() => {
    return stockData?.filter((stock: StockItem) => stock?.inventory_id === selected?.id)
  }, [stockData, selected])

  const handleSubmit = async () => {
    await updateItem(selected?.id || 0, {
      id: undefined,
      inventory_id: selected?.id,
      status: 'pending',
      action: stocks?.length > 0 ? 'update' : 'add',
      prev: selected?.qty,
      current: Number(qty),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    })

    onClose()
  }

  useEffect(() => {
    fetchAllData()
  }, [isOpenModal])

  return (
    <Dialog
      open={isOpenModal && modalType === "add"}
      onOpenChange={onClose}
    >
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* SELECT INVENTORY */}
          <div>
            <label className="text-sm">Inventory</label>
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={selected?.id ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value)

                const found = allData?.find((item) => item.id === id) ?? null

                setSelected(found)
              }}
            >
              <option value="">Select Item</option>
              {allData?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* QUANTITY */}
          <div>
            <label className="text-sm">Quantity</label>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
