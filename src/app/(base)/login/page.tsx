"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandPanel } from "@/components/signup/shared-with-login/BrandPanel";
import { LoginForm } from "@/components/login/Form";
import { loginAction } from "@/app/actions/login";

export default function LoginPage() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleLogin(payload: { email: string; password: string }): Promise<void> {
        setErrorMsg(null);
        setLoading(true);

        const result = await loginAction(payload);

        if (!result.success) {
            setErrorMsg(result.message);
            setLoading(false);
            return;
        }

        // Handshake complete, transition user instantly into their dashboard workspace
        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="flex min-h-[calc(100vh-68px)]">
            {/* Left: brand panel — static "default" copy for login */}
            <BrandPanel copyKey="default" />

            {/* Right: form panel */}
            <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
                <div className="w-full max-w-md space-y-4">

                    {/* Display potential authorization issues cleanly above your fields */}
                    {errorMsg && (
                        <div
                            className="p-3 text-[14px] font-medium rounded-xl border text-red-600 bg-red-50"
                            style={{ borderColor: "rgba(220, 38, 38, 0.15)" }}
                        >
                            {errorMsg}
                        </div>
                    )}

                    <LoginForm onSubmit={handleLogin} />

                    {loading && (
                        <p className="text-center text-[13px]" style={{ color: "var(--text-subtle)" }}>
                            Authorizing secure session...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}