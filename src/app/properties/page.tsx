"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemo } from "@/lib/store/demo-context";
import { Property } from "@/types";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Shield,
  Users,
  KeyRound,
  Wrench,
  Check,
  ChevronRight,
  Filter,
} from "lucide-react";
import { formatDateTime } from "@/lib/formatters";

export default function PropertiesPage() {
  const {
    properties,
    units,
    residents,
    guards,
    maintenance,
    addProperty,
    selectedPropertyId,
  } = useDemo();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add property form state
  const [newPropName, setNewPropName] = useState("");
  const [newPropType, setNewPropType] = useState<Property["type"]>("apartment_complex");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [newPropCity, setNewPropCity] = useState("Kampala");
  const [newPropUnits, setNewPropUnits] = useState("30");
  const [newPropGates, setNewPropGates] = useState("Main Gate, Residents Barrier");

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesSelected =
      selectedPropertyId === "all" || p.id === selectedPropertyId;
    return matchesSearch && matchesType && matchesSelected;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) return;

    const gatesList = newPropGates
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    addProperty({
      name: newPropName,
      type: newPropType,
      address: newPropAddress,
      city: newPropCity,
      totalUnits: parseInt(newPropUnits, 10) || 20,
      gates: gatesList.length > 0 ? gatesList : ["Main Gate"],
      notes: "Created in demo session",
    });

    setNewPropName("");
    setNewPropAddress("");
    setAddDialogOpen(false);
  };

  const getPropUnits = (propId: string) => units.filter((u) => u.propertyId === propId);
  const getPropResidents = (propId: string) => residents.filter((r) => r.propertyId === propId);
  const getPropGuards = (propId: string) => guards.filter((g) => g.propertyId === propId);
  const getPropMaintenance = (propId: string) => maintenance.filter((m) => m.propertyId === propId);

  return (
    <AppShell>
      <PageHeader
        title="Residential Properties"
        description="Manage estates, apartment complexes, access gates, and designated security teams across your portfolio."
        actions={
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger
              render={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Property
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Add New Property</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Register a residential community or building into the management portal.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddSubmit} className="space-y-3.5 pt-2 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Property Name *</label>
                  <Input
                    required
                    placeholder="e.g. Victoria View Apartments"
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Property Type</label>
                    <Select
                      value={newPropType}
                      onValueChange={(val) => {
                        if (val) setNewPropType(val as Property["type"]);
                      }}
                    >
                      <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        <SelectItem value="apartment_complex">Apartment Complex</SelectItem>
                        <SelectItem value="gated_community">Gated Community</SelectItem>
                        <SelectItem value="residential_estate">Residential Estate</SelectItem>
                        <SelectItem value="standalone_building">Standalone Building</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">City / District</label>
                    <Input
                      placeholder="e.g. Kampala, Entebbe, Wakiso"
                      value={newPropCity}
                      onChange={(e) => setNewPropCity(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Address / Location</label>
                  <Input
                    required
                    placeholder="e.g. Plot 12 Lugogo Bypass"
                    value={newPropAddress}
                    onChange={(e) => setNewPropAddress(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Total Units</label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={newPropUnits}
                      onChange={(e) => setNewPropUnits(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Gate Barriers</label>
                    <Input
                      placeholder="Main Gate, Service Gate"
                      value={newPropGates}
                      onChange={(e) => setNewPropGates(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                    className="border-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
                  >
                    Create Property
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
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-600" />
          <Input
            placeholder="Search property, location, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs border-zinc-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={typeFilter}
            onValueChange={(val) => {
              if (val) setTypeFilter(val);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-42.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="all">All Property Types</SelectItem>
              <SelectItem value="apartment_complex">Apartment Complex</SelectItem>
              <SelectItem value="gated_community">Gated Community</SelectItem>
              <SelectItem value="residential_estate">Residential Estate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {filteredProperties.map((prop) => {
          const propUnits = getPropUnits(prop.id);
          const propResidents = getPropResidents(prop.id);
          const propGuards = getPropGuards(prop.id);
          const propMaint = getPropMaintenance(prop.id);
          const occupancy =
            prop.totalUnits > 0
              ? Math.round((prop.occupiedUnits / prop.totalUnits) * 100)
              : 0;

          return (
            <Card
              key={prop.id}
              className="hover:bg-brand-50/40 transition-all cursor-pointer"
              onClick={() => setSelectedProperty(prop)}
            >
              <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-200/70 flex flex-row items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <CardTitle className="text-base font-bold text-zinc-900">
                      {prop.name}
                    </CardTitle>
                    <StatusBadge status={prop.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                    <span>
                      {prop.address}, {prop.city}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProperty(prop);
                  }}
                  className="h-8 shrink-0 text-xs text-zinc-600 hover:text-zinc-900"
                >
                  Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-5">
                <p className="text-xs text-zinc-600 mb-4 line-clamp-2">
                  {prop.notes || "Residential premises under 24/7 access control."}
                </p>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-2 min-[425px]:grid-cols-4 gap-x-2 gap-y-3 text-center p-3 rounded-sm bg-white border border-zinc-200 text-xs">
                  <div>
                    <span className="text-zinc-500 text-xs font-normal block">
                      Occupancy
                    </span>
                    <span className="font-bold text-zinc-900 text-sm">
                      {occupancy}%
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {prop.occupiedUnits}/{prop.totalUnits}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-normal block">
                      Residents
                    </span>
                    <span className="font-bold text-zinc-900 text-sm">
                      {propResidents.length}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Active</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-normal block">
                      Guards
                    </span>
                    <span className="font-bold text-zinc-900 text-sm">
                      {propGuards.length}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Rostered</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-normal block">
                      Open maint.
                    </span>
                    <span className="font-bold text-zinc-900 text-sm">
                      {propMaint.filter((m) => m.status !== "completed").length}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Tickets</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-zinc-600">
                  <span className="truncate">
                    Barriers: {prop.gates.join(", ")}
                  </span>
                  <span className="shrink-0 capitalize text-zinc-700 font-medium">
                    {prop.type.replace("_", " ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Property Detail Dialog / Tabs Drawer */}
      {selectedProperty && (
        <Dialog
          open={Boolean(selectedProperty)}
          onOpenChange={(open) => !open && setSelectedProperty(null)}
        >
          <DialogContent className="sm:max-w-2xl bg-white border-zinc-200 text-zinc-900 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-zinc-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-600">
                  {selectedProperty.type.replace("_", " ")}
                </span>
                <StatusBadge status={selectedProperty.status} />
              </div>
              <DialogTitle className="text-xl font-bold text-zinc-900">
                {selectedProperty.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-600">
                {selectedProperty.address}, {selectedProperty.city}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-3">
              <TabsList className="bg-zinc-100 p-1 border border-zinc-200">
                <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="units" className="text-xs data-[state=active]:bg-white">
                  Units ({getPropUnits(selectedProperty.id).length})
                </TabsTrigger>
                <TabsTrigger value="residents" className="text-xs data-[state=active]:bg-white">
                  Residents ({getPropResidents(selectedProperty.id).length})
                </TabsTrigger>
                <TabsTrigger value="guards" className="text-xs data-[state=active]:bg-white">
                  Guards & Gates ({getPropGuards(selectedProperty.id).length})
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 pt-3 text-xs">
                <div className="p-3 rounded-sm bg-zinc-50 border border-zinc-200">
                  <h4 className="font-semibold text-zinc-900 mb-1">Estate Summary</h4>
                  <p className="text-zinc-600 leading-relaxed">
                    {selectedProperty.notes}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-sm border border-zinc-200 space-y-1">
                    <span className="text-zinc-600">Total Units Capacity:</span>
                    <div className="font-bold text-sm text-zinc-900">
                      {selectedProperty.totalUnits} Units
                    </div>
                  </div>
                  <div className="p-3 rounded-sm border border-zinc-200 space-y-1">
                    <span className="text-zinc-600">Occupancy:</span>
                    <div className="font-bold text-sm text-zinc-900">
                      {selectedProperty.occupiedUnits} Occupied (
                      {Math.round(
                        (selectedProperty.occupiedUnits / selectedProperty.totalUnits) * 100
                      )}
                      %)
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-zinc-800">
                    Security Barrier Gates
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.gates.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-sm bg-zinc-100 border border-zinc-300 text-zinc-800 font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Units Tab */}
              <TabsContent value="units" className="pt-3">
                <div className="rounded-sm overflow-x-auto">
                  <table className="w-full min-w-max text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                      <tr>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Building</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Primary resident</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {getPropUnits(selectedProperty.id).map((u) => (
                        <tr key={u.id} className="hover:bg-card">
                          <td className="p-2.5 font-mono font-semibold text-zinc-900">
                            {u.unitNumber}
                          </td>
                          <td className="p-2.5 text-zinc-600">{u.buildingName || "—"}</td>
                          <td className="p-2.5">
                            <StatusBadge status={u.occupancyStatus} />
                          </td>
                          <td className="p-2.5 text-zinc-800 font-medium">
                            {u.primaryResidentName || "Vacant"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Residents Tab */}
              <TabsContent value="residents" className="pt-3">
                <div className="rounded-sm overflow-x-auto">
                  <table className="w-full min-w-max text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                      <tr>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {getPropResidents(selectedProperty.id).map((r) => (
                        <tr key={r.id} className="hover:bg-card">
                          <td className="p-2.5 font-semibold text-zinc-900">
                            {r.firstName} {r.lastName}
                          </td>
                          <td className="p-2.5 font-mono text-zinc-800">{r.unitNumber}</td>
                          <td className="p-2.5 capitalize">{r.residentType}</td>
                          <td className="p-2.5 text-zinc-600">{r.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Guards Tab */}
              <TabsContent value="guards" className="pt-3">
                <div className="rounded-sm overflow-x-auto">
                  <table className="w-full min-w-max text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                      <tr>
                        <th className="p-2.5">Officer</th>
                        <th className="p-2.5">Gate</th>
                        <th className="p-2.5">Shift</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {getPropGuards(selectedProperty.id).map((g) => (
                        <tr key={g.id} className="hover:bg-card">
                          <td className="p-2.5 font-semibold text-zinc-900">
                            {g.fullName}
                          </td>
                          <td className="p-2.5 text-zinc-700">{g.gateName}</td>
                          <td className="p-2.5 text-zinc-600">{g.shift}</td>
                          <td className="p-2.5">
                            <StatusBadge status={g.dutyStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="border-t border-zinc-200 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedProperty(null)}
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
