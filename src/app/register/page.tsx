"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthShell, authLinkClass } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    // Demo only: no account is actually created.
    toast.success("Account created. You can now sign in.");
    router.push("/login");
  };

  const field = (
    id: keyof typeof form,
    label: string,
    type = "text",
    extra: React.ComponentProps<"input"> = {}
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        required
        value={form[id]}
        onChange={set(id)}
        className="h-10 bg-white"
        {...extra}
      />
    </div>
  );

  return (
    <AuthShell
      title="Create your account"
      description="Set up a workspace for your properties in a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {field("fullName", "Full name", "text", { autoComplete: "name" })}
        {field("organization", "Organisation", "text", { autoComplete: "organization" })}
        {field("email", "Email address", "email", {
          autoComplete: "email",
          placeholder: "you@company.com",
        })}
        {field("password", "Password", "password", { autoComplete: "new-password" })}
        {field("confirm", "Confirm password", "password", { autoComplete: "new-password" })}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
