import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order";
import { MoreHorizontal } from "lucide-react";
import { Dropdown } from "@/components/Dropdown";

export const orderColumns: ColumnDef<Order, any>[] = [
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <Dropdown
        items={[
          {
            label: "View Details",
            onClick: () => console.log("View", row.original),
          },
          {
            label: "Edit Order",
            onClick: () => console.log("Edit", row.original),
          },
          {
            label: "Cancel Order",
            onClick: () => console.log("Cancel", row.original),
            variant: "danger",
            divider: true,
          },
        ]}
      />
    ),
  },
];
