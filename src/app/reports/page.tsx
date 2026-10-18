"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  KeyRound,
  Wrench,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { calculateTimeOnSite } from "@/lib/formatters";
import { toast } from "sonner";

export default function ReportsPage() {
  const { visitors, maintenance, deliveries, properties, selectedPropertyId } =
    useDemo();

  const [dateRange, setDateRange] = useState("30");

  const filteredVisitors = visitors.filter(
    (v) => selectedPropertyId === "all" || v.propertyId === selectedPropertyId
  );
  const filteredMaintenance = maintenance.filter(
    (m) => selectedPropertyId === "all" || m.propertyId === selectedPropertyId
  );
  const filteredDeliveries = deliveries.filter(
    (d) => selectedPropertyId === "all" || d.propertyId === selectedPropertyId
  );

  // Completed visits with timestamps
  const completedVisits = filteredVisitors.filter(
    (v) => v.checkedInAt && v.checkedOutAt
  );

  // Status breakdown pie data
  const statusCounts = {
    approved: filteredVisitors.filter((v) => v.status === "approved" || v.status === "checked_in").length,
    completed: filteredVisitors.filter((v) => v.status === "checked_out").length,
    rejected: filteredVisitors.filter((v) => v.status === "rejected").length,
    pending: filteredVisitors.filter((v) => v.status === "awaiting_approval").length,
  };

  const pieData = [
    { name: "Completed Visits", value: statusCounts.completed, fill: "#18181b" },
    { name: "Active / Approved", value: statusCounts.approved, fill: "#3f3f46" },
    { name: "Pending Approval", value: statusCounts.pending, fill: "#71717a" },
    { name: "Rejected Entries", value: statusCounts.rejected, fill: "#a1a1aa" },
  ];

  // Category breakdown
  const categoryCounts = [
    { name: "Electrical", count: filteredMaintenance.filter((m) => m.category === "Electrical").length },
    { name: "Plumbing", count: filteredMaintenance.filter((m) => m.category === "Plumbing").length },
    { name: "Carpentry", count: filteredMaintenance.filter((m) => m.category === "Carpentry").length },
    { name: "General Maint", count: filteredMaintenance.filter((m) => m.category === "General Maintenance").length },
  ];

  const exportReportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Report Metric,Value",
        `Total Gate Visitors,${filteredVisitors.length}`,
        `Completed Visits With Timestamps,${completedVisits.length}`,
        `Pending Approvals,${statusCounts.pending}`,
        `Rejected Visits,${statusCounts.rejected}`,
        `Total Maintenance Tickets,${filteredMaintenance.length}`,
        `Total Courier Deliveries,${filteredDeliveries.length}`,
        `Report Generation Date,${new Date().toISOString()}`,
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart_entry_analytics_summary_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Executive summary exported to CSV.");
  };

  return (
    <AppShell>
      <PageHeader
        title="Reports & Operational Analytics"
        description="Consolidated property throughput, visitor volume trends, barrier queue durations, and facilities resolution performance."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={dateRange}
              onValueChange={(val) => {
                if (val) setDateRange(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs border-zinc-300 bg-white min-w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-200">
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={exportReportCSV}
              className="border-zinc-300 text-xs sm:text-sm h-9 bg-white text-zinc-800 hover:bg-zinc-50"
            >
              <Download className="w-4 h-4 mr-1.5 text-zinc-600" />
              Export Summary
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Visitors Logged"
          value={filteredVisitors.length}
          subtitle="Across barrier gates"
          icon={KeyRound}
        />
        <StatCard
          title="Average Visit Time"
          value="1h 48m"
          subtitle="Based on closed exit logs"
          icon={Clock}
        />
        <StatCard
          title="Maintenance Tickets"
          value={filteredMaintenance.length}
          subtitle={`${filteredMaintenance.filter((m) => m.status === "completed").length} resolved`}
          icon={Wrench}
        />
        <StatCard
          title="Couriers Logged"
          value={filteredDeliveries.length}
          subtitle="Packages & food drops"
          icon={Truck}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Entry decisions pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-zinc-900">
              Access Decisions Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Distribution of resident visitor approvals vs rejections.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      color: "#fff",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between border-b border-zinc-200/70 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span className="text-zinc-700">{d.name}</span>
                  </div>
                  <span className="font-bold text-zinc-900">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Categories Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-zinc-900">
              Maintenance Tickets by Trade
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Infrastructure work orders categorized by discipline.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={{ stroke: "#e4e4e7" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={{ stroke: "#e4e4e7" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      color: "#fff",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Tickets" fill="#18181b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explanatory Demo Disclaimer */}
      <div className="p-4 rounded-sm bg-zinc-100 border border-zinc-200 text-xs text-zinc-600">
        <strong className="text-zinc-800">Demonstration Disclosure:</strong> The analytics figures and chart projections displayed here use seed data compiled for prospective client presentations. In production, these figures update in real time from live IoT barrier sensors and mobile app events.
      </div>
    </AppShell>
  );
}
