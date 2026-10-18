"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { VisitorRequest } from "@/types";
import { VisitorDetailDialog } from "@/components/dialogs/visitor-detail-dialog";
import {
  formatDateTime,
  calculateTimeOnSite,
  formatRelativeTime,
} from "@/lib/formatters";
import {
  Clock,
  Search,
  Download,
  Filter,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useVisitorsQuery } from "@/lib/queries/visitors";
import { toast } from "sonner";

export default function VisitHistoryPage() {
  const { selectedPropertyId, properties } = useDemo();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRequest | null>(null);

  const { data: filteredVisitors = [], isLoading } = useVisitorsQuery({
    propertyId: selectedPropertyId,
    search,
    statusFilter,
  });

  const exportCSV = () => {
    const headers = [
      "Reference",
      "Visitor Name",
      "Visit Type",
      "Property",
      "Unit",
      "Resident",
      "Barrier Gate",
      "Arrival Time",
      "Entry Time",
      "Exit Time",
      "Duration On Site",
      "Status",
    ];

    const rows = filteredVisitors.map((v) => [
      v.reference,
      `"${v.visitorName}"`,
      v.visitType,
      `"${v.propertyName}"`,
      v.unitNumber,
      `"${v.residentName}"`,
      `"${v.gateName}"`,
      v.arrivedAt || "",
      v.checkedInAt || "",
      v.checkedOutAt || "",
      `"${calculateTimeOnSite(v.checkedInAt, v.checkedOutAt)}"`,
      v.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart_entry_visit_history_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredVisitors.length} visit records to CSV.`);
  };

  const visitsPage = usePagination(filteredVisitors);

  return (
    <AppShell>
      <PageHeader
        title="Gate Visit History"
        description="Comprehensive audit log of visitor arrivals, resident decisions, physical barrier entries, and recorded exit times."
        actions={
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-zinc-300 text-xs sm:text-sm h-9 bg-white text-zinc-800 hover:bg-zinc-50"
          >
            <Download className="w-4 h-4 mr-1.5 text-zinc-600" />
            Export CSV ({filteredVisitors.length})
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder="Search visitor, unit, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs border-zinc-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) setStatusFilter(val);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-42.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="all">All Final Statuses</SelectItem>
              <SelectItem value="checked_out">Checked Out (Completed)</SelectItem>
              <SelectItem value="checked_in">Checked In (On Site)</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* History Data Table */}
      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Visitor name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Destination</th>
                <th className="px-3 py-2">Arrival time</th>
                <th className="px-3 py-2">Actual entry</th>
                <th className="px-3 py-2">Actual exit</th>
                <th className="px-3 py-2">Time on site</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {visitsPage.pageItems.map((vis) => (
                <tr
                  key={vis.id}
                  onClick={() => setSelectedVisitor(vis)}
                  className="hover:bg-card cursor-pointer transition-colors"
                >
                  <td data-label="Reference" className="px-3 py-2 font-mono font-bold text-zinc-900 text-xs">
                    {vis.reference}
                  </td>
                  <td data-label="Visitor name" className="px-3 py-2 font-semibold text-zinc-900">
                    {vis.visitorName}
                  </td>
                  <td data-label="Type" className="px-3 py-2 capitalize text-zinc-600">
                    {vis.visitType.replace("_", " ")}
                  </td>
                  <td data-label="Destination" className="px-3 py-2">
                    <span className="font-mono text-zinc-900 font-semibold block">
                      {vis.unitNumber}
                    </span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-30 block">
                      {vis.residentName}
                    </span>
                  </td>
                  <td data-label="Arrival time" className="px-3 py-2 text-zinc-600">
                    {formatDateTime(vis.arrivedAt)}
                  </td>
                  <td data-label="Actual entry" className="px-3 py-2 text-zinc-600">
                    {vis.checkedInAt ? formatDateTime(vis.checkedInAt) : "—"}
                  </td>
                  <td data-label="Actual exit" className="px-3 py-2 text-zinc-600">
                    {vis.checkedOutAt ? formatDateTime(vis.checkedOutAt) : "—"}
                  </td>
                  <td data-label="Time on site" className="px-3 py-2">
                    <span className="font-bold text-zinc-900">
                      {calculateTimeOnSite(vis.checkedInAt, vis.checkedOutAt)}
                    </span>
                  </td>
                  <td data-label="Status" className="px-3 py-2">
                    <StatusBadge status={vis.status} />
                  </td>
                  <td data-label="" className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVisitor(vis);
                      }}
                      className="h-7 text-xs text-zinc-700 hover:text-zinc-900"
                    >
                      Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...visitsPage} label="visits" />
      </Card>

      {/* Visitor Detail Dialog */}
      <VisitorDetailDialog
        visitor={selectedVisitor}
        open={Boolean(selectedVisitor)}
        onOpenChange={(open) => !open && setSelectedVisitor(null)}
      />
    </AppShell>
  );
}
