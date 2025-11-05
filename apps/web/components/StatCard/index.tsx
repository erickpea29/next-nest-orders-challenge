"use client";

import { Card, Description, Label, Trend, Value } from "./styled";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: string;
  trendPositive?: boolean;
}

export function StatCard({
  label,
  value,
  description,
  trend,
  trendPositive = true,
}: StatCardProps) {
  return (
    <Card>
      <Label>{label}</Label>
      <Value>
        {value}
        {trend && <Trend $positive={trendPositive}>{trend}</Trend>}
      </Value>
      {description && <Description>{description}</Description>}
    </Card>
  );
}
