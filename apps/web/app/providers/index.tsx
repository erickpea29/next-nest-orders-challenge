"use client";

import { QueryProvider } from "./QueryProvider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryProvider>{children}</QueryProvider> <ToasterProvider />
    </>
  );
}

function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#0f172a",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          padding: "12px 16px",
          fontSize: "0.875rem",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "rgb(0, 181, 107)",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
