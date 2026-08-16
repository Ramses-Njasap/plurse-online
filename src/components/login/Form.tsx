/* ── Login form ── */

"use client";

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/signup/shared-with-login/Icons";

interface LoginFormProps {
    onSubmit: (payload: { email: string; password: string }) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({ email, password });
    }

    return (
        <div className="w-full max-w-[380px]">
            {/* Mobile wordmark */}
            <div className="mb-8 lg:hidden">
                <span className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
                    Plurse
                </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
                <p
                    className="mb-3 text-[11px] font-medium uppercase tracking-[0.10em]"
                    style={{ color: "var(--brand)" }}
                >
                    Welcome back
                </p>
                <h2 className="text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">
                    Sign in to your
                    <br />
                    account.
                </h2>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                    <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
                        Email address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@business.com"
                        autoComplete="email"
                        required
                        className="h-[44px] w-full rounded-lg border border-[#0F0F0F]/10 bg-white px-4 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,15,15,0.10)")}
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
                            Password
                        </label>
                        <Link
                            href="/login/forgot-password"
                            className="text-[12px] text-[#0F0F0F]/35 transition-colors hover:text-[#0F0F0F]/60"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            className="h-[44px] w-full rounded-lg border border-[#0F0F0F]/10 bg-white px-4 pr-12 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,15,15,0.10)")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F0F0F]/25 transition-colors hover:text-[#0F0F0F]/55"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="mt-2 h-[44px] w-full rounded-lg text-[14px] font-medium text-white transition-all active:scale-[0.99]"
                    style={{ background: "var(--brand)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
                >
                    Sign in
                </button>
            </form>

            {/* Footer link */}
            <p className="mt-7 text-center text-[13px] text-[#0F0F0F]/35">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-medium text-[#0F0F0F] transition-opacity hover:opacity-60"
                >
                    Create one
                </Link>
            </p>
        </div>
    );
}