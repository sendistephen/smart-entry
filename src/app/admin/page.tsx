"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDemo } from "@/lib/store/demo-context";
import {
  Building2,
  Users,
  Sparkles,
  CreditCard,
  Clock,
  ShieldCheck,
  ChevronRight,
  Server,
  Activity,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/formatters";

export default function AdminOverviewPage() {
  const {
    properties,
    providers,
    subscriptions,
    users,
    auditLogs,
    role,
    setRole,
  } = useDemo();

  return (
    <AppShell>
      <PageHeader
        title="Platform Administration"
        description="Global multi-tenant platform metrics, residential organizations, system health, and cross-estate access audits."
        badge="HQ VIEW"
        actions={
          role !== "platform_admin" ? (
            <Button
              onClick={() => setRole("platform_admin")}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Switch to Platform Admin Role
            </Button>
          ) : (
            <span className="px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-200 text-zinc-900 border border-zinc-300">
              Active Platform Administrator
            </span>
          )
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard
          title="Organizations"
          value="3"
          subtitle="Real estate groups"
          icon={Building2}
        />
        <StatCard
          title="Properties"
          value={properties.length}
          subtitle="Enrolled complexes"
          icon={Building2}
        />
        <StatCard
          title="Active Users"
          value={users.length}
          subtitle="Managers & staff"
          icon={Users}
        />
        <StatCard
          title="Service Providers"
          value={providers.length}
          subtitle="Curated listings"
          icon={Sparkles}
        />
        <StatCard
          title="Subscriptions"
          value={subscriptions.length}
          subtitle="Active SaaS tiers"
          icon={CreditCard}
        />
        <StatCard
          title="Audit Trail"
          value={auditLogs.length}
          subtitle="System event logs"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 Cols: Platform Quick Navigation */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-200/70">
              <CardTitle className="text-base font-bold text-zinc-900">
                Platform Administrative Modules
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Core controls for platform governance and monetization.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-4 sm:p-5 sm:pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/organizations"
                className="p-3.5 rounded-sm border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-brand-700 transition-colors group flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-zinc-900 group-hover:underline">
                    Organizations & Properties
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-800 mt-0.5">
                    Manage multi-tenant property portfolios and owners.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
              </Link>

              <Link
                href="/admin/users"
                className="p-3.5 rounded-sm border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-brand-700 transition-colors group flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-zinc-900 group-hover:underline">
                    Users & Role Management
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-800 mt-0.5">
                    Assign manager, supervisor, and admin credentials.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
              </Link>

              <Link
                href="/admin/categories"
                className="p-3.5 rounded-sm border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-brand-700 transition-colors group flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-zinc-900 group-hover:underline">
                    Marketplace Categories
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-800 mt-0.5">
                    Configure approved trade disciplines and provider counts.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
              </Link>

              <Link
                href="/admin/subscriptions"
                className="p-3.5 rounded-sm border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-brand-700 transition-colors group flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-zinc-900 group-hover:underline">
                    Subscriptions & Billing
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-800 mt-0.5">
                    Review software recurring licenses and overdue invoices.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
              </Link>

              <Link
                href="/admin/audit-log"
                className="p-3.5 rounded-sm border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-brand-700 transition-colors group flex items-start justify-between sm:col-span-2"
              >
                <div>
                  <div className="font-bold text-sm text-zinc-900 group-hover:underline">
                    Platform Audit Trail
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-800 mt-0.5">
                    Full chronological action ledger for security compliance.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Platform Environment Health */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-200/70">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-zinc-700" />
                Demo Environment Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4 sm:p-5 sm:pt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-zinc-500">API Simulator:</span>
                <span className="font-semibold text-zinc-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-700" />
                  Online (Local Session)
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-zinc-500">Seed Database:</span>
                <span className="font-semibold text-zinc-900">
                  Synchronized
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-zinc-500">Push Notifications:</span>
                <span className="text-zinc-500 italic">Simulated in-app</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Gate Hardware:</span>
                <span className="text-zinc-500 italic">Mocked barriers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500">
                Recent admin audit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2 text-xs">
              {auditLogs.slice(0, 3).map((l) => (
                <div key={l.id} className="p-2 rounded-sm bg-white border border-zinc-200/70">
                  <div className="font-bold text-zinc-900">{l.action}</div>
                  <div className="text-[11px] text-zinc-500">{l.description}</div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    {formatRelativeTime(l.occurredAt)} • {l.actorName}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
