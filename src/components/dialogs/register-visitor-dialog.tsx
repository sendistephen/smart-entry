"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDemo } from "@/lib/store/demo-context";
import { VisitType } from "@/types";
import { Plus, UserPlus } from "lucide-react";

interface RegisterVisitorDialogProps {
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RegisterVisitorDialog({
  triggerButton,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: RegisterVisitorDialogProps) {
  const { properties, residents, registerVisitor, selectedPropertyId } = useDemo();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const defaultProp =
    selectedPropertyId !== "all"
      ? selectedPropertyId
      : properties[0]?.id || "prop-1";

  const [propertyId, setPropertyId] = useState(defaultProp);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitType, setVisitType] = useState<VisitType>("guest");
  const [unitNumber, setUnitNumber] = useState("A-101");
  const [residentId, setResidentId] = useState("res-1");
  const [purpose, setPurpose] = useState("");
  const [isPreApproved, setIsPreApproved] = useState(false);

  const selectedProp = properties.find((p) => p.id === propertyId) || properties[0];
  const eligibleResidents = residents.filter(
    (r) => r.propertyId === propertyId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const res = residents.find((r) => r.id === residentId);

    registerVisitor({
      visitorName,
      visitorPhone: visitorPhone || "+256 700 123456",
      visitType,
      propertyId,
      propertyName: selectedProp.name,
      unitNumber: res ? res.unitNumber : unitNumber,
      residentId: res ? res.id : "res-1",
      residentName: res ? `${res.firstName} ${res.lastName}` : "David Mukasa",
      gateName: selectedProp.gates[0] || "Main Gate",
      purpose: purpose || "General personal visit",
      status: isPreApproved ? "approved" : "awaiting_approval",
    });

    // Reset form
    setVisitorName("");
    setVisitorPhone("");
    setPurpose("");
    setIsPreApproved(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as React.ReactElement} />
      ) : (
        <DialogTrigger
          render={
            <Button className="bg-brand-700 hover:bg-brand-800 text-white font-medium">
              Register visitor
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900">
            Register visitor arrival
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-600">
            Log visitor at the security gate. A simulated approval notification will be dispatched to the resident.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">
              Visitor Full Name <span className="text-zinc-500">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Ronald Sserunjogi"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="h-9 text-sm border-zinc-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Phone (Optional)</label>
              <Input
                placeholder="+256 700 000000"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                className="h-9 text-sm border-zinc-300 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Visit Category</label>
              <Select
                value={visitType}
                onValueChange={(val) => {
                  if (val) setVisitType(val as VisitType);
                }}
              >
                <SelectTrigger className="h-9 w-full text-sm border-zinc-300 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="guest">Guest / Personal</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="delivery">Courier / Delivery</SelectItem>
                  <SelectItem value="vendor">Vendor / Supplier</SelectItem>
                  <SelectItem value="maintenance">Maintenance Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Property</label>
              <Select
                value={propertyId}
                onValueChange={(val) => {
                  if (val) {
                    setPropertyId(val);
                    const firstRes = residents.find((r) => r.propertyId === val);
                    if (firstRes) setResidentId(firstRes.id);
                  }
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Destination Resident</label>
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
                  {eligibleResidents.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.unitNumber} - {r.firstName} {r.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Purpose of Visit</label>
            <Textarea
              placeholder="e.g. Dinner visit, repairing kitchen pipe, package drop"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="text-xs min-h-15 border-zinc-300 bg-white"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-sm bg-zinc-100 border border-zinc-200">
            <div>
              <div className="text-xs font-semibold text-zinc-900">
                Pre-authorized Pass
              </div>
              <div className="text-[11px] text-zinc-600">
                Resident already shared digital invite / pre-approved.
              </div>
            </div>
            <Switch
              checked={isPreApproved}
              onCheckedChange={setIsPreApproved}
              className="data-[state=checked]:bg-brand-700"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium"
            >
              Confirm registration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
