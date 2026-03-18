"use client"
import React, { useMemo, useState } from "react"
import moment from "moment"

import {
  History,
  Check,
  X,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { InventoryItem, StockItem } from "@/types"
import { useInventoryStore } from "@/store"
import { formatCurrency } from "@/lib/helper"

export const ViewInventoryDialog = () => {
  const {
    stockData,
    selected,
    setSelected,
    isOpenModal,
    modalType,
    setIsOpenModal,
    setModalType,
    isEditStock,
    setIsEditStock,
  } = useInventoryStore()

  const data = useMemo(() => {
    return [
      {
        label: 'Name',
        value: selected?.name,
      },
      {
        label: 'SKU',
        value: selected?.sku,
      },
      {
        label: 'Category',
        value: selected?.category,
      },
      {
        label: 'Quantity',
        value: selected?.qty,
      },
      {
        label: 'Price',
        value: formatCurrency(selected?.price || 0),
      },
      {
        label: 'Last Updated',
        value: moment(selected?.updatedAt).format('DD MMM YYYY HH:mm'),
      },
    ]
  }, [selected])

  const handleChange = (name: string, value: number | string) => {
    setSelected({
      ...selected as InventoryItem,
      [name]: Number(value),
    })
  }

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setModalType('')
      setIsOpenModal(false)
      setSelected(null)
      setIsEditStock(false)
    }
  }

  return (
    <Dialog
      open={isOpenModal && modalType === 'view'}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">{selected?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-4">
          {data?.map((item: { label: string, value: string | number | undefined }, index: number) => (
            <div key={`data-${index}`} className="grid grid-cols-2 items-center">
              <div className="flex justify-between pr-2 items-center">
                <span>{item?.label}</span>
                <span>:</span>
              </div>
              <div className="flex justify-between items-center">
                {item?.label === 'Quantity' ? isEditStock ? (
                  <div className="flex items-center gap-x-3">
                    <Input
                      type="number"
                      name="qty"
                      value={selected?.qty || 0}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event?.target?.name, event?.target?.value)}
                      placeholder="Quantity"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <div className="flex gap-x-2 items-center">
                      <Check
                        onClick={() => setIsEditStock(!isEditStock)}
                        className="cursor-pointer text-green-600"
                        size={14}
                      />
                      <X
                        onClick={() => setIsEditStock(!isEditStock)}
                        className="cursor-pointer text-red-500"
                        size={14}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full justify-between items-center">
                    <span>{item?.value}</span>
                    <div className="flex gap-x-2 items-center">
                      <button
                        onClick={() => setIsEditStock(true)}
                        className="underline cursor-pointer"
                      >
                        Edit
                      </button>
                      {stockData?.filter((stock: StockItem) => stock?.inventory_id === selected?.id)?.length > 0 ? (
                        <History
                          className="cursor-pointer"
                          size={16}
                          onClick={() => {
                            setIsOpenModal(true)
                            setModalType('history')
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : item?.value}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
