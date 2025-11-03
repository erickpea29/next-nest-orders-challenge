"use client";
import { useState, useEffect } from "react";
import {
  CTAButton,
  HeaderContainer,
  HeaderSpacer,
  LogoContainer,
  LogoImage,
  Nav,
} from "./styled";

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
          <CTAButton
            href="https://github.com/tu-usuario/tu-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver en GitHub
          </CTAButton>
        </Nav>
      </HeaderContainer>
      <HeaderSpacer />
    </>
  );
}
