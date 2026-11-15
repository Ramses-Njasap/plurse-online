// src/components/dashboard/my/keys/KeysSkeleton.tsx

import { TablePageSkeleton } from "@/components/dashboard/my/shared/TablePageSkeleton";

/** Access Keys loading state: 10 columns, 6 filters and the referral link box next to the title. */
export function KeysSkeleton() {
    return (
        <TablePageSkeleton
            columns={10}
            rows={8}
            filters={6}
            showTitleExtra
            label="Loading access keys"
        />
    );
}