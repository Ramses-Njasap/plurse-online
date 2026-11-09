// app/(dashboard)/dashboard/my/transactions/page.tsx

export const metadata = {
    title: "Transactions",
    description: "Payments made from your account.",
};

import { TransactionsClient } from "./TransactionsClient";

const Transactions = () => {
    return <TransactionsClient />;
};

export default Transactions;