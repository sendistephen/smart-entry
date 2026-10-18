"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDemo } from "@/lib/store/demo-context";
import { formatCurrency } from "@/lib/formatters";
import {
  CreditCard,
  Check,
  Building2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function BillingPage() {
  const { plans, subscriptions, payments } = useDemo();

  const subscriptionsPage = usePagination(subscriptions);
  const paymentsPage = usePagination(payments);

  return (
    <AppShell>
      <PageHeader
        title="Subscription Plans & Revenue Monetization"
        description="Illustrative commercial tiers, multi-property SaaS license models, and platform commission settlement records."
        badge="UGX MONETIZATION"
      />

      {/* Illustrative Warning Banner */}
      <div className="p-3 mb-8 rounded-sm bg-zinc-100 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
        <span>
          <strong>Commercial Preview:</strong> All pricing structures and commission settlement figures are demonstration models based on the business plan. No card or mobile money payments are processed.
        </span>
      </div>

      {/* Subscription Plans Pricing Cards */}
      <div className="mb-10">
        <div className="mb-4">
          <h2 className="text-base font-bold text-zinc-900">
            Available Platform Tiers
          </h2>
          <p className="text-xs text-zinc-500">
            Tiered license packages for residential properties, estates, and portfolio managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={`flex flex-col justify-between ${
                p.popular ? "bg-brand-50" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-medium">
                    Plan tier
                  </span>
                  {p.popular && (
                    <span className="px-2 py-0.5 rounded-sm text-[11px] font-medium bg-brand-700 text-white">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-zinc-900">
                  {p.name}
                </CardTitle>
                <div className="pt-2">
                  <span className="text-2xl font-black text-zinc-900">
                    {formatCurrency(p.pricePerMonth)}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal"> / month</span>
                </div>
                <CardDescription className="text-xs text-zinc-600 pt-2 leading-relaxed">
                  {p.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2 border-t border-zinc-200/70 pt-3 text-xs">
                  <span className="font-medium text-zinc-900 text-xs block">
                    Included features:
                  </span>
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-zinc-600">
                      <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    variant={p.popular ? "default" : "outline"}
                    className={`w-full text-xs font-medium h-9 ${
                      p.popular
                        ? "bg-brand-700 hover:bg-brand-800 text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:bg-white"
                    }`}
                  >
                    Select Plan (Demo)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Subscriptions Table */}
      <div className="mb-10">
        <div className="mb-3">
          <h2 className="text-base font-bold text-zinc-900">
            Active Property Subscriptions
          </h2>
          <p className="text-xs text-zinc-500">
            Current simulated billing cycles for registered real estate organizations.
          </p>
        </div>

        <Card className="bg-white overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                <tr>
                  <th className="px-3 py-2">Organization / property</th>
                  <th className="px-3 py-2">Plan tier</th>
                  <th className="px-3 py-2">Billing cycle</th>
                  <th className="px-3 py-2">Next billing date</th>
                  <th className="px-3 py-2">Recurring fee</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {subscriptionsPage.pageItems.map((s) => (
                  <tr key={s.id} className="hover:bg-card transition-colors">
                    <td data-label="Organization / property" className="px-3 py-2">
                      <div className="font-bold text-zinc-900 text-sm">
                        {s.organizationName}
                      </div>
                      <div className="text-[11px] text-zinc-500">{s.propertyName}</div>
                    </td>
                    <td data-label="Plan tier" className="px-3 py-2 font-medium text-zinc-800">
                      {s.planName}
                    </td>
                    <td data-label="Billing cycle" className="px-3 py-2 text-zinc-600">{s.billingCycle}</td>
                    <td data-label="Next billing date" className="px-3 py-2 text-zinc-600">{s.nextBillingDate}</td>
                    <td data-label="Recurring fee" className="px-3 py-2 font-mono font-bold text-zinc-900">
                      {formatCurrency(s.amount)}
                    </td>
                    <td data-label="Status" className="px-3 py-2">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination {...subscriptionsPage} label="subscriptions" />
        </Card>
      </div>

      {/* Simulated Revenue Transactions Table */}
      <div>
        <div className="mb-3">
          <h2 className="text-base font-bold text-zinc-900">
            Recent Ledger & Commission Transactions
          </h2>
          <p className="text-xs text-zinc-500">
            Simulated fee receipts from software licenses and marketplace platform commissions.
          </p>
        </div>

        <Card className="bg-white overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
                <tr>
                  <th className="px-3 py-2">Transaction ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Entity</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paymentsPage.pageItems.map((tx) => (
                  <tr key={tx.id} className="hover:bg-card transition-colors">
                    <td data-label="Transaction ID" className="px-3 py-2 font-mono font-bold text-zinc-900 text-xs">
                      {tx.reference}
                    </td>
                    <td data-label="Type" className="px-3 py-2 font-medium text-zinc-800">
                      {tx.type}
                    </td>
                    <td data-label="Description" className="px-3 py-2 text-zinc-600">{tx.description}</td>
                    <td data-label="Entity" className="px-3 py-2 text-zinc-700 font-medium">
                      {tx.relatedEntity}
                    </td>
                    <td data-label="Date" className="px-3 py-2 text-zinc-500">{tx.date}</td>
                    <td data-label="Amount" className="px-3 py-2 font-mono font-bold text-zinc-900">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td data-label="Status" className="px-3 py-2">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination {...paymentsPage} label="payments" />
        </Card>
      </div>
    </AppShell>
  );
}
