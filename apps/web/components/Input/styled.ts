import styled, { css } from "styled-components";

export const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.25rem;
  transition: color 0.2s ease;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-family: system-ui, -apple-system, sans-serif;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#ef4444" : "#e2e8f0")};
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ $hasError }) => ($hasError ? "#dc2626" : "#cbd5e1")};
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? "#ef4444" : "rgb(0, 181, 107)"};
    box-shadow: ${({ $hasError }) =>
      $hasError
        ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
        : "0 0 0 3px rgba(0, 181, 107, 0.1)"};
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }

  /* Estilos específicos para diferentes tipos */
  &[type="number"] {
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &[type="password"] {
    letter-spacing: 0.05em;
  }

  /* Autocompletado */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
    -webkit-text-fill-color: #0f172a;
    border-color: ${({ $hasError }) =>
      $hasError ? "#ef4444" : "rgb(0, 181, 107)"};
  }

  @media (max-width: 640px) {
    padding: 0.625rem 0.875rem;
    font-size: 1rem; /* 16px para evitar zoom en iOS */
  }
`;

export const ErrorMessage = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #ef4444;
  margin-top: 0.25rem;

  &::before {
    content: "⚠";
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;
