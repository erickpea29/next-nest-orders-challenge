import styled from "styled-components";

const TableWrapper = styled.div`
  background: #fff;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  margin-top: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    width: calc(100% + 3rem);
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  /* Scrollbar styling for better mobile UX */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  min-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    min-width: 500px;
  }

  @media (max-width: 480px) {
    font-size: 0.6875rem;
    min-width: 450px;
  }
`;

const Thead = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid rgb(242, 244, 247);
`;

const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid rgb(242, 244, 247);
    transition: background 0.15s ease;

    &:hover {
      background: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const Tfoot = styled.tfoot`
  background: #f8fafc;
  border-top: 1px solid rgb(242, 244, 247);
  color: #64748b;
  font-size: 0.8125rem;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.5rem;
    font-size: 0.625rem;

    &:first-child {
      padding-left: 0.75rem;
    }

    &:last-child {
      padding-right: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.375rem;
    font-size: 0.5625rem;
    letter-spacing: 0.025em;
  }
`;

const Td = styled.td`
  padding: 0.875rem 1rem;
  color: #0f172a;

  &:first-child {
    padding-left: 1.5rem;
    font-weight: 500;
  }

  &:last-child {
    padding-right: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;

    &:first-child {
      padding-left: 0.75rem;
    }

    &:last-child {
      padding-right: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.375rem;
    font-size: 0.6875rem;
  }
`;

const RerenderButton = styled.button`
  margin-top: 1rem;
  background: #fff;
  color: #000;
  padding: 0.625rem 1.25rem;
  border: 2px solid #000;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #000;
    color: #fff;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PaginationWrapper = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgb(242, 244, 247);
  background: #fff;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;

    > div {
      justify-content: center;
    }
  }
`;

const PaginationGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
    width: 100%;
  }
`;

const PaginationButton = styled.button`
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  background: #fff;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 44px;
  min-height: 44px;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem;
    min-width: 42px;
    min-height: 42px;
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
    font-size: 0.75rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PageInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #475569;
  white-space: nowrap;
  flex-shrink: 0;

  strong {
    color: #0f172a;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    gap: 0.25rem;
  }

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const PageInput = styled.input`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  border-radius: 6px;
  width: 4rem;
  font-size: 0.875rem;
  text-align: center;
  transition: border-color 0.15s ease;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    width: 3.5rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 5rem;
    padding: 0.625rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.5rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PageSizeSelect = styled.select`
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: #fff;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 640px) {
    padding: 0.625rem 0.75rem;
    width: 100%;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const RowCount = styled.div`
  padding: 0.5rem 1.5rem;
  font-size: 0.8125rem;
  color: #64748b;
  background: #f8fafc;
  border-top: 1px solid rgb(242, 244, 247);
  text-align: right;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  @media (max-width: 640px) {
    text-align: center;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.6875rem;
  }
`;

export {
  TableWrapper,
  StyledTable,
  Thead,
  Tbody,
  Tfoot,
  Th,
  Td,
  RerenderButton,
  PaginationWrapper,
  PaginationControls,
  PaginationGroup,
  PaginationButton,
  PageInfo,
  PageInput,
  PageSizeSelect,
  RowCount,
};
