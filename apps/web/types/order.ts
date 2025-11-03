export type Order = {
  id: string;
  item: string;
  price: string;
  status: "NEW" | "PAID" | "CANCELLED";
};
