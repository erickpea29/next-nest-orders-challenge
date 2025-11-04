"use client";
import Header from "@/modules/Header";
import React, { useEffect, useState } from "react";
import { Order } from "../types/order";
import { Container } from "@/components/Container";
import { Table } from "@/components/Table";
import { orderColumns } from "./columns";
import { Button } from "@/components/Button";
import { Drawer } from "@/components/Drawer";
import OrderModal from "@/modules/OrderModal";
import { StatCard } from "@/components/ StatCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API}/orders`);
      const j = await r.json();
      setOrders(j.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const columns = React.useMemo(() => orderColumns, []);

  const handleOrderCreated = () => {
    setIsDrawerOpen(false);
    load();
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
            value="245"
            trend="+8.2%"
            trendPositive={true}
            description="vs last month"
          />
          <StatCard
            label="Paid Orders"
            value="879"
            trend="+5.4%"
            trendPositive={true}
            description="Successfully processed"
          />
          <StatCard
            label="Cancelled Orders"
            value="110"
            trend="-2.1%"
            trendPositive={false}
            description="vs last month"
          />
        </div>

        <Table data={orders} columns={columns} initialPageSize={10} />

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
