"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderProfileDialog } from "@/components/dialogs/provider-profile-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/store/demo-context";
import { ServiceProvider } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import {
  Search,
  Star,
  MapPin,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";

export default function ServiceProvidersPage() {
  const { providers, toggleProviderFeatured } = useDemo();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const categories = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Carpentry",
    "Appliance Repair",
    "Gardening",
    "Painting",
    "General Maintenance",
  ];

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.categories.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <PageHeader
        title="Curated Service Marketplace"
        description="Vetted residential service professionals, trade ratings, indicative pricing in UGX, and verified technician profiles."
        badge="UGANDA MARKETPLACE"
      />

      {/* Filter and Category Pills */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <Input
              placeholder="Search plumber, electrician, cleaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs border-zinc-300 bg-white"
            />
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              if (val) setCategoryFilter(val);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-auto text-xs border-zinc-300 bg-white min-w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200">
              <SelectItem value="all">All Service Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              categoryFilter === "all"
                ? "bg-brand-700 text-white font-semibold"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            All Services
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === c
                  ? "bg-brand-700 text-white font-semibold"
                  : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Providers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {filteredProviders.map((prov) => (
          <Card
            key={prov.id}
            onClick={() => setSelectedProvider(prov)}
            className="border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-zinc-900">
                      {prov.businessName}
                    </CardTitle>
                    {prov.featured && (
                      <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Lead: {prov.contactPerson} • {prov.categories.join(", ")}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-sm border border-zinc-200 text-xs font-bold text-zinc-900">
                  <Star className="w-3.5 h-3.5 fill-zinc-800 text-zinc-800" />
                  <span>{prov.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    ({prov.reviewCount})
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {prov.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{prov.serviceAreas.join(", ")}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/70 text-xs">
                  <div>
                    <span className="text-zinc-400 text-[11px] block">Starting from</span>
                    <span className="font-bold text-zinc-900 text-sm">
                      {formatCurrency(prov.indicativeStartingPrice)}
                    </span>
                  </div>
                  <StatusBadge status={prov.availability} />
                </div>
              </CardContent>
            </div>

            <div
              className="p-3 bg-white border-t border-zinc-200/70 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleProviderFeatured(prov.id)}
                className="text-xs text-zinc-600 hover:text-zinc-900"
              >
                <Bookmark className="w-3.5 h-3.5 mr-1" />
                {prov.featured ? "Unfeature" : "Feature Listing"}
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedProvider(prov)}
                className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs h-8"
              >
                View Profile & Pricing
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ProviderProfileDialog
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onBook={(prov) => {
          toast.success(`Simulated booking dispatched to ${prov.businessName}!`);
          setSelectedProvider(null);
        }}
      />
    </AppShell>
  );
}
