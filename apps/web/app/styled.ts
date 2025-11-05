import styled from "styled-components";

export const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    button {
      width: 100%;
    }
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #0f172a;
  word-break: break-word;
  max-width: 100%;
`;

export const PageDescription = styled.p`
  margin-top: 0.5rem;
  margin-bottom: 0;
  color: #64748b;
  font-size: 1rem;

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Section = styled.section`
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const VisuallyHidden = styled.h2`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export const ErrorMessage = styled.p`
  color: #ef4444;
  padding: 1rem;
  background: #fee2e2;
  border-radius: 8px;
  border: 1px solid #fca5a5;
`;
