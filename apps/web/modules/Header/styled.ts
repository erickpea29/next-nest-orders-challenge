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

const HeaderSpacer = styled.div`
  height: 88px;

  @media (max-width: 768px) {
    height: 72px;
  }
`;
export { HeaderContainer, Nav, LogoContainer, LogoImage, HeaderSpacer };
