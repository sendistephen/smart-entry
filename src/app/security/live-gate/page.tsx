"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { VisitorRequest } from "@/types";
import { RegisterVisitorDialog } from "@/components/dialogs/register-visitor-dialog";
import { VisitorDetailDialog } from "@/components/dialogs/visitor-detail-dialog";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters";
import { Search } from "lucide-react";
import { useVisitorsQuery, useVisitorMutations } from "@/lib/queries/visitors";

export default function LiveGateActivityPage() {
  const { selectedPropertyId } = useDemo();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRequest | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  // TanStack Query for table data
  const { data: visitors = [], isLoading, isFetching } = useVisitorsQuery({
    propertyId: selectedPropertyId,
    search,
    statusFilter,
  });

  // TanStack Query mutations
  const {
    approveMutation,
    checkInMutation,
    checkOutMutation,
  } = useVisitorMutations();

  const onSiteCount = visitors.filter((v) => v.status === "checked_in").length;
  const awaitingCount = visitors.filter((v) => v.status === "awaiting_approval").length;
  const approvedReady = visitors.filter((v) => v.status === "approved").length;

  const visitorsPage = usePagination(visitors);

  return (
    <AppShell>
      <PageHeader
        title="Live gate activity"
        description="Real-time monitoring of arrival barriers, resident access decisions, physical check-ins, and departures."
        badge="Barrier control"
        actions={
          <RegisterVisitorDialog
            open={registerOpen}
            onOpenChange={setRegisterOpen}
            triggerButton={
              <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                Register visitor
              </Button>
            }
          />
        }
      />

      {/* Top Banner */}
      <div className="p-3 mb-5 rounded-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>
            <strong className="text-zinc-900 font-semibold">Live feed:</strong> {onSiteCount} visitors currently on site, {approvedReady} approved at barrier, and {awaitingCount} awaiting resident response.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-[11px] text-zinc-500 font-normal">
              Updating feed...
            </span>
          )}
          <span className="px-2 py-0.5 rounded-sm bg-zinc-100 font-mono text-[11px] text-zinc-600">
            Barrier telemetry
          </span>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
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
            <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="checked_in">Checked in (on site)</SelectItem>
              <SelectItem value="approved">Approved (at barrier)</SelectItem>
              <SelectItem value="awaiting_approval">Awaiting approval</SelectItem>
              <SelectItem value="checked_out">Checked out (departed)</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gate Activity Table Powered by TanStack Query */}
      <Card className="bg-white overflow-hidden mb-6">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Visitor details</th>
                <th className="px-3 py-2">Destination unit</th>
                <th className="px-3 py-2">Gate barrier</th>
                <th className="px-3 py-2">Arrival time</th>
                <th className="px-3 py-2">Entry / exit</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                // Clean skeleton loading state
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td data-label="Visitor details" className="px-3 py-2.5">
                      <div className="h-3.5 bg-zinc-200 rounded-sm w-28 mb-1.5" />
                      <div className="h-2.5 bg-zinc-100 rounded-sm w-16" />
                    </td>
                    <td data-label="Destination unit" className="px-3 py-2.5">
                      <div className="h-3.5 bg-zinc-200 rounded-sm w-12 mb-1.5" />
                      <div className="h-2.5 bg-zinc-100 rounded-sm w-24" />
                    </td>
                    <td data-label="Gate barrier" className="px-3 py-2.5">
                      <div className="h-3 bg-zinc-200 rounded-sm w-20" />
                    </td>
                    <td data-label="Arrival time" className="px-3 py-2.5">
                      <div className="h-3 bg-zinc-200 rounded-sm w-24" />
                    </td>
                    <td data-label="Entry / exit" className="px-3 py-2.5">
                      <div className="h-3 bg-zinc-100 rounded-sm w-20" />
                    </td>
                    <td data-label="Status" className="px-3 py-2.5">
                      <div className="h-5 bg-zinc-100 rounded-full w-20" />
                    </td>
                    <td data-label="" className="px-3 py-2.5 text-right">
                      <div className="h-6 bg-zinc-100 rounded-sm w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-zinc-500 text-xs">
                    No visitor records found matching your filters.
                  </td>
                </tr>
              ) : (
                visitorsPage.pageItems.map((vis) => (
                  <tr
                    key={vis.id}
                    onClick={() => setSelectedVisitor(vis)}
                    className="hover:bg-card cursor-pointer transition-colors"
                  >
                    <td data-label="Visitor details" className="px-3 py-2">
                      <div className="font-semibold text-zinc-900 text-sm">
                        {vis.visitorName}
                      </div>
                      <div className="text-[11px] text-zinc-500 capitalize flex items-center gap-1.5">
                        <span>{vis.visitType.replace("_", " ")}</span>
                        <span>•</span>
                        <span className="font-mono text-zinc-600">{vis.reference}</span>
                      </div>
                    </td>
                    <td data-label="Destination unit" className="px-3 py-2">
                      <span className="font-mono font-medium text-zinc-900 block">
                        {vis.unitNumber}
                      </span>
                      <span className="text-[11px] text-zinc-500 truncate max-w-36 block">
                        {vis.residentName}
                      </span>
                    </td>
                    <td data-label="Gate barrier" className="px-3 py-2">
                      <span className="font-medium text-zinc-800 block">
                        {vis.gateName}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {vis.propertyName}
                      </span>
                    </td>
                    <td data-label="Arrival time" className="px-3 py-2">
                      <span className="font-medium text-zinc-900 block">
                        {formatRelativeTime(vis.arrivedAt)}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {formatDateTime(vis.arrivedAt)}
                      </span>
                    </td>
                    <td data-label="Entry / exit" className="px-3 py-2">
                      {vis.checkedInAt ? (
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-medium text-zinc-800">
                            In: {formatDateTime(vis.checkedInAt)}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Out: {vis.checkedOutAt ? formatDateTime(vis.checkedOutAt) : "On premises"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">Not entered barrier</span>
                      )}
                    </td>
                    <td data-label="Status" className="px-3 py-2">
                      <StatusBadge status={vis.status} />
                    </td>
                    <td data-label="" className="px-3 py-2 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {vis.status === "awaiting_approval" && (
                          <Button
                            size="sm"
                            disabled={approveMutation.isPending}
                            onClick={() => approveMutation.mutate({ id: vis.id })}
                            className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7 px-2.5"
                          >
                            Approve
                          </Button>
                        )}

                        {vis.status === "approved" && (
                          <Button
                            size="sm"
                            disabled={checkInMutation.isPending}
                            onClick={() => checkInMutation.mutate(vis.id)}
                            className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7 px-2.5"
                          >
                            Check in
                          </Button>
                        )}

                        {vis.status === "checked_in" && (
                          <Button
                            size="sm"
                            disabled={checkOutMutation.isPending}
                            onClick={() => checkOutMutation.mutate(vis.id)}
                            className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7 px-2.5"
                          >
                            Check out
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVisitor(vis)}
                          className="text-xs h-7 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination {...visitorsPage} label="visitors" />
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
