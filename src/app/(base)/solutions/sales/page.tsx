// src/app/solutions/sales/page.tsx
import SalesPage from "@/components/solutions/sales";

export const metadata = {
  title:       "Sales Intelligence — Plurse",
  description: "Track every sale, customer, payment method and credit deal. Turn your sales data into decisions that grow your business.",
};

const Sales = () => {
  return <SalesPage />;
};

export default Sales;