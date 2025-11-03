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
        <Nav>
          <LogoContainer>
            <LogoImage src="/images/logo.avif" alt="Logo" />
          </LogoContainer>
          <Button variant="secondary" size="md">
            Ver en GitHub
          </Button>
        </Nav>
      </HeaderContainer>
      <HeaderSpacer />
    </>
  );
}
