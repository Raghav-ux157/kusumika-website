import { StaffRole, StaffSession, ROLE_ROUTE_PERMISSIONS } from "@/types/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const ADMIN_SESSION_COOKIE = "ksm_staff_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours in seconds

// Secret key used for signing session cookies
function getSessionSecret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    "kusumika_atelier_secure_hmac_secret_2026"
  );
}

// Development / Mock Staff Credentials (Active when live Supabase is not connected)
export const DEV_STAFF_ACCOUNTS: Record<
  string,
  { password: string; role: StaffRole; fullName: string }
> = {
  "admin@kusumika.com": {
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    role: "admin",
    fullName: "Atelier Administrator",
  },
  "sales@kusumika.com": {
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    role: "sales",
    fullName: "Devika Sharma (Sales & Concierge)",
  },
  "warehouse@kusumika.com": {
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    role: "warehouse",
    fullName: "Kailash Meena (Warehouse & Godown)",
  },
  "support@kusumika.com": {
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    role: "support",
    fullName: "Vikram Seth (Patron Care & Tickets)",
  },
};

/**
 * Universal Base64URL string encoding (Node & Edge safe)
 */
function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  const binary = new TextEncoder().encode(str);
  let binStr = "";
  for (let i = 0; i < binary.length; i++) {
    binStr += String.fromCharCode(binary[i]);
  }
  return btoa(binStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Universal Base64URL string decoding (Node & Edge safe)
 */
function fromBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  }
  const binStr = atob(base64);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Web Crypto HMAC-SHA256 signature generator (Node 18+ and Edge Runtime safe)
 */
async function computeWebCryptoHmac(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const bytes = new Uint8Array(sigBuffer);
  let binStr = "";
  for (let i = 0; i < bytes.length; i++) {
    binStr += String.fromCharCode(bytes[i]);
  }
  return btoa(binStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Signs and creates a secure session token
 */
export async function createStaffSessionToken(
  session: Omit<StaffSession, "issuedAt" | "expiresAt">
): Promise<string> {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_MAX_AGE_SECONDS * 1000;
  const fullSession: StaffSession = {
    ...session,
    issuedAt,
    expiresAt,
  };

  const payload = toBase64Url(JSON.stringify(fullSession));
  const signature = await computeWebCryptoHmac(payload, getSessionSecret());

  return `${payload}.${signature}`;
}

/**
 * Verifies a session token string and returns StaffSession if valid and unexpired
 */
export async function verifyStaffSessionToken(
  token: string | undefined | null
): Promise<StaffSession | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSignature = await computeWebCryptoHmac(payload, getSessionSecret());

    if (signature !== expectedSignature) {
      return null;
    }

    const json = fromBase64Url(payload);
    const session: StaffSession = JSON.parse(json);

    if (Date.now() > session.expiresAt) {
      return null; // Expired
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Checks whether a given path is permitted for a specific staff role
 */
export function isRouteAllowedForRole(pathname: string, role: StaffRole): boolean {
  if (role === "admin") return true; // Admin has full access

  // Staff role inspection endpoint is accessible by any authenticated staff member
  if (pathname === "/api/admin/staff-role") return true;

  const segments = pathname.split("/").filter(Boolean);

  // API Route role enforcement: e.g. /api/admin/leads -> /admin/leads
  if (segments[0] === "api" && segments[1] === "admin") {
    if (segments.length === 2) return true;
    const apiFeature = segments[2];
    if (apiFeature === "staff-role") return true;
    const mappedRoute = `/admin/${apiFeature}`;
    const allowedRoles = ROLE_ROUTE_PERMISSIONS[mappedRoute];
    return allowedRoles ? allowedRoles.includes(role) : false;
  }

  // Page Route role enforcement
  if (segments.length === 1 && segments[0] === "admin") {
    return true; // /admin overview is accessible by all authenticated roles
  }

  const baseRoute = `/${segments.slice(0, 2).join("/")}`;
  const allowedRoles = ROLE_ROUTE_PERMISSIONS[baseRoute];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(role);
}

/**
 * Authenticates credentials against live Supabase or fallback dev accounts
 */
export async function authenticateStaffCredentials(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; session?: StaffSession; error?: string }> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { success: false, error: "Please enter both staff email and password." };
  }

  const supabase = getSupabaseAdminClient();

  // 1. LIVE SUPABASE AUTHENTICATION
  if (supabase) {
    try {
      const { data: authData, error: authError } = await (supabase.auth as any).signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        return { success: false, error: authError?.message || "Invalid email or password." };
      }

      // Check staff_roles table
      const { data: roleData, error: roleError } = await (supabase as any)
        .from("staff_roles")
        .select("role, full_name")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (roleError || !roleData) {
        return {
          success: false,
          error: "Access Denied: This account does not have staff privileges in the Atelier Console.",
        };
      }

      const session: StaffSession = {
        userId: authData.user.id,
        email: authData.user.email || email,
        fullName: roleData.full_name || authData.user.user_metadata?.full_name || "Atelier Staff",
        role: roleData.role as StaffRole,
        issuedAt: Date.now(),
        expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
      };

      return { success: true, session };
    } catch (err: any) {
      console.warn("[adminAuth] Supabase auth exception, testing fallback:", err.message);
    }
  }

  // 2. DEVELOPMENT / SANDBOX FALLBACK
  const devAccount = DEV_STAFF_ACCOUNTS[email];
  if (devAccount && devAccount.password === password) {
    const session: StaffSession = {
      userId: `staff_${devAccount.role}_${Date.now()}`,
      email,
      fullName: devAccount.fullName,
      role: devAccount.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    };
    return { success: true, session };
  }

  return { success: false, error: "Invalid staff credentials. Please check your email and password." };
}
