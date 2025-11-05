import React, { useEffect, useState, useRef } from "react";
import FocusTrap from "focus-trap-react";
import {
  DrawerContainer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  CloseButton,
} from "./styled";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  showCloseButton = true,
}: DrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setIsVisible(true);

      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);

      const timer = setTimeout(() => {
        setIsVisible(false);

        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 600);
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
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <DrawerContainer>
      <DrawerBackdrop onClick={handleBackdropClick} $isOpen={isAnimating} />
      <FocusTrap active={isOpen}>
        <DrawerContent
          $isOpen={isAnimating}
          $size={size}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "drawer-title" : undefined}
        >
          {(title || showCloseButton) && (
            <DrawerHeader>
              {title && <h2 id="drawer-title">{title}</h2>}
              {showCloseButton && (
                <CloseButton onClick={onClose} aria-label="Close drawer">
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
              )}
            </DrawerHeader>
          )}
          <DrawerBody>{children}</DrawerBody>
          {footer && <DrawerFooter>{footer}</DrawerFooter>}
        </DrawerContent>
      </FocusTrap>
    </DrawerContainer>
  );
}
