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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Resident, ResidentType } from "@/types";
import {
  Search,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

export default function UnitsResidentsPage() {
  const {
    units,
    residents,
    properties,
    visitors,
    selectedPropertyId,
    addResident,
  } = useDemo();

  const [activeTab, setActiveTab] = useState("residents");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [addResidentOpen, setAddResidentOpen] = useState(false);

  // New resident form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState(
    selectedPropertyId !== "all" ? selectedPropertyId : properties[0]?.id || "prop-1"
  );
  const [unitNumber, setUnitNumber] = useState("A-101");
  const [residentType, setResidentType] = useState<ResidentType>("tenant");
  const [emergencyContact, setEmergencyContact] = useState("");

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.firstName.toLowerCase().includes(search.toLowerCase()) ||
      r.lastName.toLowerCase().includes(search.toLowerCase()) ||
      r.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.propertyName.toLowerCase().includes(search.toLowerCase());
    const matchesProperty =
      selectedPropertyId === "all" || r.propertyId === selectedPropertyId;
    const matchesType = typeFilter === "all" || r.residentType === typeFilter;
    return matchesSearch && matchesProperty && matchesType;
  });

  const filteredUnits = units.filter((u) => {
    const matchesProperty =
      selectedPropertyId === "all" || u.propertyId === selectedPropertyId;
    const matchesSearch =
      u.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      (u.primaryResidentName &&
        u.primaryResidentName.toLowerCase().includes(search.toLowerCase()));
    return matchesProperty && matchesSearch;
  });

  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    addResident({
      firstName,
      lastName,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: phone || "+256 772 000111",
      propertyId,
      unitNumber,
      residentType,
      emergencyContact,
    });

    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setEmergencyContact("");
    setAddResidentOpen(false);
  };

  const getResidentVisitors = (residentId: string) =>
    visitors.filter((v) => v.residentId === residentId);

  const residentsPage = usePagination(filteredResidents);
  const unitsPage = usePagination(filteredUnits);

  return (
    <AppShell>
      <PageHeader
        title="Units & Residents"
        description="Directory of residential units, occupancy status, tenant vs owner profiles, and access authorization records."
        actions={
          <Dialog open={addResidentOpen} onOpenChange={setAddResidentOpen}>
            <DialogTrigger
              render={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add Resident
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Register New Resident</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Create resident account linked to a residential unit for visitor entry notifications.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddResident} className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">First Name *</label>
                    <Input
                      required
                      placeholder="e.g. Timothy"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Last Name *</label>
                    <Input
                      required
                      placeholder="e.g. Ssemwogerere"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Email Address</label>
                    <Input
                      type="email"
                      placeholder="resident@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Phone (UG)</label>
                    <Input
                      placeholder="+256 700 000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Property</label>
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
                    <label className="font-semibold text-zinc-700">Unit Number</label>
                    <Input
                      placeholder="e.g. A-104, B-202"
                      value={unitNumber}
                      onChange={(e) => setUnitNumber(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Resident Type</label>
                    <Select
                      value={residentType}
                      onValueChange={(val) => {
                        if (val) setResidentType(val as ResidentType);
                      }}
                    >
                      <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="owner">Property Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Emergency Contact</label>
                    <Input
                      placeholder="e.g. +256 701... (Spouse)"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddResidentOpen(false)}
                    className="border-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
                  >
                    Register Resident
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <TabsList className="bg-zinc-100 p-1 border border-zinc-200">
            <TabsTrigger
              value="residents"
              className="text-xs data-[state=active]:bg-white data-[state=active]:font-semibold"
            >
              Residents Directory ({filteredResidents.length})
            </TabsTrigger>
            <TabsTrigger
              value="units"
              className="text-xs data-[state=active]:bg-white data-[state=active]:font-semibold"
            >
              Units Master ({filteredUnits.length})
            </TabsTrigger>
          </TabsList>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
              <Input
                placeholder="Search name, unit, property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs border-zinc-300 bg-white"
              />
            </div>
            {activeTab === "residents" && (
              <Select
                value={typeFilter}
                onValueChange={(val) => {
                  if (val) setTypeFilter(val);
                }}
              >
                <SelectTrigger className="h-8 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="owner">Owners</SelectItem>
                  <SelectItem value="tenant">Tenants</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Tab 1: Residents List */}
        <TabsContent value="residents" className="m-0">
          <Card className="bg-white overflow-hidden">
            <div className="relative overflow-x-auto">
              <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                  <tr>
                    <th className="px-3 py-2">Resident</th>
                    <th className="px-3 py-2">Property / unit</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Recent visitors</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {residentsPage.pageItems.map((res) => (
                    <tr
                      key={res.id}
                      onClick={() => setSelectedResident(res)}
                      className="hover:bg-card cursor-pointer transition-colors"
                    >
                      <td data-label="Resident" className="px-3 py-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {res.avatarInitials}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 text-sm">
                              {res.firstName} {res.lastName}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              Joined {res.joinedDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Property / unit" className="px-3 py-2">
                        <span className="font-mono font-semibold text-zinc-900 block">
                          Unit {res.unitNumber}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {res.propertyName}
                        </span>
                      </td>
                      <td data-label="Type" className="px-3 py-2">
                        <span className="capitalize font-medium text-zinc-800">
                          {res.residentType}
                        </span>
                      </td>
                      <td data-label="Contact" className="px-3 py-2 space-y-0.5">
                        <div className="font-mono text-zinc-800">{res.phone}</div>
                        <div className="text-[11px] text-zinc-500">{res.email}</div>
                      </td>
                      <td data-label="Status" className="px-3 py-2">
                        <StatusBadge status={res.status} />
                      </td>
                      <td data-label="Recent visitors" className="px-3 py-2">
                        <span>
                          <span className="font-semibold text-zinc-900">
                            {res.recentVisitorCount}
                          </span>{" "}
                          visits logged
                        </span>
                      </td>
                      <td data-label="" className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResident(res);
                          }}
                          className="h-7 text-xs text-zinc-700 hover:text-zinc-900"
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination {...residentsPage} label="residents" />
          </Card>
        </TabsContent>

        {/* Tab 2: Units Master List */}
        <TabsContent value="units" className="m-0">
          <Card className="bg-white overflow-hidden">
            <div className="relative overflow-x-auto">
              <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                  <tr>
                    <th className="px-3 py-2">Unit number</th>
                    <th className="px-3 py-2">Property</th>
                    <th className="px-3 py-2">Building / block</th>
                    <th className="px-3 py-2">Occupancy status</th>
                    <th className="px-3 py-2">Primary resident</th>
                    <th className="px-3 py-2">Maintenance tickets</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {unitsPage.pageItems.map((u) => {
                    const prop = properties.find((p) => p.id === u.propertyId);
                    return (
                      <tr key={u.id} className="hover:bg-card transition-colors">
                        <td data-label="Unit number" className="px-3 py-2 font-mono font-bold text-zinc-900 text-sm">
                          {u.unitNumber}
                        </td>
                        <td data-label="Property" className="px-3 py-2 text-zinc-700">
                          {prop ? prop.name : "—"}
                        </td>
                        <td data-label="Building / block" className="px-3 py-2 text-zinc-500">
                          {u.buildingName || "Main Block"}
                        </td>
                        <td data-label="Occupancy status" className="px-3 py-2">
                          <StatusBadge status={u.occupancyStatus} />
                        </td>
                        <td data-label="Primary resident" className="px-3 py-2">
                          {u.primaryResidentName ? (
                            <span className="font-medium text-zinc-900">
                              {u.primaryResidentName}
                            </span>
                          ) : (
                            <span className="text-zinc-400 italic">Vacant Unit</span>
                          )}
                        </td>
                        <td data-label="Maintenance tickets" className="px-3 py-2">
                          {u.openMaintenanceCount > 0 ? (
                            <span className="font-semibold text-zinc-800">
                              {u.openMaintenanceCount} open
                            </span>
                          ) : (
                            <span className="text-zinc-400">None</span>
                          )}
                        </td>
                        <td data-label="" className="px-3 py-2 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast.info(
                                `Unit ${u.unitNumber} status toggle simulated in demo.`
                              );
                            }}
                            className="h-7 text-xs border-zinc-300"
                          >
                            Toggle Status
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TablePagination {...unitsPage} label="units" />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resident Profile Dialog */}
      {selectedResident && (
        <Dialog
          open={Boolean(selectedResident)}
          onOpenChange={(open) => !open && setSelectedResident(null)}
        >
          <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
            <DialogHeader className="border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm">
                  {selectedResident.avatarInitials}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    {selectedResident.firstName} {selectedResident.lastName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-500">
                    {selectedResident.propertyName} • Unit {selectedResident.unitNumber}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-sm bg-zinc-50 border border-zinc-200">
                <div>
                  <span className="text-zinc-500 block">Resident Status:</span>
                  <StatusBadge status={selectedResident.status} />
                </div>
                <div>
                  <span className="text-zinc-500 block">Occupancy Type:</span>
                  <span className="capitalize font-semibold text-zinc-900">
                    {selectedResident.residentType}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Phone Number:</span>
                  <span className="font-mono text-zinc-800">
                    {selectedResident.phone}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Email Address:</span>
                  <span className="text-zinc-800">{selectedResident.email}</span>
                </div>
              </div>

              {selectedResident.emergencyContact && (
                <div className="p-2.5 rounded-sm bg-zinc-100 border border-zinc-200">
                  <span className="text-zinc-500 block font-medium">
                    Emergency Contact:
                  </span>
                  <span className="font-semibold text-zinc-800">
                    {selectedResident.emergencyContact}
                  </span>
                </div>
              )}

              {/* Linked visitor history */}
              <div className="space-y-2">
                <span className="font-semibold text-zinc-800 block">
                  Recent Visitor Records for this Resident:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-zinc-200 rounded-sm p-2">
                  {getResidentVisitors(selectedResident.id).length === 0 ? (
                    <div className="text-zinc-400 py-2 text-center">
                      No active visitor records.
                    </div>
                  ) : (
                    getResidentVisitors(selectedResident.id).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-1.5 rounded-sm bg-zinc-50 text-[11px]"
                      >
                        <div>
                          <span className="font-semibold text-zinc-900">
                            {v.visitorName}
                          </span>
                          <span className="text-zinc-500 block">
                            {v.purpose} ({v.gateName})
                          </span>
                        </div>
                        <StatusBadge status={v.status} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedResident(null)}
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
