"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useDemo } from "@/lib/store/demo-context";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters";
import { Clock, Search, ShieldCheck, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminAuditLogPage() {
  const { auditLogs } = useDemo();
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase())
  );

  const exportAuditCSV = () => {
    const headers = ["Timestamp", "Actor", "Action", "Entity Type", "Entity ID", "Description"];
    const rows = filteredLogs.map((l) => [
      l.occurredAt,
      `"${l.actorName}"`,
      `"${l.action}"`,
      l.entityType,
      l.entityId,
      `"${l.description}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart_entry_audit_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit trail exported.");
  };

  const logsPage = usePagination(filteredLogs);

  return (
    <AppShell>
      <PageHeader
        title="Platform Audit Trail & Security Ledger"
        description="Immutable chronological activity feed logging all access decisions, barrier overrides, contractor assignments, and user actions."
        badge="IMMUTABLE LEDGER"
        actions={
          <Button
            variant="outline"
            onClick={exportAuditCSV}
            className="border-zinc-300 text-xs sm:text-sm h-9 bg-white text-zinc-800 hover:bg-zinc-50"
          >
            <Download className="w-4 h-4 mr-1.5 text-zinc-600" />
            Export Audit Log ({filteredLogs.length})
          </Button>
        }
      />

      {/* Search */}
      <div className="relative w-full sm:w-80 mb-6">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
        <Input
          placeholder="Search event, actor, entity..."
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
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Action recorded</th>
                <th className="px-3 py-2">Actor / authorizer</th>
                <th className="px-3 py-2">Entity type</th>
                <th className="px-3 py-2">Event description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logsPage.pageItems.map((log) => (
                <tr key={log.id} className="hover:bg-card transition-colors">
                  <td data-label="Timestamp" className="px-3 py-2 text-zinc-500 whitespace-nowrap">
                    <div>{formatDateTime(log.occurredAt)}</div>
                    <div className="text-[10px] text-zinc-400">
                      {formatRelativeTime(log.occurredAt)}
                    </div>
                  </td>
                  <td data-label="Action recorded" className="px-3 py-2">
                    <span className="font-bold text-zinc-900">{log.action}</span>
                  </td>
                  <td data-label="Actor / authorizer" className="px-3 py-2 font-medium text-zinc-800">
                    {log.actorName}
                  </td>
                  <td data-label="Entity type" className="px-3 py-2 font-mono text-[11px] text-zinc-500">
                    {log.entityType}
                  </td>
                  <td data-label="Event description" className="px-3 py-2 text-zinc-700 leading-relaxed">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...logsPage} label="events" />
      </Card>
    </AppShell>
  );
}
