"use client";
import Header from "@/modules/Header";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../types/order";
import { Container } from "@/components/Container";
import { Table } from "@/components/Table";
import { createOrderColumns } from "./columns";
import { Button } from "@/components/Button";
import { Drawer } from "@/components/Drawer";
import OrderModal from "@/modules/OrderModal";
import { StatCard } from "@/components/StatCard";
import { OrderDetailsModal } from "@/modules/OrderDetailsModal";
import {
  PageHeader,
  HeaderRow,
  PageTitle,
  PageDescription,
  StatsGrid,
  Section,
  VisuallyHidden,
  ErrorMessage,
} from "./styled";
import { TableSkeleton } from "@/components/Skeleton";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const isMobile = useIsMobile();

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

  const handleViewDetails = React.useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);

    window.history.pushState({}, "", `/orders/${order.id}`);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);

    window.history.pushState({}, "", "/");
  }, []);

  const columns = React.useMemo(
    () => createOrderColumns(handleViewDetails),
    [handleViewDetails]
  );

  const handleOrderCreated = () => {
    setIsDrawerOpen(false);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const orderModal = OrderModal({ onSuccess: handleOrderCreated });

  return (
    <>
      <script type="application/ld+json" />

      <Header />
      <main id="main-content">
        <Container>
          <PageHeader>
            <HeaderRow>
              <PageTitle>Orders</PageTitle>
              <Button
                variant="primary"
                size={isMobile ? "sm" : "md"}
                onClick={() => setIsDrawerOpen(true)}
              >
                Create New Order
              </Button>
            </HeaderRow>
            <PageDescription>Manage your orders efficiently</PageDescription>
          </PageHeader>

          <Section aria-labelledby="stats-heading">
            <VisuallyHidden id="stats-heading">Order Statistics</VisuallyHidden>
            <StatsGrid>
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
            </StatsGrid>
          </Section>

          <Section aria-labelledby="orders-heading">
            <VisuallyHidden id="orders-heading">Orders List</VisuallyHidden>

            {isLoading && <TableSkeleton />}
            {isError && (
              <ErrorMessage role="alert">
                Error: {(error as Error).message}
              </ErrorMessage>
            )}
            {!isLoading && !isError && (
              <Table data={orders} columns={columns} />
            )}
          </Section>

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

          <OrderDetailsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            order={selectedOrder}
          />
        </Container>
      </main>
    </>
  );
}
