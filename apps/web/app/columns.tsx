import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order";
import { MoreHorizontal } from "lucide-react";

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
    cell: ({ row }) => {
      return <div>.</div>;
    },
  },
];
