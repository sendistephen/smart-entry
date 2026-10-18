"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { MaintenanceRequest, Priority } from "@/types";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters";
import { Search, Plus, CheckCircle2 } from "lucide-react";

export default function MaintenancePage() {
  const {
    maintenance,
    properties,
    providers,
    selectedPropertyId,
    updateMaintenanceStatus,
    createMaintenanceRequest,
  } = useDemo();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] =
    useState<MaintenanceRequest | null>(null);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  // New Ticket Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [propertyId, setPropertyId] = useState(
    selectedPropertyId !== "all"
      ? selectedPropertyId
      : properties[0]?.id || "prop-1",
  );
  const [unitNumber, setUnitNumber] = useState("Common Area");
  const [reportedBy, setReportedBy] = useState("Property Manager");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [assignedProviderId, setAssignedProviderId] = useState<string>("");

  const filteredTickets = maintenance.filter((m) => {
    const matchesProperty =
      selectedPropertyId === "all" || m.propertyId === selectedPropertyId;
    const matchesSearch =
      m.reference.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
      m.unitNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || m.priority === priorityFilter;
    return matchesProperty && matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createMaintenanceRequest({
      title,
      category,
      propertyId,
      unitNumber,
      reportedBy,
      description: description || "Reported through facilities portal",
      priority,
      assignedProviderId: assignedProviderId || undefined,
    });

    setTitle("");
    setDescription("");
    setCreateTicketOpen(false);
  };

  const priorityBadge = (p: Priority) => {
    switch (p) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-semibold bg-brand-700 text-white">
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-medium bg-zinc-200 text-zinc-900 border border-zinc-300">
            High
          </span>
        );
      case "normal":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-normal bg-zinc-100 text-zinc-500">
            Low
          </span>
        );
    }
  };

  const ticketsPage = usePagination(filteredTickets);

  return (
    <AppShell>
      <PageHeader
        title="Maintenance Requests & Work Orders"
        description="Log facilities defects, assign contractors from the vetted directory, track repair stages, and verify completed works."
        actions={
          <Dialog open={createTicketOpen} onOpenChange={setCreateTicketOpen}>
            <DialogTrigger
              render={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Log Maintenance Ticket
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  New Maintenance Ticket
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Record an infrastructure defect or resident maintenance
                  request.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleCreateTicket}
                className="space-y-3.5 pt-2 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">
                    Issue Summary / Title *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Corridor lighting sensor failure"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">
                      Category
                    </label>
                    <Select
                      value={category}
                      onValueChange={(val) => {
                        if (val) setCategory(val);
                      }}
                    >
                      <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Carpentry">Carpentry</SelectItem>
                        <SelectItem value="General Maintenance">
                          General Maintenance
                        </SelectItem>
                        <SelectItem value="Appliance Repair">
                          Appliance Repair
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">
                      Priority Level
                    </label>
                    <Select
                      value={priority}
                      onValueChange={(val) => {
                        if (val) setPriority(val as Priority);
                      }}
                    >
                      <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">
                      Property
                    </label>
                    <Select
                      value={propertyId}
                      onValueChange={(val) => {
                        if (val) setPropertyId(val);
                      }}
                    >
                      <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        {properties.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">
                      Unit / Area
                    </label>
                    <Input
                      placeholder="e.g. Unit A-102, Main Gate"
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">
                    Assign Contractor (Optional)
                  </label>
                  <Select
                    value={assignedProviderId}
                    onValueChange={(val) => {
                      if (val) setAssignedProviderId(val);
                    }}
                  >
                    <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                      <SelectValue placeholder="Select contractor" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200">
                      <SelectItem value="none">
                        Unassigned / In-house
                      </SelectItem>
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
                    Description of Issue
                  </label>
                  <Textarea
                    placeholder="Details regarding defect, affected fittings, risk assessment..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-xs min-h-16.25 border-zinc-300"
                  />
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateTicketOpen(false)}
                    className="border-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
                  >
                    Submit Ticket
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
            placeholder="Search ticket, defect, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs border-zinc-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={priorityFilter}
            onValueChange={(val) => {
              if (val) setPriorityFilter(val);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-32.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) setStatusFilter(val);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-37.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="all">All Ticket Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="awaiting_parts">Awaiting Parts</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Maintenance Tickets Table */}
      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Issue title</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Location / unit</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">Contractor</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ticketsPage.pageItems.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="hover:bg-card cursor-pointer transition-colors"
                >
                  <td data-label="Reference" className="px-3 py-2 font-mono font-bold text-zinc-900 text-xs">
                    {t.reference}
                  </td>
                  <td data-label="Issue title" className="px-3 py-2">
                    <div className="font-semibold text-zinc-900 text-sm">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Reported by {t.reportedBy} (
                      {formatRelativeTime(t.createdAt)})
                    </div>
                  </td>
                  <td data-label="Category" className="px-3 py-2 font-medium text-zinc-700">
                    {t.category}
                  </td>
                  <td data-label="Location / unit" className="px-3 py-2">
                    <span className="font-mono font-semibold text-zinc-900 block">
                      {t.unitNumber}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {t.propertyName}
                    </span>
                  </td>
                  <td data-label="Priority" className="px-3 py-2">{priorityBadge(t.priority)}</td>
                  <td data-label="Contractor" className="px-3 py-2">
                    {t.assignedProviderName ? (
                      <span className="font-medium text-zinc-900">
                        {t.assignedProviderName}
                      </span>
                    ) : (
                      <span className="text-zinc-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td data-label="Status" className="px-3 py-2">
                    <StatusBadge status={t.status} />
                  </td>
                  <td data-label="" className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(t);
                      }}
                      className="h-7 text-xs text-zinc-700 hover:text-zinc-900"
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...ticketsPage} label="tickets" />
      </Card>

      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog
          open={Boolean(selectedTicket)}
          onOpenChange={(open) => !open && setSelectedTicket(null)}
        >
          <DialogContent className="sm:max-w-lg bg-white border-zinc-200 text-zinc-900">
            <DialogHeader className="border-b border-zinc-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-500">
                  {selectedTicket.reference}
                </span>
                <div className="flex items-center gap-2">
                  {priorityBadge(selectedTicket.priority)}
                  <StatusBadge status={selectedTicket.status} />
                </div>
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-900 mt-1">
                {selectedTicket.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                {selectedTicket.propertyName} • {selectedTicket.unitNumber} •
                Category: {selectedTicket.category}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <span className="font-semibold text-zinc-700 block mb-1">
                  Defect Description:
                </span>
                <p className="p-3 rounded-sm bg-zinc-50 text-zinc-800 border border-zinc-200 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-sm bg-zinc-50 border border-zinc-200">
                <div>
                  <span className="text-zinc-500 block">Reported By:</span>
                  <span className="font-semibold text-zinc-900">
                    {selectedTicket.reportedBy}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">
                    Assigned Contractor:
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {selectedTicket.assignedProviderName || "None assigned"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Created On:</span>
                  <span className="text-zinc-800">
                    {formatDateTime(selectedTicket.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Last Updated:</span>
                  <span className="text-zinc-800">
                    {formatDateTime(selectedTicket.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Status progression quick actions */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <span className="font-semibold text-zinc-800 block">
                  Update Ticket Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateMaintenanceStatus(selectedTicket.id, "in_progress");
                      setSelectedTicket(null);
                    }}
                    className="border-zinc-300 text-xs h-7"
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateMaintenanceStatus(
                        selectedTicket.id,
                        "awaiting_parts",
                      );
                      setSelectedTicket(null);
                    }}
                    className="border-zinc-300 text-xs h-7"
                  >
                    Awaiting Parts
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      updateMaintenanceStatus(selectedTicket.id, "completed");
                      setSelectedTicket(null);
                    }}
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Mark Completed
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedTicket(null)}
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
