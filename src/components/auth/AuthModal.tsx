"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Checkbox } from "@/components/ui";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      // Offline / Sandbox Simulation
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg("Welcome back, Radhika Sharma! Signed in to Loom Patron Dossier.");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      }, 700);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        setSuccessMsg("Signed in successfully. Welcome back to Kusumika.");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      // Offline / Sandbox Simulation
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(
          "Patron dossier created! 500 welcome Atelier Points credited to your account."
        );
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      }, 700);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            whatsapp_opt_in: whatsappOptIn,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        setSuccessMsg(
          "Patron registration received! Check your email to confirm your account and claim 500 Atelier Points."
        );
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg("Magic sign-in link dispatched to your email inbox.");
      }, 600);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Magic sign-in link sent! Please check your email inbox to log in.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to dispatch magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "signin"
          ? "Patron Sign In"
          : mode === "signup"
          ? "Register Atelier Patron Dossier"
          : "Magic Link Sign In"
      }
      subtitle="Access your slow-textile orders, saved havens, and loyalty points"
      maxWidth="md"
    >
      <div className="space-y-5 pt-1">
        {/* MODE TOGGLER */}
        <div className="flex rounded-lg bg-surface-container p-1 text-xs font-sans uppercase font-bold tracking-wider">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              resetForm();
            }}
            className={`flex-1 py-2 text-center rounded-md transition-all ${
              mode === "signin"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface hover:text-primary"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              resetForm();
            }}
            className={`flex-1 py-2 text-center rounded-md transition-all ${
              mode === "signup"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface hover:text-primary"
            }`}
          >
            New Patron
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magic");
              resetForm();
            }}
            className={`flex-1 py-2 text-center rounded-md transition-all ${
              mode === "magic"
                ? "bg-primary text-surface shadow-xs"
                : "text-on-surface hover:text-primary"
            }`}
          >
            Passwordless
          </button>
        </div>

        {/* FEEDBACK MESSAGES */}
        {errorMsg && (
          <div className="p-3 bg-error-container/30 border border-error/30 text-error rounded-lg font-sans text-xs leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-tertiary-fixed/60 border border-tertiary/40 text-on-tertiary-fixed font-sans text-xs font-medium rounded-lg leading-relaxed flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              placeholder="e.g. radhika.sharma@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-on-surface-variant">
                Demo Patron: radhika.sharma@example.com
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode("magic");
                  resetForm();
                }}
                className="text-secondary hover:text-primary underline underline-offset-2"
              >
                Forgot Password?
              </button>
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying Patron..." : "Sign In to Patron Dossier"}
            </Button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            {/* Bonus Banner */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/50 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                stars
              </span>
              <p className="font-sans text-xs text-on-surface leading-tight">
                <strong>500 Atelier Points Bonus:</strong> Credited
                immediately upon registration to redeem on your next order.
              </p>
            </div>

            <Input
              label="Full Name *"
              placeholder="e.g. Radhika Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="radhika.sharma@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number (for Courier & OTP) *"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Create Secure Password *"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Checkbox
              label="Receive Loom updates, dispatch tracking & courier OTP via WhatsApp"
              checked={whatsappOptIn}
              onChange={(e) => setWhatsappOptIn(e.target.checked)}
            />

            <Button
              variant="primary"
              size="md"
              className="w-full mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Dossier..." : "Register Patron Account (+500 pts)"}
            </Button>
          </form>
        )}

        {/* 3. MAGIC LINK FORM */}
        {mode === "magic" && (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Enter your email address and we will dispatch a direct secure
              login link without requiring passwords.
            </p>
            <Input
              label="Your Email Address"
              type="email"
              placeholder="e.g. radhika.sharma@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              variant="primary"
              size="md"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Dispatching..." : "Send Magic Sign-In Link"}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
