import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order";
import { Dropdown } from "@/components/Dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AlertDialog } from "@/components/AlerDialog";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function updateOrderStatus(
  id: string,
  status: "NEW" | "PAID" | "CANCELLED"
): Promise<Order> {
  const res = await fetch(`${API}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API}/orders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete order");
}

type DialogType = "markPaid" | "cancel" | "delete" | null;

function OrderActions({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails?: (order: Order) => void;
}) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState<DialogType>(null);

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "NEW" | "PAID" | "CANCELLED";
    }) => updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      const statusMessages: Record<string, string> = {
        PAID: "Order marked as paid successfully",
        CANCELLED: "Order cancelled successfully",
        NEW: "Order status updated successfully",
      };
      toast.success(
        statusMessages[variables.status] || "Order updated successfully"
      );
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again.");
    },
  });

  const handleMarkAsPaid = () => {
    setDialogOpen("markPaid");
  };

  const handleCancelOrder = () => {
    setDialogOpen("cancel");
  };

  const handleDeleteOrder = () => {
    setDialogOpen("delete");
  };

  const handleConfirmMarkPaid = () => {
    const toastId = toast.loading("Marking order as paid...");
    updateStatusMutation.mutate({ id: order.id, status: "PAID" });
    toast.dismiss(toastId);
    setDialogOpen(null);
  };

  const handleConfirmCancel = () => {
    const toastId = toast.loading("Cancelling order...");
    updateStatusMutation.mutate({ id: order.id, status: "CANCELLED" });
    toast.dismiss(toastId);
    setDialogOpen(null);
  };

  const handleConfirmDelete = () => {
    deleteOrderMutation.mutate(order.id);
    setDialogOpen(null);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(order);
    }
  };

  const items = [];

  items.push({
    label: "View Details",
    onClick: handleViewDetails,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  });

  if (order.status === "NEW") {
    items.push(
      {
        label: "Mark as Paid",
        onClick: handleMarkAsPaid,
        disabled: updateStatusMutation.isPending,
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ),
      },
      {
        label: "Cancel Order",
        onClick: handleCancelOrder,
        disabled: updateStatusMutation.isPending,
        variant: "danger" as const,
        divider: true,
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        ),
      }
    );
  }

  if (order.status === "PAID") {
    items.push({
      label: "Refund (Cancel)",
      onClick: handleCancelOrder,
      disabled: updateStatusMutation.isPending,
      variant: "danger" as const,
      divider: true,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
      ),
    });
  }

  if (order.status === "CANCELLED") {
    items.push({
      label: "Delete Order",
      onClick: handleDeleteOrder,
      disabled: deleteOrderMutation.isPending,
      variant: "danger" as const,
      divider: true,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      ),
    });
  }

  return (
    <>
      <Dropdown items={items} position="left" />

      <AlertDialog
        isOpen={dialogOpen === "markPaid"}
        title="Mark as Paid"
        message={`Are you sure you want to mark order "${order.item}" as paid?`}
        onConfirm={handleConfirmMarkPaid}
        onCancel={() => setDialogOpen(null)}
      />

      <AlertDialog
        isOpen={dialogOpen === "cancel"}
        title={order.status === "PAID" ? "Refund Order" : "Cancel Order"}
        message={`Are you sure you want to ${
          order.status === "PAID" ? "refund" : "cancel"
        } order "${order.item}"?`}
        onConfirm={handleConfirmCancel}
        onCancel={() => setDialogOpen(null)}
      />

      <AlertDialog
        isOpen={dialogOpen === "delete"}
        title="Delete Order"
        message={`Are you sure you want to permanently delete order "${order.item}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(null)}
      />
    </>
  );
}

export const createOrderColumns = (
  onViewDetails?: (order: Order) => void
): ColumnDef<Order, any>[] => [
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${Number(row.original.price).toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colors: Record<string, { bg: string; text: string }> = {
        NEW: { bg: "#dbeafe", text: "#1e40af" },
        PAID: { bg: "#d1fae5", text: "#065f46" },
        CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
        SOLD: { bg: "#e0e7ff", text: "#3730a3" },
        RETURNED: { bg: "#fef3c7", text: "#92400e" },
      };
      const color = colors[status] || { bg: "#f3f4f6", text: "#374151" };
      return (
        <span
          style={{
            display: "inline-block",
            padding: "0.25rem 0.75rem",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: color.bg,
            color: color.text,
          }}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <OrderActions order={row.original} onViewDetails={onViewDetails} />
    ),
  },
];

export const orderColumns = createOrderColumns();
