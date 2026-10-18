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
import { useDemo } from "@/lib/store/demo-context";
import { Organization } from "@/types";
import { initialOrganizations } from "@/lib/mock-data/seed";
import { Building2, Search, Plus, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrganizationsPage() {
  const { properties } = useDemo();
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [search, setSearch] = useState("");

  const filteredOrgs = organizations.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.contactEmail.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOrgStatus = (id: string) => {
    setOrganizations((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const next = o.status === "active" ? "inactive" : "active";
          toast.success(`Organization ${o.name} marked as ${next}.`);
          return { ...o, status: next };
        }
        return o;
      })
    );
  };

  const orgsPage = usePagination(filteredOrgs);

  return (
    <AppShell>
      <PageHeader
        title="Organizations & Property Portfolios"
        description="Multi-tenant client accounts, legal property holding entities, and licensed estate enrollments."
        actions={
          <Button
            onClick={() => toast.info("Add Organization simulated dialog.")}
            className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Organization
          </Button>
        }
      />

      {/* Search */}
      <div className="relative w-full sm:w-80 mb-6">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
        <Input
          placeholder="Search organization or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-xs border-zinc-300 bg-white"
        />
      </div>

      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Organization name</th>
                <th className="px-3 py-2">Contact email</th>
                <th className="px-3 py-2">Enrolled properties</th>
                <th className="px-3 py-2">Registration date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orgsPage.pageItems.map((org) => {
                const orgProps = properties.filter((p) => p.organizationId === org.id);
                return (
                  <tr key={org.id} className="hover:bg-card transition-colors">
                    <td data-label="Organization name" className="px-3 py-2 font-bold text-zinc-900 text-sm">
                      {org.name}
                    </td>
                    <td data-label="Contact email" className="px-3 py-2 font-mono text-zinc-600">
                      {org.contactEmail}
                    </td>
                    <td data-label="Enrolled properties" className="px-3 py-2">
                      <span className="font-semibold text-zinc-800">
                        {orgProps.length} properties
                      </span>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                        {orgProps.map((p) => p.name).join(", ") || "None enrolled"}
                      </div>
                    </td>
                    <td data-label="Registration date" className="px-3 py-2 text-zinc-500">
                      {org.createdAt.split("T")[0]}
                    </td>
                    <td data-label="Status" className="px-3 py-2">
                      <StatusBadge status={org.status} />
                    </td>
                    <td data-label="" className="px-3 py-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOrgStatus(org.id)}
                        className="h-7 text-xs border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                      >
                        {org.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination {...orgsPage} label="organizations" />
      </Card>
    </AppShell>
  );
}
