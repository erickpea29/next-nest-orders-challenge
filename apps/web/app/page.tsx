"use client";
import Header from "@/modules/Header";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../types/order";
import { Container } from "@/components/Container";
import { Table } from "@/components/Table";
import { orderColumns } from "./columns";
import { Button } from "@/components/Button";
import { Drawer } from "@/components/Drawer";
import OrderModal from "@/modules/OrderModal";
import { StatCard } from "@/components/ StatCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.data;
}

export default function Page() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const counts = React.useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        if (order.status === "NEW") acc.new++;
        else if (order.status === "PAID") acc.paid++;
        else if (order.status === "CANCELLED") acc.cancelled++;
        return acc;
      },
      { new: 0, paid: 0, cancelled: 0 }
    );
  }, [orders]);

  const columns = React.useMemo(() => orderColumns, []);

  const handleOrderCreated = () => {
    setIsDrawerOpen(false);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const orderModal = OrderModal({ onSuccess: handleOrderCreated });

  return (
    <>
      <Header />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Orders</h1>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsDrawerOpen(true)}
          >
            Create New Order
          </Button>
        </div>
        <p style={{ marginTop: "0.5rem" }}>Manage your orders efficiently</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <StatCard
            label="New Orders"
            value={counts.new.toString()}
            trend="+8.2%"
            trendPositive={true}
            description="vs last month"
          />
          <StatCard
            label="Paid Orders"
            value={counts.paid.toString()}
            trend="+5.4%"
            trendPositive={true}
            description="Successfully processed"
          />
          <StatCard
            label="Cancelled Orders"
            value={counts.cancelled.toString()}
            trend="-2.1%"
            trendPositive={false}
            description="vs last month"
          />
        </div>

        {isLoading && <p>Loading orders...</p>}
        {isError && (
          <p style={{ color: "red" }}>Error: {(error as Error).message}</p>
        )}
        {!isLoading && !isError && (
          <Table data={orders} columns={columns} initialPageSize={10} />
        )}

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Create New Order"
          size="md"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setIsDrawerOpen(false)}
                disabled={orderModal.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={orderModal.handleSubmit}
                loading={orderModal.isSubmitting}
              >
                Save Order
              </Button>
            </>
          }
        >
          {orderModal.form}
        </Drawer>
      </Container>
    </>
  );
}
