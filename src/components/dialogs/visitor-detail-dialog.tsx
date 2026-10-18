"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDemo } from "@/lib/store/demo-context";
import { VisitorRequest } from "@/types";
import {
  formatDateTime,
  calculateTimeOnSite,
} from "@/lib/formatters";
import {
  ShieldCheck,
  XCircle,
  LogIn,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface VisitorDetailDialogProps {
  visitor: VisitorRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitorDetailDialog({
  visitor,
  open,
  onOpenChange,
}: VisitorDetailDialogProps) {
  const {
    role,
    approveVisitor,
    rejectVisitor,
    checkInVisitor,
    checkOutVisitor,
  } = useDemo();

  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!visitor) return null;

  const handleApprove = () => {
    approveVisitor(visitor.id);
    onOpenChange(false);
  };

  const handleRejectConfirm = () => {
    rejectVisitor(visitor.id, rejectReason || "Declined by resident");
    setRejecting(false);
    setRejectReason("");
    onOpenChange(false);
  };

  const handleCheckIn = () => {
    checkInVisitor(visitor.id);
    onOpenChange(false);
  };

  const handleCheckOut = () => {
    checkOutVisitor(visitor.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white border-zinc-200 text-zinc-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-zinc-200 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-zinc-600">
              {visitor.reference}
            </span>
            <StatusBadge status={visitor.status} />
          </div>
          <DialogTitle className="text-xl font-bold text-zinc-900 mt-1">
            {visitor.visitorName}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-600">
            {visitor.propertyName} • Unit {visitor.unitNumber}
          </DialogDescription>
        </DialogHeader>

        {/* Details grid */}
        <div className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-sm bg-zinc-50 border border-zinc-200">
            <div>
              <span className="text-zinc-600 block">Host Resident:</span>
              <span className="font-semibold text-zinc-900">
                {visitor.residentName}
              </span>
            </div>
            <div>
              <span className="text-zinc-600 block">Visitor Contact:</span>
              <span className="font-mono text-zinc-800">
                {visitor.visitorPhone || "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-zinc-600 block">Gate Barrier:</span>
              <span className="font-medium text-zinc-800">
                {visitor.gateName}
              </span>
            </div>
            <div>
              <span className="text-zinc-600 block">Visit Category:</span>
              <span className="capitalize font-medium text-zinc-800">
                {visitor.visitType.replace("_", " ")}
              </span>
            </div>
          </div>

          <div>
            <span className="text-zinc-600 block mb-1">Declared Purpose:</span>
            <p className="p-2.5 rounded-sm bg-zinc-100 text-zinc-800 border border-zinc-200">
              {visitor.purpose || "General visit"}
            </p>
          </div>

          {/* Timestamps */}
          <div className="border border-zinc-200 rounded-sm p-3 space-y-2 bg-white">
            <span className="text-xs font-medium text-zinc-500 block">
              Gate access times
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-zinc-600">Arrived At:</span>
                <div className="font-medium text-zinc-900">
                  {formatDateTime(visitor.arrivedAt)}
                </div>
              </div>
              <div>
                <span className="text-zinc-600">Resident Decision:</span>
                <div className="font-medium text-zinc-900">
                  {visitor.decision ? (
                    <span className="capitalize">
                      {visitor.decision} ({formatDateTime(visitor.decisionAt)})
                    </span>
                  ) : (
                    "Pending decision"
                  )}
                </div>
              </div>
              <div>
                <span className="text-zinc-600">Barrier Entry:</span>
                <div className="font-medium text-zinc-900">
                  {formatDateTime(visitor.checkedInAt)}
                </div>
              </div>
              <div>
                <span className="text-zinc-600">Departure Exit:</span>
                <div className="font-medium text-zinc-900">
                  {formatDateTime(visitor.checkedOutAt)}
                </div>
              </div>
            </div>

            {(visitor.checkedInAt || visitor.checkedOutAt) && (
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs">
                <span className="text-zinc-600">Total Time on Site:</span>
                <span className="font-bold text-zinc-900">
                  {calculateTimeOnSite(visitor.checkedInAt, visitor.checkedOutAt)}
                </span>
              </div>
            )}
          </div>

          {/* Rejection notice if rejected */}
          {visitor.status === "rejected" && (
            <div className="p-3 rounded-sm bg-zinc-100 border border-zinc-300 text-zinc-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-zinc-700" />
                <span>Visit Access Rejected</span>
              </div>
              <p className="text-xs text-zinc-700">
                Reason: {visitor.rejectionReason || "No explicit reason recorded."}
              </p>
              <div className="text-[11px] text-zinc-500">
                Decided by {visitor.decisionBy || "Resident"}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          {visitor.timeline && visitor.timeline.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-medium text-zinc-500 block">
                Activity audit trail
              </span>
              <ol className="space-y-0 pt-1">
                {visitor.timeline.map((evt, i, arr) => (
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
                        <span className="shrink-0 text-[10px] text-zinc-500 leading-none">
                          {formatDateTime(evt.occurredAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                        {evt.description} ({evt.actorName})
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Simulated notification notice */}
          <div className="p-2.5 rounded-sm bg-zinc-100 text-[11px] text-zinc-600 border border-zinc-200">
            Note: In production, approval is decided by the resident via mobile app.
            This demonstration web portal allows authorized managers and supervisors
            to simulate or override gate decisions locally.
          </div>

          {/* Reject Reason Input (if in rejecting mode) */}
          {rejecting && (
            <div className="p-3 rounded-sm bg-zinc-100 border border-zinc-300 space-y-2">
              <label className="font-semibold text-zinc-800 text-xs block">
                Reason for Entry Rejection (Optional)
              </label>
              <Textarea
                placeholder="e.g. Resident not expecting guest, unrecognized person"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="text-xs border-zinc-300 bg-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRejecting(false)}
                  className="border-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleRejectConfirm}
                  className="bg-brand-700 hover:bg-brand-800 text-white"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions depending on status */}
        <DialogFooter className="border-t border-zinc-200 pt-3 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          >
            Close
          </Button>

          {/* Awaiting Approval Actions */}
          {visitor.status === "awaiting_approval" && !rejecting && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejecting(true)}
                className="border-zinc-400 text-zinc-800 hover:bg-zinc-100 text-xs"
              >
                <XCircle className="w-3.5 h-3.5 mr-1 text-zinc-600" />
                Reject Entry
              </Button>
              <Button
                type="button"
                onClick={handleApprove}
                className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Approve Entry
              </Button>
            </div>
          )}

          {/* Approved: Gate Check-in Action */}
          {visitor.status === "approved" && (
            <Button
              type="button"
              onClick={handleCheckIn}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs"
            >
              <LogIn className="w-3.5 h-3.5 mr-1" />
              Record Gate Check-in
            </Button>
          )}

          {/* Checked In: Gate Departure Action */}
          {visitor.status === "checked_in" && (
            <Button
              type="button"
              onClick={handleCheckOut}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Record Gate Departure
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
