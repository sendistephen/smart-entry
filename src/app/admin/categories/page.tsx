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
import { Sparkles, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { categories, toggleCategoryStatus } = useDemo();
  const [newCatName, setNewCatName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    toast.success(`Category "${newCatName}" added to marketplace.`);
    setNewCatName("");
  };

  const categoriesPage = usePagination(categories);

  return (
    <AppShell>
      <PageHeader
        title="Marketplace Service Categories"
        description="Configure approved trades, onboarded contractor specializations, and resident directory taxonomy."
        actions={
          <form onSubmit={handleAdd} className="flex w-full sm:w-auto items-center gap-2">
            <Input
              placeholder="New trade category..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="h-9 min-w-0 flex-1 sm:w-48 sm:flex-none text-xs border-zinc-300 bg-white"
            />
            <Button
              type="submit"
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm h-9 shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </Button>
          </form>
        }
      />

      <Card className="bg-white overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="table-stack w-full min-w-max text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-medium text-xs">
              <tr>
                <th className="px-3 py-2">Category title</th>
                <th className="px-3 py-2">Scope / description</th>
                <th className="px-3 py-2">Listed providers</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categoriesPage.pageItems.map((cat) => (
                <tr key={cat.id} className="hover:bg-card transition-colors">
                  <td data-label="Category title" className="px-3 py-2 font-bold text-zinc-900 text-sm">
                    {cat.name}
                  </td>
                  <td data-label="Scope / description" className="px-3 py-2 text-zinc-600 max-w-sm truncate">
                    {cat.description}
                  </td>
                  <td data-label="Listed providers" className="px-3 py-2 font-semibold text-zinc-800">
                    {cat.providerCount} providers active
                  </td>
                  <td data-label="Status" className="px-3 py-2">
                    <StatusBadge status={cat.status} />
                  </td>
                  <td data-label="" className="px-3 py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className="h-7 text-xs border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                    >
                      {cat.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination {...categoriesPage} label="categories" />
      </Card>
    </AppShell>
  );
}
