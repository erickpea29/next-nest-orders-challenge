import { Input } from "@/components/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const orderSchema = z.object({
  item: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name must be less than 100 characters")
    .trim()
    .refine((val) => val.length > 0, "Item name cannot be only whitespace"),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a valid number",
    })
    .positive("Price must be greater than 0")
    .max(999999.99, "Price must be less than 1,000,000")
    .finite("Price must be a finite number")
    .refine((val) => {
      const decimals = val.toString().split(".")[1];
      return !decimals || decimals.length <= 2;
    }, "Price can have at most 2 decimal places"),
  status: z.enum(["NEW", "PAID", "CANCELLED"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status selected",
  }),
});

interface OrderModalProps {
  onSuccess: () => void;
}

export default function OrderModal({ onSuccess }: OrderModalProps) {
  const [form, setForm] = useState({
    item: "",
    price: "",
    status: "NEW",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      const parsed = orderSchema.safeParse({
        item: form.item,
        price: form.price,
        status: form.status,
      });

      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the validation errors");
        setIsSubmitting(false);
        return;
      }

      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network.");
      }

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      if (!API || !isValidUrl(API)) {
        throw new Error("Invalid API configuration");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(`${API}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify(parsed.data),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = "Failed to create order";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {}

          switch (response.status) {
            case 400:
              throw new Error(errorMessage || "Invalid request data");
            case 401:
              throw new Error("Unauthorized. Please log in again.");
            case 403:
              throw new Error("You don't have permission to create orders");
            case 404:
              throw new Error("API endpoint not found");
            case 409:
              throw new Error("Order already exists (duplicate detected)");
            case 422:
              throw new Error(errorMessage || "Validation failed on server");
            case 429:
              throw new Error("Too many requests. Please try again later.");
            case 500:
              throw new Error("Server error. Please try again later.");
            case 503:
              throw new Error("Service temporarily unavailable");
            default:
              throw new Error(errorMessage);
          }
        }

        let responseData;
        try {
          responseData = await response.json();
        } catch {
          throw new Error("Invalid response from server");
        }

        if (!responseData || typeof responseData !== "object") {
          throw new Error("Invalid response format from server");
        }

        setForm({ item: "", price: "", status: "NEW" });
        toast.success("Order created successfully!");
        onSuccess();
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        if (fetchError.name === "AbortError") {
          throw new Error("Request timeout. Please try again.");
        }

        if (fetchError instanceof TypeError) {
          throw new Error("Network error. Please check your connection.");
        }

        throw fetchError;
      }
    } catch (error: any) {
      console.error("Order creation error:", error);

      const errorMessage = error.message || "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setForm({ ...form, price: value });

      if (errors.price) {
        setErrors({ ...errors, price: "" });
      }
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= 100) {
      setForm({ ...form, item: value });

      if (errors.item) {
        setErrors({ ...errors, item: "" });
      }
    }
  };

  return {
    form: (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {errors.general && (
          <div
            style={{
              padding: "0.75rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#dc2626",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
            role="alert"
          >
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        <Input
          label="Item Name"
          type="text"
          placeholder="Enter item name"
          value={form.item}
          onChange={handleItemChange}
          error={errors.item}
          fullWidth
          disabled={isSubmitting}
          required
          maxLength={100}
          aria-invalid={!!errors.item}
          aria-describedby={errors.item ? "item-error" : undefined}
        />

        <Input
          label="Price"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={form.price}
          onChange={handlePriceChange}
          error={errors.price}
          fullWidth
          disabled={isSubmitting}
          required
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? "price-error" : undefined}
        />

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label
            htmlFor="status-select"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#475569",
            }}
          >
            Status <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select
            id="status-select"
            value={form.status}
            onChange={(e) => {
              setForm({ ...form, status: e.target.value });
              if (errors.status) {
                setErrors({ ...errors, status: "" });
              }
            }}
            disabled={isSubmitting}
            required
            aria-invalid={!!errors.status}
            aria-describedby={errors.status ? "status-error" : undefined}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              color: "#0f172a",
              background: "#ffffff",
              border: `1px solid ${errors.status ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: "8px",
              outline: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            <option value="NEW">NEW</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          {errors.status && (
            <span
              id="status-error"
              role="alert"
              style={{
                fontSize: "0.8125rem",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              ⚠️ {errors.status}
            </span>
          )}
        </div>
      </div>
    ),
    handleSubmit,
    isSubmitting,
  };
}
