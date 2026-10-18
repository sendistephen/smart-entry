import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  /** "highlight" fills the card with the brand color to draw attention. */
  tone?: "default" | "highlight";
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  tone = "default",
  onClick,
  className = "",
}: StatCardProps) {
  const highlight = tone === "highlight";

  return (
    <Card
      onClick={onClick}
      className={`h-full gap-0 py-0 transition-colors ${
        highlight ? "bg-brand-700 text-white" : "bg-card"
      } ${
        onClick
          ? `cursor-pointer ${highlight ? "hover:bg-brand-800" : "hover:bg-brand-50/40"}`
          : ""
      } ${className}`}
    >
      <div className="flex h-full flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-medium leading-tight ${
              highlight ? "text-brand-100" : "text-zinc-500"
            }`}
          >
            {title}
          </span>
          {Icon && (
            <div
              className={`hidden sm:flex w-7 h-7 rounded-sm items-center justify-center shrink-0 ${
                highlight ? "bg-white/10 text-white" : "bg-brand-50 text-brand-700"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div
          className={`mt-3 text-2xl sm:text-[28px] leading-none font-semibold tracking-tight tabular-nums whitespace-nowrap ${
            highlight ? "text-white" : "text-zinc-900"
          }`}
        >
          {value}
        </div>

        {(subtitle || trend) && (
          <div
            className={`mt-2 flex flex-wrap items-center gap-x-1.5 text-xs leading-snug ${
              highlight ? "text-brand-100" : "text-zinc-500"
            }`}
          >
            {trend && (
              <span
                className={`font-semibold ${
                  highlight ? "text-white" : "text-brand-700"
                }`}
              >
                {trend.value}
              </span>
            )}
            {trend?.label && <span>{trend.label}</span>}
            {subtitle && !trend && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
