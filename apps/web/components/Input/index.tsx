import React from "react";
import {
  InputWrapper,
  Label,
  StyledInput,
  ErrorMessage,
  InputContainer,
} from "./styled";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  disabled,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <InputContainer>
        <StyledInput
          id={inputId}
          $hasError={!!error}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </InputContainer>
      {error && (
        <ErrorMessage id={`${inputId}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
      {!error && helperText && (
        <ErrorMessage as="span" style={{ color: "#64748b" }}>
          {helperText}
        </ErrorMessage>
      )}
    </InputWrapper>
  );
}
