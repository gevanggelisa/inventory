'use client'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { InventoryTable } from "./table";
import { AddStockDialog } from "./dialog";

import { useInventoryStore, useRoleStore } from "@/store";
import { Button } from "@/components/ui/button";

export const InventoryComponent = () => {
  const {
    setSearch,
    activeTab,
    setActiveTab,
    setIsOpenModal,
    setModalType,
  } = useInventoryStore()
  const { role } = useRoleStore()

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "all" | "pending")}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {role === 'officer' ? (
                <TabsTrigger value="pending">Pending</TabsTrigger>
              ) : null}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-x-2 items-center">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-50"
          />

          <Button
            className="cursor-pointer"
            onClick={() => {
              setIsOpenModal(true)
              setModalType('add')
            }}
          >
            Add Stock
          </Button>
        </div>
      </div>

      <InventoryTable />
      <AddStockDialog />
    </div>
  );
}
