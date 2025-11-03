import styled, { css, keyframes } from "styled-components";

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

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

export const DrawerBackdrop = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  animation: ${({ $isOpen }) => ($isOpen ? fadeIn : fadeOut)} 0.6s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const sizeStyles = {
  sm: css`
    max-width: 400px;

    @media (max-width: 640px) {
      max-width: 100%;
      width: 85%;
    }
  `,
  md: css`
    max-width: 500px;

    @media (max-width: 768px) {
      max-width: 100%;
      width: 90%;
    }
  `,
  lg: css`
    max-width: 700px;

    @media (max-width: 1024px) {
      max-width: 100%;
      width: 95%;
    }
  `,
  full: css`
    width: 100%;
    max-width: 100%;
  `,
};

export const DrawerContent = styled.div<{
  $isOpen: boolean;
  $size: "sm" | "md" | "lg" | "full";
}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  animation: ${({ $isOpen }) => ($isOpen ? slideIn : slideOut)} 0.6s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;

  ${({ $size }) => sizeStyles[$size]}

  @media (max-width: 640px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0f172a;
  }

  @media (max-width: 640px) {
    padding: 1rem;

    h2 {
      font-size: 1.125rem;
    }
  }
`;

export const DrawerBody = styled.div`
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
    padding: 1rem;
  }
`;

export const DrawerFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  flex-shrink: 0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    padding: 1rem;
    flex-direction: column-reverse;

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
  border-radius: 6px;
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
