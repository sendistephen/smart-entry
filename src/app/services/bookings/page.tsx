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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { BookingStatus, ServiceBooking } from "@/types";
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
} from "@/lib/formatters";
import { Search, Plus } from "lucide-react";

export default function ServiceBookingsPage() {
  const {
    bookings,
    providers,
    residents,
    properties,
    selectedPropertyId,
    updateBookingStatus,
    addBooking,
  } = useDemo();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(
    null,
  );
  const [addBookingOpen, setAddBookingOpen] = useState(false);

  // New Booking State
  const [providerId, setProviderId] = useState(providers[0]?.id || "srv-1");
  const [residentId, setResidentId] = useState(residents[0]?.id || "res-1");
  const [serviceName, setServiceName] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("50000");

  const filteredBookings = bookings.filter((b) => {
    const matchesProperty =
      selectedPropertyId === "all" || b.propertyId === selectedPropertyId;
    const matchesSearch =
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.providerName.toLowerCase().includes(search.toLowerCase()) ||
      b.residentName.toLowerCase().includes(search.toLowerCase()) ||
      b.unitNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesProperty && matchesSearch && matchesStatus;
  });

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const res = residents.find((r) => r.id === residentId) || residents[0];
    const prov = providers.find((p) => p.id === providerId) || providers[0];

    addBooking({
      residentId: res.id,
      residentName: `${res.firstName} ${res.lastName}`,
      providerId: prov.id,
      providerName: prov.businessName,
      propertyId: res.propertyId,
      propertyName: res.propertyName,
      unitNumber: res.unitNumber,
      serviceName,
      estimatedAmount:
        parseInt(estimatedAmount, 10) || prov.indicativeStartingPrice,
    });

    setServiceName("");
    setAddBookingOpen(false);
  };

  const nextStatusMap: Record<BookingStatus, BookingStatus | null> = {
    requested: "accepted",
    accepted: "scheduled",
    scheduled: "in_progress",
    in_progress: "completed",
    completed: null,
    cancelled: null,
  };

  const bookingsPage = usePagination(filteredBookings);

  return (
    <AppShell>
      <PageHeader
        title="Service Bookings & Orders"
        description="Tracking on-demand maintenance appointments, cleaning schedules, and technician dispatches across residential units."
        actions={
          <Dialog open={addBookingOpen} onOpenChange={setAddBookingOpen}>
            <DialogTrigger
              render={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Booking
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Create Service Booking
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Request a vetted provider for a resident unit.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleAddBooking}
                className="space-y-3.5 pt-2 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">
                    Resident / Unit
                  </label>
                  <Select
                    value={residentId}
                    onValueChange={(val) => {
                      if (val) setResidentId(val);
                    }}
                  >
                    <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200">
                      {residents.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.propertyName} ({r.unitNumber}) - {r.firstName}{" "}
                          {r.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">
                    Service Provider
                  </label>
                  <Select
                    value={providerId}
                    onValueChange={(val) => {
                      if (val) {
                        setProviderId(val);
                        const p = providers.find((pv) => pv.id === val);
                        if (p)
                          setEstimatedAmount(
                            p.indicativeStartingPrice.toString(),
                          );
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200">
                      {providers.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.businessName} ({p.categories.join(", ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">
                    Service Required *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Master Bedroom Inverter Inspection"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">
                    Estimated Cost (UGX)
                  </label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddBookingOpen(false)}
                    className="border-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
                  >
                    Dispatch Booking
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder="Search booking, resident, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs border-zinc-300 bg-white"
          />
        </div>

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
            <SelectItem value="all">All Booking Statuses</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Service / request</th>
                <th className="px-3 py-2">Resident & unit</th>
                <th className="px-3 py-2">Service provider</th>
                <th className="px-3 py-2">Estimated fee</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Progress action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {bookingsPage.pageItems.map((b) => {
                const nextStatus = nextStatusMap[b.status];
                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-card cursor-pointer transition-colors"
                  >
                    <td data-label="Reference" className="px-3 py-2 font-mono font-bold text-zinc-900 text-xs">
                      {b.reference}
                    </td>
                    <td data-label="Service / request" className="px-3 py-2">
                      <div className="font-semibold text-zinc-900 text-sm">
                        {b.serviceName}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Requested {formatRelativeTime(b.requestedAt)}
                      </div>
                    </td>
                    <td data-label="Resident & unit" className="px-3 py-2">
                      <span className="font-mono font-semibold text-zinc-900 block">
                        Unit {b.unitNumber}
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        {b.residentName} ({b.propertyName})
                      </span>
                    </td>
                    <td data-label="Service provider" className="px-3 py-2">
                      <span className="font-medium text-zinc-900 block">
                        {b.providerName}
                      </span>
                    </td>
                    <td data-label="Estimated fee" className="px-3 py-2 font-mono font-bold text-zinc-900">
                      {formatCurrency(b.estimatedAmount)}
                    </td>
                    <td data-label="Status" className="px-3 py-2">
                      <StatusBadge status={b.status} />
                    </td>
                    <td data-label="" className="px-3 py-2 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {nextStatus && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateBookingStatus(b.id, nextStatus)
                            }
                            className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7 px-2.5 capitalize"
                          >
                            Mark {nextStatus.replace("_", " ")}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBooking(b)}
                          className="h-7 text-xs text-zinc-700 hover:text-zinc-900"
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination {...bookingsPage} label="bookings" />
      </Card>

      {/* Booking Detail Dialog */}
      {selectedBooking && (
        <Dialog
          open={Boolean(selectedBooking)}
          onOpenChange={(open) => !open && setSelectedBooking(null)}
        >
          <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
            <DialogHeader className="border-b border-zinc-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-500">
                  {selectedBooking.reference}
                </span>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-900 mt-1">
                {selectedBooking.serviceName}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                {selectedBooking.propertyName} • Unit{" "}
                {selectedBooking.unitNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-sm bg-zinc-50 border border-zinc-200">
                <div>
                  <span className="text-zinc-500 block">Resident:</span>
                  <span className="font-semibold text-zinc-900">
                    {selectedBooking.residentName}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Contractor:</span>
                  <span className="font-semibold text-zinc-900">
                    {selectedBooking.providerName}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Estimated Amount:</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {formatCurrency(selectedBooking.estimatedAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Requested At:</span>
                  <span className="text-zinc-800">
                    {formatDateTime(selectedBooking.requestedAt)}
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="p-2.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-700">
                  <span className="font-semibold text-zinc-800 block mb-0.5">
                    Resident Request Notes:
                  </span>
                  {selectedBooking.notes}
                </div>
              )}

              {/* Timeline */}
              {selectedBooking.timeline &&
                selectedBooking.timeline.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="font-semibold text-zinc-800 block text-xs">
                      Status progression audit
                    </span>
                    <ol className="space-y-0 pt-1">
                      {selectedBooking.timeline.map((evt, i, arr) => (
                        <li key={evt.id} className="relative flex gap-3 pb-3 last:pb-0">
                          {i < arr.length - 1 && (
                            <span
                              className="absolute left-1.75 top-2 -bottom-2 w-px bg-zinc-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex h-4 w-3.5 shrink-0 items-center justify-center">
                            <span
                              className={`h-2 w-2 rounded-full ring-2 ring-white ${
                                i === 0 ? "bg-zinc-900" : "bg-zinc-400"
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1 text-xs">
                            <div className="flex h-4 items-center justify-between gap-2">
                              <span className="font-semibold text-zinc-900 truncate leading-none">
                                {evt.action}
                              </span>
                              <span className="shrink-0 text-[10px] text-zinc-400 leading-none">
                                {formatDateTime(evt.occurredAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                              {evt.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedBooking(null)}
                className="border-zinc-300 text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}
