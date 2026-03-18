/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { Suspense, useEffect, useMemo } from "react"

import { BaseTable, Column } from "@/components"
import { ViewStockHistoryDialog, ViewInventoryDialog } from "./dialog"

import { formatCurrency } from "@/lib/helper"
import { useInventoryStore } from "@/store"
import { InventoryTableItem } from "@/types"

export const InventoryTable = () => {
  const {
    fetchData,
    setSort,
    data,
    page,
    setPage,
    totalPage,
    search,
    sortBy,
    order,
    setSelected,
    setIsOpenModal,
    setModalType,
    activeTab,
    approveRejectItem,
  } = useInventoryStore()

  useEffect(() => {
    fetchData()
  }, [page, search, sortBy, order, activeTab])

  const renderTableHeader = useMemo<Column<InventoryTableItem>[]>(() => {
    const base: Column<InventoryTableItem>[] = [
      { key: "name", header: "Name", sortable: true },
      { key: "sku", header: "SKU", sortable: true },
      { key: "category", header: "Category", sortable: true },
      { key: "qty", header: "Qty", sortable: true },
      {
        key: "price",
        header: "Price",
        sortable: true,
        render: (item) => formatCurrency(item?.price),
      },
    ]

    if (activeTab === 'all') {
      return base
    } else {
      return [...base,
        { key: "status", header: 'Status', render: (item: InventoryTableItem) => (
          <div>
            {item?.status} - {item?.action}
          </div>
        ) }]
    }
  }, [activeTab])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BaseTable
        data={data}
        onSort={setSort}
        columns={renderTableHeader}
        renderActions={(row) => (
          <div className="flex gap-2">
            {activeTab === 'all' ? (
              <>
                <button
                  onClick={() => {
                    setSelected(row)
                    setIsOpenModal(true)
                    setModalType('view')
                  }}
                  className="cursor-pointer text-blue-500"
                >
                  View
                </button>
                <button
                  className="cursor-pointer text-red-500"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => approveRejectItem(row?.id, 'approved')}
                  className="cursor-pointer text-green-500"
                >
                  Approve
                </button>
                <button
                  className="cursor-pointer text-red-500"
                  onClick={() => approveRejectItem(row?.id, 'rejected')}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        )}
        page={page}
        setPage={setPage}
        totalPages={totalPage}
      />

      <ViewInventoryDialog />
      <ViewStockHistoryDialog />
    </Suspense>
  )
}
