"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, authLinkClass } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo only: no email is actually sent.
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email linked to your account and we'll send you a reset link."
      footer={
        <Link href="/login" className={authLinkClass}>
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div
          role="status"
          className="space-y-3 rounded-sm border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900"
        >
          <p className="font-medium">Check your inbox</p>
          <p>
            If an account exists for <span className="font-medium">{email}</span>, a reset
            link is on its way.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className={`text-xs ${authLinkClass}`}
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-zinc-900">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-10 bg-white"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
