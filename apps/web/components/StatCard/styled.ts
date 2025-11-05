import styled from "styled-components";

const Card = styled.div`
  background: #fff;
  border: 1px solid rgb(242, 244, 247);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const Label = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
`;

const Description = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
`;

const Trend = styled.span<{ $positive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => (props.$positive ? "#059669" : "#dc2626")};
  margin-left: 0.5rem;
`;

export { Card, Label, Value, Description, Trend };
