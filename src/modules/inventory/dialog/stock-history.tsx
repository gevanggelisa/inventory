"use client"
import React, { useMemo, useState } from "react"
import moment from "moment"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { StockItem } from "@/types"
import { useInventoryStore } from "@/store"
import { StockChart } from "../chart/stock"
import { BaseTable } from "@/components"
import { setStock } from "@/msw/storage"

export const ViewStockHistoryDialog = () => {
  const {
    selected,
    isOpenModal,
    modalType,
    setIsOpenModal,
    stockData,
    buildChartData,
    setModalType,
    setStockData,
  } = useInventoryStore()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

  const [startDate, setStartDate] = useState(
    moment().subtract(1, "month").format("YYYY-MM-DD")
  )

  const [endDate, setEndDate] = useState(
    moment().format("YYYY-MM-DD")
  )

  const historyData = useMemo(() => {
    let data = stockData
      ?.filter((item) => item.inventory_id === selected?.id)

    if (startDate) {
      data = data?.filter((item) =>
        moment(item.createdAt).isSameOrAfter(startDate, "day")
      )
    }

    if (endDate) {
      data = data?.filter((item) =>
        moment(item.createdAt).isSameOrBefore(endDate, "day")
      )
    }

    return data?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
  }, [stockData, selected, startDate, endDate])

  const chartData = useMemo(() => {
    return buildChartData(selected?.id ?? 0, historyData)
  }, [selected, buildChartData, historyData])

  const handleSave = (row: StockItem) => {
    const updated = stockData.map((item) => {
      if (item.id === row.id) {
        return {
          ...item,
          current: editValue,
          status: "pending",
          action: "update",
        }
      }
      return item
    })

    setStock(updated as StockItem[])
    setStockData(updated as StockItem[])

    setEditingId(null)
  }

  const handleEdit = (row: StockItem) => {
    setEditingId(row.id)
    setEditValue(row.current)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDelete = (row: StockItem) => {
    const updated = stockData.map((item) => {
      if (item.id === row.id) {
        return {
          ...item,
          status: "pending",
          action: "delete",
        }
      }
      return item
    })

    setStock(updated as StockItem[])
    setStockData(updated as StockItem[])
  }

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsOpenModal(true)
      setModalType('view')
    }
  }

  return (
    <Dialog
      open={isOpenModal && modalType === 'history'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-full min-w-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-semibold">Stock History</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <Input
            type="date"
            value={startDate}
            max={endDate || moment().format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* END DATE */}
          <Input
            type="date"
            value={endDate}
            min={startDate}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="h-62.5">
          <StockChart data={chartData} />
        </div>

        <div className="pt-10">
          <BaseTable
            data={historyData}
            columns={[
              { key: "createdAt", header: "Date", render: (item) => moment(item.createdAt).format("DD MMM YYYY") },
              { key: "prev", header: "Previous" },
              {
                key: "current",
                header: "Current",
                render: (item: StockItem) => {
                  const isEditing = editingId === item.id

                  return isEditing ? (
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  ) : (
                    item.current
                  )
                },
              },
              { key: "status", header: "Status",
                render: (item) => (
                  <div>
                    {item?.status === 'pending' ? `${item?.status} - ${item?.action}` : item?.status}
                  </div>
                )
              },
            ]}
            renderActions={(row, index) => {
              const isLatest = index === 0
              const isEditing = editingId === row.id

              if (!isLatest) {
                return <span className="text-gray-400">-</span>
              }

              return (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="text-green-600 cursor-pointer"
                        onClick={() => handleSave(row)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 cursor-pointer"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {row?.action !== 'delete' ? (
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEdit(row)}
                        >
                          Edit
                        </button>
                      ) : null}

                      {row?.action !== 'delete' && row?.status !== 'pending' ? (
                        <button
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(row)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              )
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
