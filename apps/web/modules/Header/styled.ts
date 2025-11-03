import styled from "styled-components";

const HeaderContainer = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 1)"};
  backdrop-filter: ${(props) => (props.$isScrolled ? "blur(10px)" : "none")};
  box-shadow: ${(props) =>
    props.$isScrolled ? "0 2px 20px rgba(0, 0, 0, 0.05)" : "none"};
  border-bottom: 1px solid rgb(242, 244, 247);
`;

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const LogoContainer = styled.div`
  cursor: pointer;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;

  @media (max-width: 768px) {
    height: 32px;
  }
`;

const CTAButton = styled.a`
  background: #fff;
  color: #000;
  padding: 0.875rem 2rem;
  border: 2px solid #000;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: #000;
    color: #fff;
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
  }
`;

const HeaderSpacer = styled.div`
  height: 88px;

  @media (max-width: 768px) {
    height: 72px;
  }
`;
export {
  HeaderContainer,
  Nav,
  LogoContainer,
  LogoImage,
  CTAButton,
  HeaderSpacer,
};
