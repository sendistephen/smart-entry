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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { PlatformUser, UserRole } from "@/types";
import { Users, Search, ShieldCheck, UserCheck } from "lucide-react";

export default function AdminUsersPage() {
  const { users, updateUserRole } = useDemo();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.organizationName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const usersPage = usePagination(filteredUsers);

  return (
    <AppShell>
      <PageHeader
        title="Users & Role Access Control"
        description="Global user directory across property managers, security supervisors, concierges, and platform administrators."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <Input
            placeholder="Search user name, email, organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs border-zinc-300 bg-white"
          />
        </div>

        <Select
          value={roleFilter}
          onValueChange={(val) => {
            if (val) setRoleFilter(val);
          }}
        >
          <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-42.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-zinc-200">
            <SelectItem value="all">All Assigned Roles</SelectItem>
            <SelectItem value="property_manager">Property Manager</SelectItem>
            <SelectItem value="platform_admin">Platform Admin</SelectItem>
            <SelectItem value="security_supervisor">Security Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Organization</th>
                <th className="px-3 py-2">Contact phone</th>
                <th className="px-3 py-2">Active role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Modify role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {usersPage.pageItems.map((u) => (
                <tr key={u.id} className="hover:bg-card transition-colors">
                  <td data-label="User" className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {u.avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{u.name}</div>
                        <div className="text-[11px] font-mono text-zinc-500">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Organization" className="px-3 py-2 font-medium text-zinc-800">
                    {u.organizationName}
                  </td>
                  <td data-label="Contact phone" className="px-3 py-2 font-mono text-zinc-600">{u.phone}</td>
                  <td data-label="Active role" className="px-3 py-2 capitalize font-semibold text-zinc-900">
                    {u.role.replace("_", " ")}
                  </td>
                  <td data-label="Status" className="px-3 py-2">
                    <StatusBadge status={u.status} />
                  </td>
                  <td data-label="Modify role" className="px-3 py-2 text-right">
                    <Select
                      value={u.role}
                      onValueChange={(val) => {
                        if (val) updateUserRole(u.id, val as UserRole);
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs border-zinc-300 bg-white ml-auto max-w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-zinc-200">
                        <SelectItem value="property_manager">Property Manager</SelectItem>
                        <SelectItem value="platform_admin">Platform Admin</SelectItem>
                        <SelectItem value="security_supervisor">Security Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...usersPage} label="users" />
      </Card>
    </AppShell>
  );
}
