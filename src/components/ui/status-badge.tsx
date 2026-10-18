import React from "react";
import { Badge } from "@/components/ui/badge";

export type AnyStatus =
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "checked_in"
  | "checked_out"
  | "expired"
  | "cancelled"
  | "pending"
  | "assigned"
  | "in_progress"
  | "awaiting_parts"
  | "completed"
  | "requested"
  | "accepted"
  | "scheduled"
  | "occupied"
  | "vacant"
  | "maintenance"
  | "on_duty"
  | "off_duty"
  | "leave"
  | "active"
  | "inactive"
  | "verified"
  | "arrived"
  | "left_at_gate"
  | "delivered_to_resident"
  | "departed"
  | string;

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const norm = (status || "").toLowerCase().trim();

  switch (norm) {
    case "awaiting_approval":
    case "awaiting_resident_decision":
    case "requested":
    case "pending":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-800 border-zinc-200 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
          <span>Awaiting approval</span>
        </Badge>
      );

    case "approved":
    case "accepted":
    case "entry_approved":
      return (
        <Badge
          variant="outline"
          className={`bg-brand-700 text-white border-brand-800 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>Approved</span>
        </Badge>
      );

    case "checked_in":
      return (
        <Badge
          variant="outline"
          className={`bg-brand-700 text-white border-brand-800 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <span>Checked in</span>
        </Badge>
      );

    case "checked_out":
    case "departed":
    case "completed":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-700 border-zinc-200 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
          <span>{norm === "checked_out" ? "Checked out" : norm.replace("_", " ")}</span>
        </Badge>
      );

    case "in_progress":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-900 border-zinc-300 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span>In progress</span>
        </Badge>
      );

    case "assigned":
    case "scheduled":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-800 border-zinc-200 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
          <span>{norm}</span>
        </Badge>
      );

    case "rejected":
    case "entry_rejected":
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-700 border-zinc-300 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
          <span>{norm.replace("_", " ")}</span>
        </Badge>
      );

    case "occupied":
    case "active":
    case "on_duty":
    case "verified":
    case "delivered_to_resident":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-900 border-zinc-300 font-medium text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 shrink-0" />
          <span>{norm === "on_duty" ? "On duty" : norm.replace("_", " ")}</span>
        </Badge>
      );

    case "vacant":
    case "inactive":
    case "off_duty":
    case "leave":
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-50 text-zinc-500 border-zinc-200 font-normal text-xs gap-1.5 py-0.5 px-2 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
          <span>{norm.replace("_", " ")}</span>
        </Badge>
      );

    default:
      return (
        <Badge
          variant="outline"
          className={`bg-zinc-100 text-zinc-700 border-zinc-200 text-xs font-normal py-0.5 px-2 ${className}`}
        >
          <span>{norm.replace(/_/g, " ")}</span>
        </Badge>
      );
  }
}
