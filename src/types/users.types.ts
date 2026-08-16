export interface UserAccount {
    id: string;
    email: string;
    phone: string;
    is_deleted?: boolean;
    is_banned?: boolean;
    is_business: boolean;
    is_individual: boolean;
    is_active: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    created_on: string;
    updated_on: string;
    my_business?: boolean; // true = this user is the authenticated user themselves
}

export interface UserProfile {
    id: string;
    user_id: string;
    full_name?: string;
    date_of_birth: string;
    country: string;
    region_city: string;
    is_channel_partner: boolean;
    created_on: string;
    updated_on: string;
}

export type KeyType = "TRIAL" | "LIFETIME";

export interface AccessKey {
    id: string;
    key_code: string;
    key_type: KeyType;
    is_active: boolean;
    activated_at: string | null;
    expires_at: string | null;
    amount: number;
    deduct_trial_fee: boolean;
    created_on: string;
    channel_partner_id?: string | null;
    from_company?: boolean;
    business?: Business | null;
    is_expired?: boolean; // true if the key has expired based on the expires_at timestamp
}

export interface ChannelPartner {
    id: string;
    user_id: string;
    valid_from: string;
    valid_to: string | null;
    amount: number;
    access_key_id: string | null;
    /* joined */
    user: UserAccount;
    profile: UserProfile;
}

export interface Business {
    id: string;
    owner_id: string;
    name: string;
    country: string;
    region_city: string;
    access_key_id: string | null;
    created_on: string;
    updated_on: string;
    /* joined relations */
    manager_user?: UserAccount;
    manager_profile?: UserProfile;
    access_key: AccessKey | null;
    channel_partner: ChannelPartner | null;
    my_business?: boolean; // true = this business is owned by the authenticated user themselves
    business_code?: string;
}

