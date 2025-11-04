"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/types/order";
import { OrderDetailsModal } from "@/modules/OrderDetailsModal";
import Header from "@/modules/Header";
import { Container } from "@/components/Container";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`${API}/orders/${id}`, {
    method: "GET",
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Order not found");
    }
    throw new Error("Failed to fetch order");
  }
  return res.json();
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  console.log(orderId);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });

  const handleClose = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              fontSize: "1.125rem",
              color: "#64748b",
            }}
          >
            Loading order details...
          </div>
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <Container>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#ef4444",
              }}
            >
              Error Loading Order
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#64748b",
              }}
            >
              {(error as Error).message}
            </div>
            <button
              onClick={() => router.push("/")}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                background: "rgb(0, 181, 107)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Orders
            </button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <OrderDetailsModal
          isOpen={true}
          onClose={handleClose}
          order={order || null}
        />
      </Container>
    </>
  );
}
