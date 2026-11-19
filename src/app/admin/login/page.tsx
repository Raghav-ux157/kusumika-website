"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEV_STAFF_ACCOUNTS } from "@/lib/auth/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/admin";
  const sessionExpired = searchParams?.get("session_expired") === "1";
  const unauthorizedAttempt = searchParams?.get("error") === "unauthorized";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (sessionExpired) {
      setErrorMessage("Your operational session has expired. Please sign in again.");
    } else if (unauthorizedAttempt) {
      setErrorMessage("Access Restricted: Your staff role is not authorized for that section.");
    }
  }, [sessionExpired, unauthorizedAttempt]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both staff email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      // Successful login -> navigate to intended destination
      router.push(redirectTarget);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while connecting to the authentication service.");
      setIsLoading(false);
    }
  };

  const fillPersona = (accountEmail: string) => {
    const acc = DEV_STAFF_ACCOUNTS[accountEmail];
    if (acc) {
      setEmail(accountEmail);
      setPassword(acc.password);
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between items-center p-4 sm:p-8 font-sans text-on-surface antialiased select-none">
      {/* Top Heritage Accent Bar */}
      <div className="w-full max-w-md pt-4 flex items-center justify-between text-xs text-on-surface-variant">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Storefront</span>
        </Link>
        <span className="font-mono text-[11px] text-outline">v1.4 • Secure Atelier Console</span>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md my-auto py-8">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-jharokha p-8 sm:p-10 space-y-6 relative overflow-hidden">
          {/* Subtle Jharokha arch background watermark */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary/5 pointer-events-none" />

          {/* Atelier Brand Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-surface-container p-2 shadow-sm flex items-center justify-center border border-outline-variant/30">
              <span className="text-3xl" role="img" aria-label="lotus">
                🪷
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-2">
              Kusumika
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
              Atelier Operations & Staff Access
            </p>
            <p className="text-xs text-outline max-w-xs leading-relaxed pt-1">
              Sign in to manage slow-craft loom cycles, B2B hospitality pipelines, and doorstep consignments.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-error-container text-on-error-container text-xs p-3.5 rounded-xl border border-error/20 flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px] text-error shrink-0">
                error
              </span>
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">
                Staff Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@kusumika.com"
                  className="w-full bg-surface-container-low text-on-surface text-xs pl-10 pr-3 py-2.5 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low text-on-surface text-xs pl-10 pr-10 py-2.5 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary p-1 rounded"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-semibold text-xs py-3 rounded-xl shadow-sm transition-all uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Atelier</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Development Quick Persona Switcher (Aids Testing & Review) */}
          <div className="pt-4 border-t border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              <span>Quick Test Personas</span>
              <span className="text-secondary font-mono">Dev Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillPersona("admin@kusumika.com")}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-left transition-colors"
              >
                <div className="font-bold text-primary">👑 Admin</div>
                <div className="text-[10px] text-on-surface-variant truncate">Full Access</div>
              </button>

              <button
                type="button"
                onClick={() => fillPersona("sales@kusumika.com")}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-left transition-colors"
              >
                <div className="font-bold text-secondary">💼 Sales</div>
                <div className="text-[10px] text-on-surface-variant truncate">Leads & Orders</div>
              </button>

              <button
                type="button"
                onClick={() => fillPersona("warehouse@kusumika.com")}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-left transition-colors"
              >
                <div className="font-bold text-tertiary">📦 Warehouse</div>
                <div className="text-[10px] text-on-surface-variant truncate">Orders & Stock</div>
              </button>

              <button
                type="button"
                onClick={() => fillPersona("support@kusumika.com")}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-left transition-colors"
              >
                <div className="font-bold text-on-surface">🎧 Support</div>
                <div className="text-[10px] text-on-surface-variant truncate">Tickets & Patrons</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="w-full max-w-md text-center text-[11px] text-outline pb-2">
        Protected by Kusumika Server-Side RBAC & Supabase Auth. Unauthorized access attempts are monitored and recorded.
      </div>
    </div>
  );
}
