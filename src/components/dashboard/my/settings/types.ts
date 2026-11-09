export type SettingsTab = "account" | "businesses" | "access-keys" | "billing";

export interface UserProfile {
    full_name: string;
    date_of_birth: string;
    country: string;
    region_city: string;
    is_channel_partner: boolean;
    is_business: boolean;
    is_individual: boolean;
}

export interface UserContacts {
    email: string;
    phone: string;
}

export interface UserSecurity {
    created_at: string;
    is_deleted: boolean;
    is_banned: boolean;
    is_active: boolean;
    email_verified: boolean;
    phone_verified: boolean;
}

export interface ChannelPartner {
    valid_from: string;
    valid_to: string;
    amount: string;
}

export interface ChannelPartnershipHistoryRow {
    id: string;
    valid_from: string;
    valid_to: string;
    amount: string;
    status: "Active" | "Expired";
}

export interface Business {
    id: string;
    name: string;
    country: string;
    region_city: string;
    relationship: "Owner" | "Channel Partner";
    created_at: string;
}