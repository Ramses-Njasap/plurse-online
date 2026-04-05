// src/app/solutions/customers/page.tsx
import CustomersPage from "@/components/solutions/customers.tsx";


export const metadata = {
    title: "Customer Relationships — Plurse",
    description: "Know your customers by name and by habit. Build profiles, track purchase history and extend credit wisely.",
};

const Customers = () => {
    return <CustomersPage />;
};

export default Customers;