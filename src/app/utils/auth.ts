import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY);
export const COOKIE_NAME = "plurse-auth-token";

export type UserSessionPayload = {
    id: string;
    email: string;
    phone: string | null;
    accountType: "individual" | "business";
    isActive: boolean;
    isChannelPartner?: boolean;
};

/**
 * High-Performance Session Provisioner
 * Encrypts user metadata into a secure cookie upon successful OTP verification.
 */
export async function createPersistentSession(user: UserSessionPayload) {
    const token = await new SignJWT({ ...user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // Keeps the user logged in for exactly 1 week
        .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

/**
 * Microsecond Guard: Checks if there is an active session in local browser storage
 * ZERO Database hits.
 */
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ["HS256"] });
        return !!payload && (payload as any).isActive === true;
    } catch {
        return false;
    }
}

/**
 * Centralized User Information Proxy
 * Reads identity traits instantly out of the encrypted cookie payload.
 * ZERO Database hits.
 */
export const whichUser = {
    /** Gets the complete decoded user object instantly */
    get info(): Promise<UserSessionPayload | null> {
        return (async () => {
            const cookieStore = await cookies();
            const token = cookieStore.get(COOKIE_NAME)?.value;
            if (!token) return null;
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: ["HS256"] });
                return payload as UserSessionPayload;
            } catch {
                return null;
            }
        })();
    },

    /** Instantly returns the user's email */
    async email(): Promise<string | null> {
        const session = await this.info;
        return session ? session.email : null;
    },

    /** Instantly returns the user's phone number */
    async phone(): Promise<string | null> {
        const session = await this.info;
        return session ? session.phone : null;
    },

    /** Instantly returns the user's account type classification */
    async accountType(): Promise<"individual" | "business" | null> {
        const session = await this.info;
        return session ? session.accountType : null;
    }
};

/**
 * Destroys local session tracking cookies on logout
 */
export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}