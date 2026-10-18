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
import { DeliveryRecord } from "@/types";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters";
import {
  Truck,
  Search,
  Plus,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Building2,
  AlertCircle,
} from "lucide-react";

export default function DeliveriesPage() {
  const {
    deliveries,
    residents,
    properties,
    selectedPropertyId,
    registerDelivery,
    updateDeliveryStatus,
  } = useDemo();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  // New Delivery State
  const [company, setCompany] = useState("Jumia Food Express");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [residentId, setResidentId] = useState(residents[0]?.id || "res-1");
  const [description, setDescription] = useState("");

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesProperty =
      selectedPropertyId === "all" || d.propertyId === selectedPropertyId;
    const matchesSearch =
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.deliveryPerson.toLowerCase().includes(search.toLowerCase()) ||
      d.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.residentName.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || d.status === statusFilter;
    return matchesProperty && matchesSearch && matchesStatus;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryPerson.trim()) return;

    const res = residents.find((r) => r.id === residentId) || residents[0];

    registerDelivery({
      company,
      deliveryPerson,
      deliveryPhone: deliveryPhone || "+256 700 000000",
      propertyId: res.propertyId,
      propertyName: res.propertyName,
      unitNumber: res.unitNumber,
      residentName: `${res.firstName} ${res.lastName}`,
      description: description || "Courier parcel drop",
    });

    setDeliveryPerson("");
    setDeliveryPhone("");
    setDescription("");
    setRegisterOpen(false);
  };

  const deliveriesPage = usePagination(filteredDeliveries);

  return (
    <AppShell>
      <PageHeader
        title="Delivery Gate Concierge"
        description="Gate logging for courier riders, food parcels, and package handovers. Simulated resident clearance prevents unauthorized barrier access."
        actions={
          <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
            <DialogTrigger
              render={
                <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Log Delivery Arrival
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Log Delivery Rider</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Record delivery person arrival at the entrance barrier.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleRegister} className="space-y-3.5 pt-2 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Delivery Service / Courier</label>
                  <Select
                    value={company}
                    onValueChange={(val) => {
                      if (val) setCompany(val);
                    }}
                  >
                    <SelectTrigger className="h-9 w-full text-xs border-zinc-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200">
                      <SelectItem value="Jumia Food Express">Jumia Food Express</SelectItem>
                      <SelectItem value="DHL Express Uganda">DHL Express Uganda</SelectItem>
                      <SelectItem value="Glovo Courier">Glovo Courier</SelectItem>
                      <SelectItem value="SpeedEx Logistics">SpeedEx Logistics</SelectItem>
                      <SelectItem value="Kampala Fresh Grocers">Kampala Fresh Grocers</SelectItem>
                      <SelectItem value="FedEx Express">FedEx Express</SelectItem>
                      <SelectItem value="Independent Rider">Independent Rider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Rider Full Name *</label>
                    <Input
                      required
                      placeholder="e.g. Hassan Kyazze"
                      value={deliveryPerson}
                      onChange={(e) => setDeliveryPerson(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-700">Rider Phone</label>
                    <Input
                      placeholder="+256 701 000000"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                      className="h-9 text-xs border-zinc-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Destination Resident</label>
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
                          {r.propertyName} ({r.unitNumber}) - {r.firstName} {r.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Package Description</label>
                  <Input
                    placeholder="e.g. Cardboard box, restaurant bag, envelope"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-9 text-xs border-zinc-300"
                  />
                </div>

                <DialogFooter className="pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegisterOpen(false)}
                    className="border-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
                  >
                    Record Arrival
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Integration honesty disclaimer card */}
      <div className="p-3 mb-6 rounded-sm bg-zinc-100 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
        <span>
          <strong>Prototype Note:</strong> Delivery couriers are logged locally at the security barrier. Third-party logistics APIs (Jumia, Glovo, DHL) are presented as simulated demonstration concepts.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder="Search company, rider, resident..."
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
          <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-47.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-zinc-200">
            <SelectItem value="all">All Delivery Statuses</SelectItem>
            <SelectItem value="awaiting_resident_decision">Awaiting Clearance</SelectItem>
            <SelectItem value="left_at_gate">Left at Concierge</SelectItem>
            <SelectItem value="delivered_to_resident">Delivered to Resident</SelectItem>
            <SelectItem value="departed">Departed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deliveries Table */}
      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Courier service</th>
                <th className="px-3 py-2">Rider</th>
                <th className="px-3 py-2">Destination unit</th>
                <th className="px-3 py-2">Arrival time</th>
                <th className="px-3 py-2">Package details</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Gate action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {deliveriesPage.pageItems.map((del) => (
                <tr
                  key={del.id}
                  onClick={() => setSelectedDelivery(del)}
                  className="hover:bg-card cursor-pointer transition-colors"
                >
                  <td data-label="Reference" className="px-3 py-2 font-mono font-bold text-zinc-900 text-xs">
                    {del.reference}
                  </td>
                  <td data-label="Courier service" className="px-3 py-2 font-semibold text-zinc-900">
                    {del.company}
                  </td>
                  <td data-label="Rider" className="px-3 py-2 text-zinc-800">
                    <div className="font-medium">{del.deliveryPerson}</div>
                    <div className="text-[11px] font-mono text-zinc-500">
                      {del.deliveryPhone}
                    </div>
                  </td>
                  <td data-label="Destination unit" className="px-3 py-2">
                    <span className="font-mono font-semibold text-zinc-900 block">
                      Unit {del.unitNumber}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {del.residentName} ({del.propertyName})
                    </span>
                  </td>
                  <td data-label="Arrival time" className="px-3 py-2 text-zinc-600">
                    {formatRelativeTime(del.arrivedAt)}
                  </td>
                  <td data-label="Package details" className="px-3 py-2 text-zinc-600 max-w-xs truncate">
                    {del.description}
                  </td>
                  <td data-label="Status" className="px-3 py-2">
                    <StatusBadge status={del.status} />
                  </td>
                  <td data-label="Gate action" className="px-3 py-2 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {del.status === "awaiting_resident_decision" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateDeliveryStatus(del.id, "delivered_to_resident")
                          }
                          className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7 px-2.5"
                        >
                          Allow Entry
                        </Button>
                      )}

                      {del.status === "delivered_to_resident" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateDeliveryStatus(del.id, "departed")}
                          className="border-zinc-300 text-xs h-7 px-2.5"
                        >
                          Mark Departed
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDelivery(del)}
                        className="h-7 text-xs text-zinc-700 hover:text-zinc-900"
                      >
                        Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...deliveriesPage} label="deliveries" />
      </Card>

      {/* Delivery Detail Dialog */}
      {selectedDelivery && (
        <Dialog
          open={Boolean(selectedDelivery)}
          onOpenChange={(open) => !open && setSelectedDelivery(null)}
        >
          <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
            <DialogHeader className="border-b border-zinc-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-500">
                  {selectedDelivery.reference}
                </span>
                <StatusBadge status={selectedDelivery.status} />
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-900 mt-1">
                {selectedDelivery.company} Delivery
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Unit {selectedDelivery.unitNumber} • {selectedDelivery.residentName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-sm bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Courier Rider:</span>
                  <span className="font-semibold text-zinc-900">
                    {selectedDelivery.deliveryPerson} ({selectedDelivery.deliveryPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Arrival Time:</span>
                  <span className="text-zinc-800">
                    {formatDateTime(selectedDelivery.arrivedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Recorded By:</span>
                  <span className="text-zinc-800">{selectedDelivery.recordedBy}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-zinc-700 block mb-1">
                  Package Content / Note:
                </span>
                <p className="p-2.5 rounded-sm bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {selectedDelivery.description}
                </p>
              </div>

              {/* Status Actions inside modal */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <span className="font-semibold text-zinc-800 block">
                  Update Delivery Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateDeliveryStatus(selectedDelivery.id, "left_at_gate");
                      setSelectedDelivery(null);
                    }}
                    className="border-zinc-300 text-xs h-7"
                  >
                    Left at Gate Concierge
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      updateDeliveryStatus(selectedDelivery.id, "delivered_to_resident");
                      setSelectedDelivery(null);
                    }}
                    className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-7"
                  >
                    Delivered to Resident
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedDelivery(null)}
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
