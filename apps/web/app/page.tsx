"use client";
import Header from "@/modules/Header";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Order } from "../types/order";
import { StatCard } from "@/components/ StatCard";
import { Container } from "@/components/Container";
import { Table } from "@/components/Table";
import { orderColumns } from "./columns";
import { Button } from "@/components/Button";

const schema = z.object({
  item: z.string().min(1),
  price: z.coerce.number().positive(),
  status: z.enum(["NEW", "PAID", "CANCELLED"]),
});

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ item: "", price: "", status: "NEW" });

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

  async function create() {
    setError(null);
    const parsed = schema.safeParse({
      item: form.item,
      price: form.price,
      status: form.status as any,
    });
    if (!parsed.success) {
      setError("Invalid input");
      return;
    }
    await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(parsed.data),
    });
    setForm({ item: "", price: "", status: "NEW" });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const columns = React.useMemo(() => orderColumns, []);

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
          <Button variant="primary" size="md">
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
      </Container>
    </>
  );
}
