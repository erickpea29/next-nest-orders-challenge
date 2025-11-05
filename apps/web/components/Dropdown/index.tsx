import React, { useEffect, useRef, useState } from "react";
import {
  DropdownContainer,
  TriggerButton,
  MenuWrapper,
  MenuItem,
  MenuDivider,
} from "./styled";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "danger";
  divider?: boolean;
}

export interface DropdownProps {
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  items: DropdownItem[];
  position?: "left" | "right";
  disabled?: boolean;
}

export function Dropdown({
  triggerLabel,
  triggerIcon,
  items,
  position = "right",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 200;
      const spacing = 8;

      let left = 0;
      if (position === "right") {
        left = triggerRect.right - menuWidth;
      } else {
        left = triggerRect.left;
      }

      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 16;
      }

      if (left < 16) {
        left = 16;
      }

      setMenuPosition({
        top: triggerRect.bottom + spacing,
        left: left,
      });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const menuItems = menuRef.current?.querySelectorAll(
        '[role="menuitem"]:not([disabled])'
      );
      if (!menuItems || menuItems.length === 0) return;

      const currentIndex = Array.from(menuItems).findIndex(
        (item) => item === document.activeElement
      );

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        (menuItems[nextIndex] as HTMLElement).focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex =
          currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
        (menuItems[prevIndex] as HTMLElement).focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onClick();
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <TriggerButton
        ref={triggerRef}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={triggerLabel || "Open menu"}
      >
        {triggerIcon && <span className="icon">{triggerIcon}</span>}
        {triggerLabel && <span>{triggerLabel}</span>}
        {!triggerIcon && !triggerLabel && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        )}
      </TriggerButton>

      {isOpen && (
        <MenuWrapper
          ref={menuRef}
          $position={position}
          role="menu"
          aria-orientation="vertical"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <MenuDivider />}
              <MenuItem
                role="menuitem"
                tabIndex={item.disabled ? -1 : 0}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                $disabled={item.disabled}
                $variant={item.variant || "default"}
              >
                {item.icon && <span className="item-icon">{item.icon}</span>}
                <span className="item-label">{item.label}</span>
              </MenuItem>
            </React.Fragment>
          ))}
        </MenuWrapper>
      )}
    </DropdownContainer>
  );
}
