// src/app/solutions/inventory/page.tsx
import InventoryPage from "@/components/solutions/inventory";

export const metadata = {
  title:       "Inventory Control — Plurse",
  description: "Every product, every variant, every location. Always in sync with Plurse inventory management.",
};

const Inventory = () => {
  return <InventoryPage />;
}

export default Inventory;