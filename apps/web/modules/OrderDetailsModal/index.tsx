import React, { useEffect, useState } from "react";
import { Order } from "@/types/order";
import {
  ModalContainer,
  ModalBackdrop,
  ModalCard,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  DetailRow,
  DetailLabel,
  DetailValue,
  StatusBadge,
} from "./styled";
import { Button } from "@/components/Button";

export interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    onClose();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string) => {
    try {
      const numPrice = parseFloat(price);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numPrice);
    } catch {
      return price;
    }
  };

  if (!isVisible || !order) return null;

  return (
    <ModalContainer>
      <ModalBackdrop onClick={handleBackdropClick} $isOpen={isAnimating} />
      <ModalCard onClick={handleCardClick} $isOpen={isAnimating}>
        <ModalHeader>
          <h2>Order Details</h2>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DetailRow>
            <DetailLabel>ID</DetailLabel>
            <DetailValue>{order.id}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Item Name</DetailLabel>
            <DetailValue>{order.item}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>
              <StatusBadge $status={order.status}>{order.status}</StatusBadge>
            </DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Amount</DetailLabel>
            <DetailValue>{formatPrice(order.price)}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Created At</DetailLabel>
            <DetailValue>{formatDate(order.createdAt)}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Updated At</DetailLabel>
            <DetailValue>{formatDate(order.updatedAt)}</DetailValue>
          </DetailRow>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalContainer>
  );
}
