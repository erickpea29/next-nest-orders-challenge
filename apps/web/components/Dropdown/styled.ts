import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &:hover:not(:disabled) {
    background: #f8fafc;
    color: #475569;
  }

  &:focus-visible {
    outline: 2px solid rgb(0, 181, 107);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const MenuWrapper = styled.div<{ $position: "left" | "right" }>`
  position: fixed;
  min-width: 200px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  z-index: 1000;
  animation: ${fadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 400px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 640px) {
    min-width: 180px;
  }
`;

export const MenuItem = styled.button<{
  $disabled?: boolean;
  $variant?: "default" | "danger";
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  outline: none;
  color: ${({ $variant = "default" }) =>
    $variant === "danger" ? "#ef4444" : "#475569"};

  .item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .item-label {
    flex: 1;
    white-space: nowrap;
  }

  ${({ $disabled }) =>
    $disabled
      ? css`
          opacity: 0.5;
          cursor: not-allowed;
        `
      : css<{ $variant?: "default" | "danger" }>`
          &:hover {
            background: ${({ $variant = "default" }) =>
              $variant === "danger" ? "#fef2f2" : "#f8fafc"};
            color: ${({ $variant = "default" }) =>
              $variant === "danger" ? "#dc2626" : "#0f172a"};
          }

          &:focus-visible {
            background: ${({ $variant = "default" }) =>
              $variant === "danger" ? "#fef2f2" : "#f1f5f9"};
            outline: 2px solid rgb(0, 181, 107);
            outline-offset: -2px;
          }

          &:active {
            transform: scale(0.98);
          }
        `}

  @media (max-width: 640px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
`;
