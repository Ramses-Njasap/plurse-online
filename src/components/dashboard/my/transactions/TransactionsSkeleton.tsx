// src/components/dashboard/my/transactions/TransactionsSkeleton.tsx

import { TablePageSkeleton } from "@/components/dashboard/my/shared/TablePageSkeleton";

/** Transactions loading state: no title buttons, 3 filters, 4 stat cards and a 9-column table. */
export function TransactionsSkeleton() {
    return (
        <TablePageSkeleton
            columns={9}
            rows={7}
            filters={3}
            actions={0}
            statCards={4}
            label="Loading transactions"
        />
    );
}