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
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  min-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
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

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.6875rem;

    &:first-child {
      padding-left: 1rem;
    }

    &:last-child {
      padding-right: 1rem;
    }
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

  @media (max-width: 640px) {
    padding: 0.75rem 0.75rem;

    &:first-child {
      padding-left: 1rem;
    }

    &:last-child {
      padding-right: 1rem;
    }
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
  padding: 1rem 0rem;
  border-top: 1px solid rgb(242, 244, 247);
  background: #fff;

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.375rem;
    font-size: 0.8125rem;
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

  @media (max-width: 640px) {
    padding: 0.375rem 0.5rem;
    min-width: 40px;
    min-height: 40px;
    font-size: 0.8125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PageInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #475569;
  margin-left: 0.5rem;

  strong {
    color: #0f172a;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    margin-left: 0.25rem;
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

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 640px) {
    width: 3.5rem;
    padding: 0.375rem;
    font-size: 0.8125rem;
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

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 640px) {
    padding: 0.375rem 0.5rem;
    font-size: 0.8125rem;
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

  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
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
  PaginationButton,
  PageInfo,
  PageInput,
  PageSizeSelect,
  RowCount,
};
