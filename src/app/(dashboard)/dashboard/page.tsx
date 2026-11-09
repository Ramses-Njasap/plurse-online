// app/(dashboard)/dashboard/page.tsx

export const metadata = {
    title: "Overview",
    description: "A snapshot of your businesses, access keys, payments and partnership.",
};

import { OverviewClient } from "./OverviewClient";

const Overview = () => {
    return <OverviewClient />;
};

export default Overview;