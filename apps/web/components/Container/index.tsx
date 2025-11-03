"use client";

import { ContainerWrapper } from "./styled";

export function Container({ children }: { children: React.ReactNode }) {
  return <ContainerWrapper>{children}</ContainerWrapper>;
}
