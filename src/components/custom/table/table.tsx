/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ArrowUpDown } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"

import { Props } from '.'

export function BaseTable<T>({
  data,
  columns,
  onSort,
  renderActions,
  page,
  totalPages,
  setPage,
  isDisplayPagination,
}: Props<T>) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>
                {col.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort?.(col.key)}
                  >
                    {col.header}
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}

            {renderActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render
                    ? col.render(row)
                    : (row as any)[col.key]}
                </TableCell>
              ))}

              {renderActions && (
                <TableCell>{renderActions(row, i)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isDisplayPagination && (totalPages ?? 0) > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => (page ?? 0) > 0 && (setPage && setPage((page ?? 0) - 1))}
                className={
                  page === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-4 text-sm">
                Page {page ?? 0 + 1} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  (page ?? 0) < (totalPages ?? 0) && (setPage && setPage((page ?? 0) + 1))
                }
                className={
                  ((page ?? 0) + 1) === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  )
}
