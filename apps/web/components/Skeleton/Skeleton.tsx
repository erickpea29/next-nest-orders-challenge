import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const Skeleton = styled.div<{ width?: string; height?: string }>`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '20px'};
  background: linear-gradient(
    to right,
    #f1f5f9 0%,
    #e2e8f0 20%,
    #f1f5f9 40%,
    #f1f5f9 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s linear infinite;
  border-radius: 4px;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: #f1f5f9;
  }
`;

export const TableSkeleton = () => (
  <div aria-label="Loading orders" role="status">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <Skeleton width="20%" height="40px" />
        <Skeleton width="30%" height="40px" />
        <Skeleton width="25%" height="40px" />
        <Skeleton width="25%" height="40px" />
      </div>
    ))}
    <span style={{ position: 'absolute', left: '-10000px' }}>
      Loading orders data...
    </span>
  </div>
);

export const StatCardSkeleton = () => (
  <div aria-label="Loading statistics" role="status">
    <Skeleton width="100%" height="120px" />
    <span style={{ position: 'absolute', left: '-10000px' }}>
      Loading statistics...
    </span>
  </div>
);
