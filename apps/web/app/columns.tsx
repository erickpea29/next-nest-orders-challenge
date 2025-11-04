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
    cell: ({ row }: any) => {
      const order = row.original;
      const items = [];

      items.push({
        label: "View Details",
        onClick: () => console.log("View Details:", order),
      });

      if (order.status === "NEW") {
        items.push(
          {
            label: "Mark as Paid",
            onClick: () => console.log("Mark as Paid:", order.id, order),
          },
          {
            label: "Cancel Order",
            onClick: () => console.log("Cancel Order:", order.id, order),
            variant: "danger",
            divider: true,
          }
        );
      }

      if (order.status === "PAID") {
        items.push({
          label: "Refund (Cancel)",
          onClick: () => console.log("Refund/Cancel:", order.id, order),
          variant: "danger",
          divider: true,
        });
      }

      if (order.status === "CANCELLED") {
        items.push({
          label: "Delete Order",
          onClick: () => console.log("Delete Order:", order.id, order),
          variant: "danger",
          divider: true,
        });
      }

      return <Dropdown items={items} />;
    },
  },
];
