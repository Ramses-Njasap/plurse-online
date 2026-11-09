"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconTrash, IconClock, IconMaximize, IconMinimize, IconClose } from "./icons";
import SettingsCard from "./SettingsCard";
import FormField from "./FormField";
import { useTabCache } from "@/hooks/useTabCache";
import {
    fetchAccountTabData,
    updatePersonalProfile,
    updateContacts,
    type ProfileUpdatePayload,
    type ContactsUpdatePayload,
} from "@/app/actions/settings-actions";

import { formatDate } from "@/app/utils/func";

import { updateAccountPassword } from "@/app/actions/change-password";
import { checkChannelPartnerStatus, purchaseChannelPartnerAction } from "@/app/actions/channel_partners";
import { PaymentModal, type PaymentModalContext } from "@/components/dashboard/my/payment/PaymentModal";

const CHANNEL_PARTNER_AMOUNT = 4000;

const CHANNEL_PARTNER_MODAL_CONTEXT: PaymentModalContext = {
    titles: {
        idle: "Activate channel partner",
    },
    subtitles: {
        idle: "Unlock business routing and key generation panels.",
        success: "Your channel partner access is confirmed.",
    },
    amountBanner: {
        label: "Amount due",
        badgeText: "Channel Partner",
        detailBox: {
            lines: [
                "Period: 90 days of instant core access",
                "Billing: 4,000 XAF, one-time, non-recurring",
            ],
        },
    },
    successMessage: "Unlocking your dashboard…",
};

export default function AccountTab() {
    const router = useRouter();
    const { data, loading, error, loadData } = useTabCache(fetchAccountTabData, 5 * 60 * 1000);
    console.log("AccountTab data:", data, "loading:", loading, "error:", error);

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isModalMaximized, setIsModalMaximized] = useState(false);

    // Channel Partner Payment Modal States
    const [showChannelPartnerModal, setShowChannelPartnerModal] = useState(false);
    const [preflightError, setPreflightError] = useState("");

    // Baseline (Last-Saved) States
    const [savedProfile, setSavedProfile] = useState({
        fullName: "",
        dateOfBirth: "",
        country: "",
        regionCity: "",
    });
    const [savedContacts, setSavedContacts] = useState({
        email: "",
        phone: "",
    });

    // Form Field Local States
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [country, setCountry] = useState("");
    const [regionCity, setRegionCity] = useState("");
    const [isPartner, setIsPartner] = useState(false);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Password Form Local States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Submission Transitions & Feedback State
    const [isPendingProfile, startProfileTransition] = useTransition();
    const [isPendingContacts, startContactsTransition] = useTransition();
    const [isPendingPassword, startPasswordTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<{ section: string; type: "success" | "error"; text: string } | null>(null);

    // --- ALL HOOKS DECLARED UNCONDITIONALLY AT THE TOP ---
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Read the lightweight privilege claim immediately on layout mounting pass
    useEffect(() => {
        async function runCheck() {
            const status = await checkChannelPartnerStatus();
            setIsPartner(status);
        }
        runCheck();
    }, []);

    // Sync baseline and active form state whenever fresh data is retrieved
    useEffect(() => {
        if (data) {
            const profileBaseline = {
                fullName: data.profile.full_name ?? "",
                dateOfBirth: data.profile.date_of_birth ?? "",
                country: data.profile.country ?? "",
                regionCity: data.profile.region_city ?? "",
            };
            const contactsBaseline = {
                email: data.account.email ?? "",
                phone: data.account.phone ?? "",
            };

            setSavedProfile(profileBaseline);
            setSavedContacts(contactsBaseline);

            setFullName(profileBaseline.fullName);
            setDateOfBirth(profileBaseline.dateOfBirth);
            setCountry(profileBaseline.country);
            setRegionCity(profileBaseline.regionCity);

            setEmail(contactsBaseline.email);
            setPhone(contactsBaseline.phone);
        }
    }, [data]);

    // --- CONDITIONAL RETURNS NOW OCCUR AFTER ALL HOOKS ---
    if (loading && !data) {
        return (
            <div className="p-8 text-center text-[14px]" style={{ color: "var(--text-subtle)" }}>
                Loading personal profile data...
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8 text-center text-red-500 text-[14px]">
                {error || "Failed to load account information."}
            </div>
        );
    }

    const { account, profile, channelPartner, partnerHistory } = data;

    // --- DELTA COMPUTATIONS AGAINST BASELINE ---
    const getProfileDelta = (): ProfileUpdatePayload => {
        const delta: ProfileUpdatePayload = {};
        if (fullName !== savedProfile.fullName) delta.full_name = fullName;
        if (dateOfBirth !== savedProfile.dateOfBirth) delta.date_of_birth = dateOfBirth;
        if (country !== savedProfile.country) delta.country = country;
        if (regionCity !== savedProfile.regionCity) delta.region_city = regionCity;
        return delta;
    };

    const getContactsDelta = (): ContactsUpdatePayload => {
        const delta: ContactsUpdatePayload = {};
        if (email !== savedContacts.email) delta.email = email;
        if (phone !== savedContacts.phone) delta.phone = phone;
        return delta;
    };

    const profileDelta = getProfileDelta();
    const contactsDelta = getContactsDelta();

    const isProfileDirty = Object.keys(profileDelta).length > 0;
    const isContactsDirty = Object.keys(contactsDelta).length > 0;

    const isPasswordValid =
        currentPassword.trim() !== "" &&
        newPassword.length >= 6 &&
        newPassword === confirmPassword;

    // --- HANDLERS ---
    const handleSaveProfile = async () => {
        if (!isProfileDirty) return;
        setStatusMessage(null);

        startProfileTransition(async () => {
            const res = await updatePersonalProfile(profileDelta);
            if (res.success) {
                setStatusMessage({ section: "profile", type: "success", text: res.message });
                setSavedProfile({ fullName, dateOfBirth, country, regionCity });
                loadData();
            } else {
                setStatusMessage({ section: "profile", type: "error", text: res.message });
            }
        });
    };

    const handleSaveContacts = async () => {
        if (!isContactsDirty) return;
        setStatusMessage(null);

        startContactsTransition(async () => {
            const res = await updateContacts(contactsDelta);
            if (res.success) {
                setStatusMessage({ section: "contacts", type: "success", text: res.message });
                setSavedContacts({ email, phone });
                loadData();
            } else {
                setStatusMessage({ section: "contacts", type: "error", text: res.message });
            }
        });
    };

    const handleUpdatePassword = () => {
        if (!isPasswordValid) return;
        setStatusMessage(null);

        startPasswordTransition(async () => {
            const res = await updateAccountPassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            if (res.success) {
                setStatusMessage({ section: "password", type: "success", text: res.message });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setStatusMessage({ section: "password", type: "error", text: res.message });
            }
        });
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This action will set `is_deleted` to true.")) {
            console.log("Account deletion requested.");
        }
    };

    // --- CHANNEL PARTNER PAYMENT FLOW HANDLERS ---
    async function handleBeforePay() {
        setPreflightError("");
        return true;
    }

    async function handleSuccess(transactionId: string) {
        const result = await purchaseChannelPartnerAction(transactionId);
        if (result.success) {
            setIsPartner(true);
            setShowChannelPartnerModal(false);
            loadData();
            router.refresh();
        } else {
            setPreflightError(result.message);
        }
    }

    return (
        <div className="space-y-6">
            {/* 1. Personal Profile */}
            <SettingsCard
                title="1. Personal Profile"
                action={
                    profile.is_channel_partner ? (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                            Channel Partner
                        </span>
                    ) : undefined
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Full Name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <FormField
                        label="Date of Birth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <FormField
                        label="Country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <FormField
                        label="Region / City"
                        type="text"
                        value={regionCity}
                        onChange={(e) => setRegionCity(e.target.value)}
                    />
                    <FormField
                        label="Account Type"
                        type="text"
                        value={account.is_business ? "Business Account" : "Individual Account"}
                        disabled
                    />
                </div>

                {statusMessage?.section === "profile" && (
                    <p className={`text-[12px] font-medium pt-1 ${statusMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {statusMessage.text}
                    </p>
                )}

                <div className="pt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={!isProfileDirty || isPendingProfile}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ background: "var(--brand)" }}
                    >
                        {isPendingProfile ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </SettingsCard>

            {/* 2. Contacts */}
            <SettingsCard title="2. Contacts">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormField
                        label="Phone Number"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                {statusMessage?.section === "contacts" && (
                    <p className={`text-[12px] font-medium pt-1 ${statusMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {statusMessage.text}
                    </p>
                )}

                <div className="pt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveContacts}
                        disabled={!isContactsDirty || isPendingContacts}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ background: "var(--brand)" }}
                    >
                        {isPendingContacts ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </SettingsCard>

            {/* 3. Passwords */}
            <SettingsCard title="3. Passwords">
                <div className="space-y-3">
                    <FormField
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="New Password"
                            type="password"
                            placeholder="New password (min. 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <FormField
                            label="Confirm New Password"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {statusMessage?.section === "password" && (
                    <p className={`text-[12px] font-medium pt-1 ${statusMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {statusMessage.text}
                    </p>
                )}

                <div className="pt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={handleUpdatePassword}
                        disabled={!isPasswordValid || isPendingPassword}
                        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ background: "var(--brand)" }}
                    >
                        {isPendingPassword ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </SettingsCard>

            {/* 4. Security Status & Account Health */}
            <SettingsCard
                title="4. Security Status & Account Health"
                description="Monitor system status, view registration metadata, and manage account destruction preferences."
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <StatTile
                        label="Account Status"
                        value={account.is_active ? "Active" : "Inactive"}
                        tone={account.is_active ? "positive" : "neutral"}
                    />
                    <StatTile
                        label="Banned"
                        value={account.is_banned ? "Restricted" : "No"}
                        tone={account.is_banned ? "negative" : "positive"}
                    />
                    <StatTile
                        label="Email Verified"
                        value={account.email_verified ? "Verified" : "Unverified"}
                        tone={account.email_verified ? "positive" : "neutral"}
                    />
                    <StatTile
                        label="Phone Verified"
                        value={account.phone_verified ? "Verified" : "Unverified"}
                        tone={account.phone_verified ? "positive" : "neutral"}
                    />
                    <StatTile
                        label="Deletion Flag"
                        value={account.is_deleted ? "Pending" : "Not Flagged"}
                        tone={account.is_deleted ? "warning" : "neutral"}
                    />
                </div>

                <div className="flex items-center gap-1.5 text-[12px] pt-1" style={{ color: "var(--text-subtle)" }}>
                    <IconClock className="w-3.5 h-3.5" />
                    Account created on{" "}
                    <span className="font-mono font-medium" style={{ color: "var(--foreground)" }}>
                        {new Date(account.created_on).toLocaleDateString()}
                    </span>
                </div>

                <div
                    className="pt-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div>
                        <p className="text-[13px] font-semibold text-red-600 flex items-center gap-1.5">
                            <IconTrash className="w-3.5 h-3.5" />
                            Delete Account
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                            Permanently mark this user record as deleted (<code className="font-mono">is_deleted = true</code>). Associated
                            access keys and managed business links will be revoked.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors shrink-0"
                    >
                        Delete Account
                    </button>
                </div>
            </SettingsCard>

            {/* 5. Channel Partner */}
            <SettingsCard
                title="5. Channel Partner Info"
                action={
                    <button
                        type="button"
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="text-[13px] font-medium hover:underline shrink-0"
                        style={{ color: "var(--brand)" }}
                    >
                        View Partner History
                    </button>
                }
            >
                {isPartner ? (
                    <div
                        className="p-4 rounded-xl border bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <div>
                            <p className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                                Active Partnership Tier
                            </p>
                            <p className="text-[12px]" style={{ color: "var(--text-subtle)" }}>
                                Valid: {formatDate(channelPartner?.valid_from)} to {formatDate(channelPartner?.valid_to) ?? "Indefinite"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[14px] font-bold text-emerald-600">
                                {channelPartner?.amount.toLocaleString()} XAF
                            </p>
                            {/* <button
                                type="button"
                                onClick={() => setShowChannelPartnerModal(true)}
                                className="mt-1 text-[12px] px-3 py-1 text-white rounded-lg font-medium"
                                style={{ background: "var(--brand)" }}
                            >
                                Upgrade Partnership
                            </button> */}
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4">
                        <p className="text-[13px] mb-2" style={{ color: "var(--text-subtle)" }}>
                            You are not currently registered as a Channel Partner.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowChannelPartnerModal(true)}
                            className="px-4 py-2 text-white rounded-xl text-[13px] font-medium"
                            style={{ background: "var(--brand)" }}
                        >
                            Become a Channel Partner
                        </button>
                    </div>
                )}
            </SettingsCard>

            {/* Channel Partner Payment Modal */}
            {showChannelPartnerModal && (
                <PaymentModal
                    amount={CHANNEL_PARTNER_AMOUNT}
                    onBeforePay={handleBeforePay}
                    onSuccess={handleSuccess}
                    preflightError={preflightError}
                    onClose={() => setShowChannelPartnerModal(false)}
                    context={CHANNEL_PARTNER_MODAL_CONTEXT}
                />
            )}

            {/* Channel Partner History Modal */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div
                        className={`rounded-2xl border shadow-xl transition-all duration-200 flex flex-col ${isModalMaximized ? "w-[98vw] h-[95vh]" : "w-full max-w-2xl h-[450px]"
                            }`}
                        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                    >
                        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                            <h3 className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
                                Channel Partner History
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalMaximized(!isModalMaximized)}
                                    className="p-1.5 rounded-lg border hover:bg-stone-50 transition-colors"
                                    style={{ borderColor: "var(--border)" }}
                                    aria-label={isModalMaximized ? "Minimize" : "Maximize"}
                                >
                                    {isModalMaximized ? <IconMinimize className="w-3.5 h-3.5" /> : <IconMaximize className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsHistoryModalOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                                    style={{ color: "var(--text-muted)" }}
                                    aria-label="Close"
                                >
                                    <IconClose className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            {partnerHistory.length === 0 ? (
                                <p className="text-[13px] text-center py-8" style={{ color: "var(--text-subtle)" }}>
                                    No partnership history found.
                                </p>
                            ) : (
                                <table className="w-full text-left text-[13px]">
                                    <thead>
                                        <tr className="border-b" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                                            <th className="pb-2 font-medium">Valid From</th>
                                            <th className="pb-2 font-medium">Valid To</th>
                                            <th className="pb-2 font-medium">Amount</th>
                                            <th className="pb-2 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partnerHistory.map((row) => {
                                            const isExpired = row.valid_to ? new Date(row.valid_to) < new Date() : false;
                                            return (
                                                <tr key={row.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                                                    <td className="py-2.5 font-mono" style={{ color: "var(--foreground)" }}>
                                                        {formatDate(row.valid_from)}
                                                    </td>
                                                    <td className="py-2.5 font-mono" style={{ color: "var(--foreground)" }}>
                                                        {formatDate(row.valid_to) ?? "Indefinite"}
                                                    </td>
                                                    <td className="py-2.5 font-semibold" style={{ color: "var(--foreground)" }}>
                                                        {row.amount.toLocaleString()} XAF
                                                    </td>
                                                    <td className="py-2.5">
                                                        <span
                                                            className={`px-2 py-0.5 text-[11px] rounded-md font-medium ${!isExpired
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-stone-100 text-stone-500"
                                                                }`}
                                                        >
                                                            {!isExpired ? "Active" : "Expired"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatTile({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: "positive" | "negative" | "warning" | "neutral";
}) {
    const dotColor =
        tone === "positive" ? "bg-emerald-500" : tone === "negative" ? "bg-red-500" : tone === "warning" ? "bg-amber-500" : "bg-stone-400";

    return (
        <div className="p-3.5 rounded-xl border bg-stone-50/40" style={{ borderColor: "var(--border)" }}>
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                {label}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
                <span className="text-[13px] font-semibold truncate" style={{ color: "var(--foreground)" }}>
                    {value}
                </span>
            </div>
        </div>
    );
}