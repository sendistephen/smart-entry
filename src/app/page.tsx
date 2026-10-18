"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDemo } from "@/lib/store/demo-context";
import { RegisterVisitorDialog } from "@/components/dialogs/register-visitor-dialog";
import { VisitorDetailDialog } from "@/components/dialogs/visitor-detail-dialog";
import { VisitorRequest } from "@/types";
import { formatRelativeTime } from "@/lib/formatters";
import {
  Building2,
  Users,
  KeyRound,
  Wrench,
  Clock,
  Sparkles,
  ChevronRight,
  UserPlus,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useVisitorsQuery } from "@/lib/queries/visitors";

// Hex mirrors of the brand tokens in globals.css — SVG attributes can't read CSS vars.
const CHART = {
  primary: "#006360", // brand-700
  secondary: "#7ad7cf", // brand-300
  grid: "#f4f4f5",
  axis: "#a1a1aa",
  tooltip: "#002020", // brand-950
};

const DATE_FILTERS = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "7 days" },
  { value: "last_30_days", label: "30 days" },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PanelHeader({
  title,
  description,
  action,
}: {
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 pt-4 pb-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-700 hover:text-brand-900"
    >
      {children}
      <ChevronRight className="w-3.5 h-3.5" />
    </Link>
  );
}

const quickActionClass =
  "group flex flex-col items-start gap-2.5 rounded-sm bg-white p-3 text-left transition-colors hover:bg-brand-50";

function QuickActionBody({
  icon: Icon,
  label,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
}) {
  return (
    <>
      <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
        <Icon className="w-4 h-4" />
      </span>
      <span>
        <span className="block text-xs font-semibold text-zinc-900">{label}</span>
        <span className="block text-[11px] text-zinc-500">{hint}</span>
      </span>
    </>
  );
}

export default function DashboardOverviewPage() {
  const {
    role,
    selectedPropertyId,
    dateFilter,
    setDateFilter,
    properties,
    units,
    visitors,
    bookings,
    maintenance,
    auditLogs,
    approveVisitor,
    rejectVisitor,
  } = useDemo();

  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRequest | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  // TanStack Query for recent gate visitors
  const { data: recentVisitors = [], isLoading: isRecentVisitorsLoading } = useVisitorsQuery({
    propertyId: selectedPropertyId,
  });

  // Filter entities according to current selected property
  const filteredProperties =
    selectedPropertyId === "all"
      ? properties
      : properties.filter((p) => p.id === selectedPropertyId);

  const filteredVisitors =
    selectedPropertyId === "all"
      ? visitors
      : visitors.filter((v) => v.propertyId === selectedPropertyId);

  const filteredUnits =
    selectedPropertyId === "all"
      ? units
      : units.filter((u) => u.propertyId === selectedPropertyId);

  const filteredMaintenance =
    selectedPropertyId === "all"
      ? maintenance
      : maintenance.filter((m) => m.propertyId === selectedPropertyId);

  const filteredBookings =
    selectedPropertyId === "all"
      ? bookings
      : bookings.filter((b) => b.propertyId === selectedPropertyId);

  // Key metrics calculations
  const totalUnits = filteredUnits.length;
  const occupiedUnits = filteredUnits.filter((u) => u.occupancyStatus === "occupied").length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const awaitingApproval = filteredVisitors.filter((v) => v.status === "awaiting_approval");
  const onSiteVisitors = filteredVisitors.filter((v) => v.status === "checked_in");
  const openMaintenance = filteredMaintenance.filter(
    (m) => m.status === "pending" || m.status === "assigned" || m.status === "in_progress"
  );
  const activeBookings = filteredBookings.filter(
    (b) => b.status === "requested" || b.status === "in_progress" || b.status === "scheduled"
  );

  // 7-day visitor chart data
  const visitorChartData = [
    { day: "Mon", visitors: 18, deliveries: 6 },
    { day: "Tue", visitors: 24, deliveries: 9 },
    { day: "Wed", visitors: 21, deliveries: 7 },
    { day: "Thu", visitors: 29, deliveries: 12 },
    { day: "Fri", visitors: 35, deliveries: 15 },
    { day: "Sat", visitors: 42, deliveries: 14 },
    { day: "Sun", visitors: filteredVisitors.length + 12, deliveries: 8 },
  ];

  const weeklyVisitors = visitorChartData.reduce((sum, d) => sum + d.visitors, 0);
  const weeklyDeliveries = visitorChartData.reduce((sum, d) => sum + d.deliveries, 0);

  const entryStatuses = [
    { label: "Checked in · on site", count: onSiteVisitors.length, color: "bg-brand-700" },
    {
      label: "Approved · ready for gate",
      count: filteredVisitors.filter((v) => v.status === "approved").length,
      color: "bg-brand-500",
    },
    { label: "Awaiting resident", count: awaitingApproval.length, color: "bg-brand-300" },
    {
      label: "Checked out",
      count: filteredVisitors.filter((v) => v.status === "checked_out").length,
      color: "bg-zinc-300",
    },
  ];
  const entryTotal = entryStatuses.reduce((sum, s) => sum + s.count, 0);
  const percentOf = (n: number) => (entryTotal > 0 ? Math.round((n / entryTotal) * 100) : 0);

  return (
    <AppShell>
      <PageHeader
        title="Operations overview"
        description="Real-time operational summary across residential properties, access gates, service providers, and maintenance requests."
        badge="Demo mode"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-sm bg-zinc-100 p-0.5 text-xs font-medium">
              {DATE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setDateFilter(f.value)}
                  className={`px-2.5 py-1 rounded-sm transition-colors ${
                    dateFilter === f.value
                      ? "bg-brand-700 text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <RegisterVisitorDialog
              open={registerOpen}
              onOpenChange={setRegisterOpen}
              triggerButton={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Register Visitor
                </Button>
              }
            />
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        <StatCard
          title="Properties"
          value={filteredProperties.length}
          subtitle={
            selectedPropertyId === "all"
              ? "Registered estates"
              : filteredProperties[0]?.city
          }
          icon={Building2}
        />
        <StatCard
          title="Occupancy"
          value={`${occupancyRate}%`}
          subtitle={`${occupiedUnits} of ${totalUnits} units`}
          icon={Users}
        />
        <StatCard
          title="Visitors today"
          value={filteredVisitors.length}
          subtitle={`${onSiteVisitors.length} on site now`}
          icon={KeyRound}
        />
        <StatCard
          title="Awaiting approval"
          value={awaitingApproval.length}
          subtitle={awaitingApproval.length > 0 ? "Needs a decision" : "Queue is clear"}
          icon={Clock}
          tone={awaitingApproval.length > 0 ? "highlight" : "default"}
        />
        <StatCard
          title="Maintenance"
          value={openMaintenance.length}
          subtitle="Pending or active"
          icon={Wrench}
        />
        <StatCard
          title="Service bookings"
          value={activeBookings.length}
          subtitle="Scheduled or active"
          icon={Sparkles}
        />
      </div>

      {/* Approval queue — only when something needs a decision */}
      {awaitingApproval.length > 0 && (
        <Card className="mb-4 gap-0 py-0">
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-700" />
                </span>
                Visitors awaiting approval
                <span className="rounded-sm bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700 tabular-nums">
                  {awaitingApproval.length}
                </span>
              </span>
            }
            description="Approve or reject arrivals waiting at the barrier."
            action={<PanelLink href="/security/visitor-requests">Full queue</PanelLink>}
          />
          <div className="divide-y divide-zinc-200/70">
            {awaitingApproval.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={() => setSelectedVisitor(req)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                    {initials(req.visitorName)}
                  </span>
                  <span className="min-w-0 space-y-0.5">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-zinc-900 hover:underline">
                        {req.visitorName}
                      </span>
                      <span className="rounded-sm bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-700">
                        Unit {req.unitNumber}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400">{req.reference}</span>
                    </span>
                    <span className="block text-xs text-zinc-600">
                      Host <span className="font-medium text-zinc-800">{req.residentName}</span>
                      <span className="mx-1.5 text-zinc-300">/</span>
                      {req.gateName}
                      <span className="mx-1.5 text-zinc-300">/</span>
                      Arrived {formatRelativeTime(req.arrivedAt)}
                    </span>
                    <span className="block truncate text-xs text-zinc-500">{req.purpose}</span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => rejectVisitor(req.id, "Declined from overview dashboard")}
                    className="h-8 bg-white text-xs text-zinc-700 hover:bg-zinc-200"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => approveVisitor(req.id)}
                    className="h-8 bg-brand-700 text-xs font-medium text-white hover:bg-brand-800"
                  >
                    Approve entry
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Gate volume + side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2 min-w-0 gap-0 py-0">
          <PanelHeader
            title="Gate volume"
            description="Visitor and delivery entries over the past 7 days (sample data)."
          />
          <div className="flex flex-wrap items-end gap-x-8 gap-y-3 px-4 pb-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-brand-700" />
                Visitors
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {weeklyVisitors}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-brand-300" />
                Deliveries
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {weeklyDeliveries}
              </div>
            </div>
          </div>
          <div className="min-h-64 flex-1 w-full px-2 pb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visitorChartData}
                margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                barGap={3}
                barCategoryGap="28%"
              >
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: CHART.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: CHART.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 99, 96, 0.06)" }}
                  contentStyle={{
                    backgroundColor: CHART.tooltip,
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "12px",
                    padding: "8px 10px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: CHART.secondary, fontWeight: 600, marginBottom: 2 }}
                />
                <Bar dataKey="visitors" name="Visitors" fill={CHART.primary} radius={[2, 2, 0, 0]} maxBarSize={22} />
                <Bar dataKey="deliveries" name="Deliveries" fill={CHART.secondary} radius={[2, 2, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="gap-0 py-0">
            <PanelHeader title="Quick actions" description="Common front-desk tasks." />
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              <button type="button" onClick={() => setRegisterOpen(true)} className={quickActionClass}>
                <QuickActionBody icon={UserPlus} label="Log visitor" hint="Register at gate" />
              </button>
              <Link href="/units-residents" className={quickActionClass}>
                <QuickActionBody icon={Users} label="Add resident" hint="Assign to a unit" />
              </Link>
              <Link href="/properties" className={quickActionClass}>
                <QuickActionBody icon={Building2} label="Add property" hint="New estate" />
              </Link>
              <Link href="/services/maintenance" className={quickActionClass}>
                <QuickActionBody icon={Wrench} label="Log maintenance" hint="Open a ticket" />
              </Link>
            </div>
          </Card>

          <Card className="flex-1 gap-0 py-0">
            <PanelHeader
              title="Entry status"
              description="Where today's visitors are in the gate flow."
              action={
                <span className="block text-right">
                  <span className="block text-xl font-semibold leading-none text-zinc-900 tabular-nums">
                    {entryTotal}
                  </span>
                  <span className="text-[11px] text-zinc-500">visits</span>
                </span>
              }
            />
            <div className="px-4 pb-4">
              <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-sm bg-white">
                {entryStatuses.map(
                  (s) =>
                    s.count > 0 && (
                      <div
                        key={s.label}
                        className={`${s.color} h-full`}
                        style={{ width: `${percentOf(s.count)}%` }}
                      />
                    ),
                )}
              </div>
              <ul className="mt-4 space-y-2.5">
                {entryStatuses.map((s) => (
                  <li key={s.label} className="flex items-center gap-2 text-xs">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${s.color}`} />
                    <span className="flex-1 truncate text-zinc-600">{s.label}</span>
                    <span className="w-8 text-right text-zinc-400 tabular-nums">
                      {percentOf(s.count)}%
                    </span>
                    <span className="w-6 text-right font-semibold text-zinc-900 tabular-nums">
                      {s.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent gate activity + audit stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 min-w-0 bg-white gap-0 py-0">
          <PanelHeader
            title="Recent gate activity"
            description="Latest arrivals and their gate status."
            action={<PanelLink href="/security/live-gate">Live monitor</PanelLink>}
          />
          <div className="relative overflow-x-auto">
            <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-900 text-xs">
                <tr>
                  <th className="px-4 py-2 font-medium">Visitor</th>
                  <th className="px-3 py-2 font-medium">Unit</th>
                  <th className="px-3 py-2 font-medium">Gate / arrival</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium text-right">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isRecentVisitorsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td data-label="Visitor" className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-zinc-100" />
                          <div>
                            <div className="h-3 bg-zinc-200 rounded-sm w-24 mb-1" />
                            <div className="h-2 bg-zinc-100 rounded-sm w-16" />
                          </div>
                        </div>
                      </td>
                      <td data-label="Unit" className="px-3 py-2.5">
                        <div className="h-3 bg-zinc-200 rounded-sm w-12" />
                      </td>
                      <td data-label="Gate / arrival" className="px-3 py-2.5">
                        <div className="h-3 bg-zinc-200 rounded-sm w-20" />
                      </td>
                      <td data-label="Status" className="px-3 py-2.5">
                        <div className="h-5 bg-zinc-100 rounded-full w-20" />
                      </td>
                      <td data-label="" className="px-4 py-2.5">
                        <div className="h-6 bg-zinc-100 rounded-sm w-12 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : recentVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-zinc-500 text-xs">
                      <DoorOpen className="mx-auto mb-2 h-5 w-5 text-zinc-300" />
                      No recent gate visits recorded.
                    </td>
                  </tr>
                ) : (
                  recentVisitors.slice(0, 5).map((vis) => (
                    <tr
                      key={vis.id}
                      onClick={() => setSelectedVisitor(vis)}
                      className="hover:bg-card cursor-pointer transition-colors"
                    >
                      <td data-label="Visitor" className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-600">
                            {initials(vis.visitorName)}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 truncate">{vis.visitorName}</div>
                            <div className="text-[11px] text-zinc-500 capitalize">
                              {vis.visitType.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Unit" className="px-3 py-2.5">
                        <span className="font-mono font-medium text-zinc-800">{vis.unitNumber}</span>
                        <div className="text-[11px] text-zinc-500 truncate max-w-30">{vis.residentName}</div>
                      </td>
                      <td data-label="Gate / arrival" className="px-3 py-2.5">
                        <div className="font-medium text-zinc-800">{vis.gateName}</div>
                        <div className="text-[11px] text-zinc-500">{formatRelativeTime(vis.arrivedAt)}</div>
                      </td>
                      <td data-label="Status" className="px-3 py-2.5">
                        <StatusBadge status={vis.status} />
                      </td>
                      <td data-label="" className="px-4 py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVisitor(vis);
                          }}
                          className="h-7 text-xs text-brand-700 hover:text-brand-900 hover:bg-brand-50"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="gap-0 py-0">
          <PanelHeader
            title="Activity audit stream"
            description="Latest operational events."
            action={
              role === "platform_admin" ? <PanelLink href="/admin/audit-log">All logs</PanelLink> : undefined
            }
          />
          <ol className="px-4 pb-4">
            {auditLogs.slice(0, 5).map((log, i, arr) => (
              <li key={log.id} className="relative flex gap-3 pb-3.5 last:pb-0">
                {i < arr.length - 1 && (
                  <span
                    className="absolute left-1.75 top-2 -bottom-2 w-px bg-zinc-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex h-4 w-3.5 shrink-0 items-center justify-center">
                  <span
                    className={`h-2 w-2 rounded-full ring-2 ring-white ${
                      i === 0 ? "bg-brand-700" : "bg-zinc-400"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex h-4 items-center justify-between gap-2">
                    <span className="font-semibold text-zinc-900 truncate leading-none">
                      {log.action}
                    </span>
                    <span className="shrink-0 text-[10px] text-zinc-400 leading-none">
                      {formatRelativeTime(log.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 line-clamp-2">
                    {log.description}
                  </p>
                  <span className="mt-0.5 block text-[10px] text-zinc-400">
                    {log.actorName}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <VisitorDetailDialog
        visitor={selectedVisitor}
        open={Boolean(selectedVisitor)}
        onOpenChange={(open) => !open && setSelectedVisitor(null)}
      />
    </AppShell>
  );
}
