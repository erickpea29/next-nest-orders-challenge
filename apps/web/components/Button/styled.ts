import styled, { css, keyframes } from "styled-components";
import { ButtonProps } from ".";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const variantStyles = {
  primary: css`
    background: rgb(0, 181, 107);
    color: #ffffff;
    border: 2px solid transparent;
    box-shadow: 0 4px 12px rgba(0, 181, 107, 0.3);

    &:hover:not(:disabled) {
      background: #ffffff;
      color: rgb(0, 181, 107);
      border-color: rgb(0, 181, 107);
      box-shadow: 0 6px 16px rgba(0, 181, 107, 0.2);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 181, 107, 0.15);
    }
  `,
  secondary: css`
    background: #ffff;
    color: #000;
    border: 1px solid;
    box-shadow: 0 2px 8px rgba(100, 116, 139, 0.2);

    &:hover:not(:disabled) {
      background: #000;
      color: #ffff;
      border-color: #000;
      box-shadow: 0 4px 12px rgba(100, 116, 139, 0.2);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(100, 116, 139, 0.15);
    }
  `,
  outline: css`
    background: transparent;
    color: rgb(0, 181, 107);
    border: 2px solid rgb(0, 181, 107);

    &:hover:not(:disabled) {
      background: rgb(0, 181, 107);
      color: #ffffff;
      border-color: rgb(0, 181, 107);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      background: rgb(0, 165, 97);
    }
  `,
  ghost: css`
    background: transparent;
    color: #334155;
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background: #ffffff;
      color: #1e293b;
      border-color: #e2e8f0;
    }

    &:active:not(:disabled) {
      background: #f8fafc;
    }
  `,
  danger: css`
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #ffffff;
    border: 2px solid transparent;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

    &:hover:not(:disabled) {
      background: #ffffff;
      color: #ef4444;
      border-color: #ef4444;
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.2);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 20px;
  `,
  md: css`
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    border-radius: 28px;
  `,
  lg: css`
    padding: 1.125rem 2.25rem;
    font-size: 1.125rem;
    border-radius: 32px;
  `,
};

export const StyledButton = styled.button<{
  $variant: ButtonProps["variant"];
  $size: ButtonProps["size"];
  $fullWidth?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  outline: none;

  ${({ $variant = "primary" }) => variantStyles[$variant]}
  ${({ $size = "md" }) => sizeStyles[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus-visible {
    outline: 2px solid rgb(0, 181, 107);
    outline-offset: 2px;
  }
`;

export const ButtonContent = styled.span<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  transition: opacity 0.2s ease;

  .icon-left,
  .icon-right {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Spinner = styled.span`
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;
