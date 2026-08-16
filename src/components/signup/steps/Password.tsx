/* ── Step 3: Password setup ── */

"use client";

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../shared-with-login/Icons";
import { passwordStrength, strengthLabel, strengthBarColor } from "@/lib/signup/password";

interface Step3PasswordProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function Step3Password({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  onBack,
  onSubmit,
}: Step3PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit = password.length >= 8 && password === confirmPassword;
  const pwStrength = passwordStrength(password);
  const { label: strengthText, color: strengthColor } = strengthLabel(pwStrength);
  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.10em] text-[#0F0F0F]/35">
        Step 3 of 3
      </p>
      <h2 className="mb-7 text-[26px] font-medium leading-[1.25] text-[#0F0F0F]">
        Secure your
        <br />
        account.
      </h2>

      <div className="mb-7 space-y-4">
        {/* Password */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
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

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="mt-2.5">
              <div className="mb-1 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-[2px] flex-1 rounded-full transition-all duration-300 ${
                      pwStrength > i ? strengthBarColor(pwStrength) : "bg-[#0F0F0F]/10"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-[11px] ${strengthColor}`}>{strengthText}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[#0F0F0F]/50">
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => onConfirmChange(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="h-[44px] w-full rounded-lg border bg-white px-4 pr-12 text-[14px] text-[#0F0F0F] placeholder:text-[#0F0F0F]/20 transition-colors focus:outline-none"
              style={{
                borderColor: passwordMismatch ? "#fca5a5" : "rgba(15,15,15,0.10)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = passwordMismatch
                  ? "#f87171"
                  : "var(--brand)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = passwordMismatch
                  ? "#fca5a5"
                  : "rgba(15,15,15,0.10)")
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F0F0F]/25 transition-colors hover:text-[#0F0F0F]/55"
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {passwordMismatch && (
            <p className="mt-1.5 text-[12px] text-red-400">
              Passwords don&apos;t match.
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-[44px] rounded-lg border border-[#0F0F0F]/10 px-5 text-[14px] font-medium text-[#0F0F0F]/50 transition-all hover:border-[#0F0F0F]/25 hover:text-[#0F0F0F]/70"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          onClick={() => canSubmit && onSubmit()}
          className="h-[44px] flex-1 rounded-lg text-[14px] font-medium text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-25 disabled:active:scale-100"
          style={{ background: "var(--brand)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--brand-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--brand)")
          }
        >
          Create account
        </button>
      </div>

      {/* Legal */}
      <p className="mt-5 text-center text-[11px] leading-relaxed text-[#0F0F0F]/30">
        By creating an account you agree to our{" "}
        <Link
          href="/terms"
          className="underline decoration-[#0F0F0F]/20 underline-offset-2 transition-colors hover:text-[#0F0F0F]/55"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline decoration-[#0F0F0F]/20 underline-offset-2 transition-colors hover:text-[#0F0F0F]/55"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}