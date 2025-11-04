import { Input } from "@/components/Input";
import { useState } from "react";
import { z } from "zod";

const orderSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive"),
  status: z.enum(["NEW", "PAID", "CANCELLED"], {
    required_error: "Status is required",
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
        setIsSubmitting(false);
        return;
      }

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      setForm({ item: "", price: "", status: "NEW" });
      onSuccess();
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to create order" });
    } finally {
      setIsSubmitting(false);
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
            }}
          >
            {errors.general}
          </div>
        )}

        <Input
          label="Item Name"
          type="text"
          placeholder="Enter item name"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
          error={errors.item}
          fullWidth
          disabled={isSubmitting}
        />

        <Input
          label="Price"
          type="number"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          error={errors.price}
          fullWidth
          disabled={isSubmitting}
        />

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#475569",
            }}
          >
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              color: "#0f172a",
              background: "#ffffff",
              border: `1px solid ${errors.status ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: "8px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="NEW">NEW</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          {errors.status && (
            <span
              style={{
                fontSize: "0.8125rem",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              ⚠ {errors.status}
            </span>
          )}
        </div>
      </div>
    ),
    handleSubmit,
    isSubmitting,
  };
}
