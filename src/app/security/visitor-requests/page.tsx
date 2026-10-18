"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { VisitorRequest, VisitType } from "@/types";
import { VisitorDetailDialog } from "@/components/dialogs/visitor-detail-dialog";
import { RegisterVisitorDialog } from "@/components/dialogs/register-visitor-dialog";
import {
  formatDateTime,
  formatRelativeTime,
} from "@/lib/formatters";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Eye,
  Filter,
} from "lucide-react";

export default function VisitorRequestsPage() {
  const {
    visitors,
    selectedPropertyId,
    approveVisitor,
    rejectVisitor,
  } = useDemo();

  const [activeTab, setActiveTab] = useState("awaiting_approval");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRequest | null>(null);

  const filtered = visitors.filter((v) => {
    const matchesProperty =
      selectedPropertyId === "all" || v.propertyId === selectedPropertyId;
    const matchesSearch =
      v.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      v.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.residentName.toLowerCase().includes(search.toLowerCase()) ||
      v.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || v.visitType === typeFilter;
    const matchesTab =
      activeTab === "all" ? true : v.status === activeTab;
    return matchesProperty && matchesSearch && matchesType && matchesTab;
  });

  const awaitingCount = visitors.filter(
    (v) =>
      (selectedPropertyId === "all" || v.propertyId === selectedPropertyId) &&
      v.status === "awaiting_approval"
  ).length;

  return (
    <AppShell>
      <PageHeader
        title="Visitor Requests & Authorizations"
        description="Review inbound access requests, resident decision statuses, pre-authorized guest invitations, and security overrides."
        actions={
          <RegisterVisitorDialog
            triggerButton={
              <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                <UserPlus className="w-4 h-4 mr-1.5" />
                New Visitor Request
              </Button>
            }
          />
        }
      />

      {/* Tabs and search filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full xl:w-auto">
            <TabsList className="bg-zinc-100 p-1 border border-zinc-200">
              <TabsTrigger
                value="awaiting_approval"
                className="text-xs data-[state=active]:bg-white data-[state=active]:font-semibold"
              >
                Awaiting Approval ({awaitingCount})
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="text-xs data-[state=active]:bg-white"
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="text-xs data-[state=active]:bg-white"
              >
                Rejected
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="text-xs data-[state=active]:bg-white"
              >
                All Requests ({visitors.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
              <Input
                placeholder="Search visitor, unit, host..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs border-zinc-300 bg-white"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(val) => {
                if (val) setTypeFilter(val);
              }}
            >
              <SelectTrigger className="h-8 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-200">
                <SelectItem value="all">All Visit Types</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
                <SelectItem value="service_provider">Service Provider</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Visitor Requests Cards List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-2">
            <ClipboardList className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="font-bold text-sm text-zinc-800">No requests found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              There are no visitor records matching the selected status and property filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <Card
              key={req.id}
              className="hover:bg-brand-50/40 transition-all cursor-pointer"
              onClick={() => setSelectedVisitor(req)}
            >
              <CardContent className="p-4 pt-4 sm:p-5 sm:pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base text-zinc-900">
                      {req.visitorName}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-white text-zinc-800 font-mono text-xs font-semibold">
                      Unit {req.unitNumber}
                    </span>
                    <StatusBadge status={req.status} />
                    <span className="text-[11px] font-mono text-zinc-400 ml-auto sm:ml-0">
                      {req.reference}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-600 pt-1">
                    <div>
                      <span className="text-zinc-400">Host Resident: </span>
                      <strong className="text-zinc-800">{req.residentName}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400">Barrier Gate: </span>
                      <span className="text-zinc-800 font-medium">{req.gateName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Arrival: </span>
                      <span className="text-zinc-800 font-medium">
                        {formatRelativeTime(req.arrivedAt)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 bg-white p-2 rounded-sm border border-zinc-150">
                    <span className="font-semibold text-zinc-700">Purpose: </span>
                    {req.purpose || "General personal visit"}
                  </p>
                </div>

                {/* Inline Action Buttons */}
                <div
                  className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/70"
                  onClick={(e) => e.stopPropagation()}
                >
                  {req.status === "awaiting_approval" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          rejectVisitor(req.id, "Declined from visitor requests queue")
                        }
                        className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs h-8"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1 text-zinc-600" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveVisitor(req.id)}
                        className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-8"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve Entry
                      </Button>
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVisitor(req)}
                    className="text-xs h-8 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visitor Detail Dialog */}
      <VisitorDetailDialog
        visitor={selectedVisitor}
        open={Boolean(selectedVisitor)}
        onOpenChange={(open) => !open && setSelectedVisitor(null)}
      />
    </AppShell>
  );
}
