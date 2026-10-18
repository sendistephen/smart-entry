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
import { Guard } from "@/types";
import {
  ShieldCheck,
  Search,
  UserCheck,
  Plus,
  Phone,
  Clock,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters";

export default function GuardsPage() {
  const { guards, properties, selectedPropertyId, addGuard, toggleGuardDuty } =
    useDemo();

  const [search, setSearch] = useState("");
  const [addGuardOpen, setAddGuardOpen] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState(
    selectedPropertyId !== "all" ? selectedPropertyId : properties[0]?.id || "prop-1"
  );
  const [gateName, setGateName] = useState("Main Gate");
  const [shift, setShift] = useState("Day Shift (06:00 - 18:00)");

  const selectedProp = properties.find((p) => p.id === propertyId) || properties[0];

  const filteredGuards = guards.filter((g) => {
    const matchesProperty =
      selectedPropertyId === "all" || g.propertyId === selectedPropertyId;
    const matchesSearch =
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      g.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      g.gateName.toLowerCase().includes(search.toLowerCase());
    return matchesProperty && matchesSearch;
  });

  const handleAddGuard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    addGuard({
      fullName,
      phone: phone || "+256 770 123456",
      propertyId,
      propertyName: selectedProp.name,
      gateName,
      shift,
      dutyStatus: "on_duty",
    });

    setFullName("");
    setPhone("");
    setAddGuardOpen(false);
  };

  const guardsPage = usePagination(filteredGuards);

  return (
    <AppShell>
      <PageHeader
        title="Security Guard Roster"
        description="Assigned security personnel, shift hours, barrier gate responsibilities, and live duty status."
        actions={
          <Dialog open={addGuardOpen} onOpenChange={setAddGuardOpen}>
            <DialogTrigger
              render={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Assign Guard
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Assign Security Guard</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Assign an officer to an entrance barrier or perimeter gate.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddGuard} className="space-y-3.5 pt-2 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Samson Ouma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Contact Number</label>
                  <Input
                    placeholder="+256 771 000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Assigned Property</label>
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
                    <label className="font-semibold text-zinc-700">Barrier Gate</label>
                    <Select
                      value={gateName}
                      onValueChange={(val) => {
                        if (val) setGateName(val);
                      }}
                    >
                      <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        {selectedProp.gates.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Shift Schedule</label>
                  <Select
                    value={shift}
                    onValueChange={(val) => {
                      if (val) setShift(val);
                    }}
                  >
                    <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200">
                      <SelectItem value="Day Shift (06:00 - 18:00)">
                        Day Shift (06:00 - 18:00)
                      </SelectItem>
                      <SelectItem value="Night Shift (18:00 - 06:00)">
                        Night Shift (18:00 - 06:00)
                      </SelectItem>
                      <SelectItem value="Full Rotation">Full Rotation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddGuardOpen(false)}
                    className="border-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
                  >
                    Confirm Assignment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search Bar */}
      <div className="relative w-full sm:w-80 mb-6">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
        <Input
          placeholder="Search guard name, ID, gate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-xs border-zinc-300 bg-white"
        />
      </div>

      {/* Guards Table */}
      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Security officer</th>
                <th className="px-3 py-2">Employee ID</th>
                <th className="px-3 py-2">Property / gate</th>
                <th className="px-3 py-2">Shift schedule</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Duty status</th>
                <th className="px-3 py-2">Last recorded activity</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {guardsPage.pageItems.map((g) => (
                <tr key={g.id} className="hover:bg-card transition-colors">
                  <td data-label="Security officer" className="px-3 py-2">
                    <div className="font-bold text-zinc-900 text-sm">
                      {g.fullName}
                    </div>
                  </td>
                  <td data-label="Employee ID" className="px-3 py-2 font-mono font-semibold text-zinc-800">
                    {g.employeeId}
                  </td>
                  <td data-label="Property / gate" className="px-3 py-2">
                    <span className="font-medium text-zinc-900 block">
                      {g.gateName}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {g.propertyName}
                    </span>
                  </td>
                  <td data-label="Shift schedule" className="px-3 py-2 text-zinc-600">{g.shift}</td>
                  <td data-label="Phone" className="px-3 py-2 font-mono text-zinc-800">{g.phone}</td>
                  <td data-label="Duty status" className="px-3 py-2">
                    <StatusBadge status={g.dutyStatus} />
                  </td>
                  <td data-label="Last recorded activity" className="px-3 py-2 text-zinc-500">
                    {formatRelativeTime(g.lastActivityAt)}
                  </td>
                  <td data-label="" className="px-3 py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleGuardDuty(g.id)}
                      className="h-7 text-xs border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                    >
                      Toggle Duty
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...guardsPage} label="guards" />
      </Card>
    </AppShell>
  );
}
