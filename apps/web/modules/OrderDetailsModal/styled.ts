import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  from {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
`;

const scaleOut = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0;
  }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

export const ModalBackdrop = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  animation: ${({ $isOpen }) => ($isOpen ? fadeIn : fadeOut)} 0.3s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const ModalCard = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: ${({ $isOpen }) => ($isOpen ? scaleIn : scaleOut)} 0.3s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 85vh;
  }

  @media (max-width: 640px) {
    max-width: 92%;
    border-radius: 12px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
  }

  @media (max-width: 640px) {
    padding: 1.25rem;

    h2 {
      font-size: 1.25rem;
    }
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #ffffff;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  flex-shrink: 0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  border-radius: 0 0 16px 16px;

  @media (max-width: 640px) {
    padding: 1.25rem;

    button {
      width: 100%;
    }
  }
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 140px;

  @media (max-width: 640px) {
    min-width: auto;
  }
`;

export const DetailValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0f172a;
  text-align: right;
  word-break: break-word;

  @media (max-width: 640px) {
    text-align: left;
  }
`;

const statusColors = {
  NEW: {
    background: "#dbeafe",
    color: "#1e40af",
    border: "#93c5fd",
  },
  PAID: {
    background: "#d1fae5",
    color: "#065f46",
    border: "#6ee7b7",
  },
  CANCELLED: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "#fecaca",
  },
};

export const StatusBadge = styled.span<{
  $status: "NEW" | "PAID" | "CANCELLED";
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  background: ${({ $status }) => statusColors[$status].background};
  color: ${({ $status }) => statusColors[$status].color};
  border: 1px solid ${({ $status }) => statusColors[$status].border};
`;
