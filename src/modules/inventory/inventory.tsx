'use client'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { InventoryTable } from "./table";

import { useInventoryStore } from "@/store";

export const InventoryComponent = () => {
  const {
    setSearch,
    activeTab,
    setActiveTab,
  } = useInventoryStore()

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
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-50"
        />
      </div>

      <InventoryTable />
    </div>
  );
}
