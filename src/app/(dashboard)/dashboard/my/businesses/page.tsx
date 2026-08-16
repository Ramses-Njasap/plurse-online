export const metadata = {
    title: "Businesses",
    description: "Businesses that are affiliated to your account.",
};

import { BusinessesClient } from "./BusinessesClient";

const Businesses = () => {
    return <BusinessesClient />;
};

export default Businesses;