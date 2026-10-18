"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { Subscription } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function AdminSubscriptionsPage() {
  const { subscriptions, updateSubscriptionStatus } = useDemo();

  const subscriptionsPage = usePagination(subscriptions);

  return (
    <AppShell>
      <PageHeader
        title="SaaS Subscriptions & Licenses"
        description="Active software licenses, billing cycles, automated invoice statuses, and property portfolio tiers."
      />

      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Client organization</th>
                <th className="px-3 py-2">Property portfolio</th>
                <th className="px-3 py-2">Subscribed tier</th>
                <th className="px-3 py-2">Billing cycle</th>
                <th className="px-3 py-2">Next renewal date</th>
                <th className="px-3 py-2">Amount (UGX)</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Update status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {subscriptionsPage.pageItems.map((sub) => (
                <tr key={sub.id} className="hover:bg-card transition-colors">
                  <td data-label="Client organization" className="px-3 py-2 font-bold text-zinc-900 text-sm">
                    {sub.organizationName}
                  </td>
                  <td data-label="Property portfolio" className="px-3 py-2 text-zinc-600">{sub.propertyName}</td>
                  <td data-label="Subscribed tier" className="px-3 py-2 font-medium text-zinc-800">{sub.planName}</td>
                  <td data-label="Billing cycle" className="px-3 py-2 text-zinc-600">{sub.billingCycle}</td>
                  <td data-label="Next renewal date" className="px-3 py-2 text-zinc-600">{sub.nextBillingDate}</td>
                  <td data-label="Amount (UGX)" className="px-3 py-2 font-mono font-bold text-zinc-900">
                    {formatCurrency(sub.amount)}
                  </td>
                  <td data-label="Status" className="px-3 py-2">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td data-label="Update status" className="px-3 py-2 text-right">
                    <Select
                      value={sub.status}
                      onValueChange={(val) => {
                        if (val) updateSubscriptionStatus(sub.id, val as Subscription["status"]);
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs border-zinc-300 bg-white ml-auto max-w-32.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="past_due">Past Due</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...subscriptionsPage} label="subscriptions" />
      </Card>
    </AppShell>
  );
}
