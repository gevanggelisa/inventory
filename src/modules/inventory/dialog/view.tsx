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

import { StockItem } from "@/types"
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
    updateItem,
    setIsEditStock,
  } = useInventoryStore()

  const [qty, setQty] = useState<number>(selected?.qty || 0)

  const stocks = useMemo(() => {
    return stockData?.filter((stock: StockItem) => stock?.inventory_id === selected?.id)
  }, [stockData, selected])

  const data = useMemo(() => {
    const pendingStock = stocks?.find((stock) => stock?.status === 'pending')

    return [
      {
        label: 'Name',
        value: selected?.name,
        is_display: true,
      },
      {
        label: 'SKU',
        value: selected?.sku,
        is_display: true,
      },
      {
        label: 'Category',
        value: selected?.category,
        is_display: true,
      },
      {
        label: 'Quantity',
        value: selected?.qty,
        is_display: true,
      },
      {
        label: 'Current Quantity',
        value: pendingStock?.current,
        is_display: !!pendingStock,
      },
      {
        label: 'Status',
        value: `${pendingStock?.status} - ${pendingStock?.action}`,
        is_display: !!pendingStock,
      },
      {
        label: 'Price',
        value: formatCurrency(selected?.price || 0),
        is_display: true,
      },
      {
        label: 'Last Updated',
        value: moment(selected?.updatedAt).format('DD MMM YYYY HH:mm'),
        is_display: true,
      },
    ]?.filter((item) => Boolean(item?.is_display))
  }, [selected, stocks])

  const handleSave = async() => {
    updateItem(selected?.id ?? 0, {
      id: undefined,
      inventory_id: selected?.id,
      status: 'pending',
      action: stocks?.length > 0 ? 'update' : 'add',
      prev: selected?.qty,
      current: Number(qty),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    })

    setIsEditStock(false)
    setQty(0)
  }

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setModalType('')
      setIsOpenModal(false)
      setSelected(null)
      setIsEditStock(false)
      setQty(0)
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
                      value={qty || 0}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQty(Number(event?.target?.value))}
                      placeholder="Quantity"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <div className="flex gap-x-2 items-center">
                      <Check
                        onClick={handleSave}
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
                        onClick={() => {
                          setIsEditStock(true)
                          setQty(selected?.qty || 0)
                        }}
                        className="underline cursor-pointer"
                      >
                        Edit
                      </button>
                      {stocks?.length > 0 ? (
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
