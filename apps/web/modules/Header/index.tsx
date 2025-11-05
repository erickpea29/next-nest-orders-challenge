"use client";
import { useState, useEffect } from "react";
import {
  HeaderContainer,
  HeaderSpacer,
  LogoContainer,
  LogoImage,
  Nav,
} from "./styled";
import { Button } from "@/components/Button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <HeaderContainer $isScrolled={isScrolled}>
        <Nav role="navigation" aria-label="Main navigation">
          <LogoContainer href="/" aria-label="Orders Management - Home">
            <LogoImage
              src="/images/logo.avif"
              alt="Orders Management Logo"
              width={40}
              height={40}
              loading="eager"
            />
          </LogoContainer>
          <a
            href="https://github.com/erickpea29/next-nest-orders-challenge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View project on GitHub (opens in new window)"
            style={{
              textDecoration: 'none',
            }}
          >
            <Button variant="secondary" size="md">
              Ver en GitHub
            </Button>
          </a>
        </Nav>
      </HeaderContainer>
      <HeaderSpacer />
    </>
  );
}
