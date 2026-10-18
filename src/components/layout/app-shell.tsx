"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  Users,
  KeyRound,
  Wrench,
  Truck,
  BarChart3,
  CreditCard,
  Settings,
  ChevronDown,
  Bell,
  Menu,
  Layers,
  Sparkles,
} from "lucide-react";
import { useDemo } from "@/lib/store/demo-context";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatRelativeTime } from "@/lib/formatters";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: { title: string; href: string }[];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    setRole,
    selectedPropertyId,
    setSelectedPropertyId,
    selectedOrganizationId,
    setSelectedOrganizationId,
    organizations,
    properties,
    notifications,
    markAllNotificationsRead,
    resetDemoData,
  } = useDemo();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(true);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Active workspace organization
  const currentOrg =
    selectedOrganizationId === "all"
      ? null
      : organizations.find((o) => o.id === selectedOrganizationId) || organizations[0];

  const mainNavigation: NavItem[] = [
    {
      title: "Overview",
      href: "/",
      icon: Layers,
    },
    {
      title: "Security & access",
      href: "/security/live-gate",
      icon: KeyRound,
      children: [
        { title: "Live gate activity", href: "/security/live-gate" },
        { title: "Visitor requests", href: "/security/visitor-requests" },
        { title: "Visit history", href: "/security/visit-history" },
        { title: "Guards & roster", href: "/security/guards" },
      ],
    },
    {
      title: "Properties",
      href: "/properties",
      icon: Building2,
    },
    {
      title: "Units & residents",
      href: "/units-residents",
      icon: Users,
    },
    {
      title: "Services & maintenance",
      href: "/services/providers",
      icon: Wrench,
      children: [
        { title: "Service providers", href: "/services/providers" },
        { title: "Bookings", href: "/services/bookings" },
        { title: "Maintenance requests", href: "/services/maintenance" },
      ],
    },
    {
      title: "Deliveries",
      href: "/deliveries",
      icon: Truck,
    },
    {
      title: "Reports & analytics",
      href: "/reports",
      icon: BarChart3,
    },
    {
      title: "Billing & plans",
      href: "/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const adminNavigation: NavItem[] = [
    { title: "Admin overview", href: "/admin", icon: Layers },
    { title: "Organizations & properties", href: "/admin/organizations", icon: Building2 },
    { title: "Users & roles", href: "/admin/users", icon: Users },
    { title: "Service categories", href: "/admin/categories", icon: Sparkles },
    { title: "Plans & subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { title: "Audit trail", href: "/admin/audit-log", icon: Layers },
  ];

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    property_manager: { label: "Property manager", badge: "Manager" },
    platform_admin: { label: "Platform administrator", badge: "Admin" },
    security_supervisor: { label: "Security supervisor", badge: "Supervisor" },
    guard: { label: "Guard", badge: "Guard" },
    resident: { label: "Resident", badge: "Resident" },
    service_provider: { label: "Service provider", badge: "Provider" },
  };

  const renderWorkspaceSwitcher = () => (
    <div className="p-3 border-b border-zinc-200 bg-white">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-sm hover:bg-zinc-100/80 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-sm bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentOrg ? currentOrg.name.slice(0, 2).toUpperCase() : "SE"}
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-sm text-zinc-900 block truncate leading-tight">
                    {currentOrg ? currentOrg.name : "All organizations"}
                  </span>
                  <span className="text-xs text-zinc-500 block truncate font-normal">
                    {selectedOrganizationId === "all"
                      ? "Portfolio workspace"
                      : "Workspace organisation"}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 group-hover:text-zinc-700 transition-colors" />
            </button>
          }
        />
        <DropdownMenuContent align="start" className="w-72 bg-white border-zinc-200">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-medium text-zinc-500 px-2 py-1.5">
              Switch workspace organisation
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem
              onClick={() => {
                setSelectedOrganizationId("all");
                setSelectedPropertyId("all");
              }}
              className={`text-xs cursor-pointer flex items-center justify-between px-2.5 py-2 ${
                selectedOrganizationId === "all" ? "bg-zinc-100 font-semibold" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-bold">
                  All
                </div>
                <span>All workspaces (portfolio)</span>
              </div>
              {selectedOrganizationId === "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
              )}
            </DropdownMenuItem>
            {organizations.map((org) => {
              const isSelected = selectedOrganizationId === org.id;
              const orgProps = properties.filter((p) => p.organizationId === org.id);
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => {
                    setSelectedOrganizationId(org.id);
                    if (orgProps[0]) setSelectedPropertyId(orgProps[0].id);
                    else setSelectedPropertyId("all");
                  }}
                  className={`text-xs cursor-pointer flex items-center justify-between px-2.5 py-2 ${
                    isSelected ? "bg-zinc-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-sm bg-brand-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="truncate block font-medium">{org.name}</span>
                      <span className="text-[11px] text-zinc-400 block font-normal">
                        {org.propertyCount} properties
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-zinc-100" />
          <DropdownMenuItem
            onClick={() => router.push("/admin/organizations")}
            className="text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer"
          >
            Manage workspace organisations
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Property selector within workspace */}
      <div className="mt-2 pt-2 border-t border-zinc-100 px-1">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Property:</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="font-medium text-zinc-800 hover:text-zinc-950 flex items-center gap-1 text-xs truncate max-w-42 text-right"
                >
                  <span className="truncate">
                    {selectedPropertyId === "all"
                      ? "All properties"
                      : properties.find((p) => p.id === selectedPropertyId)?.name || "Select"}
                  </span>
                  <ChevronDown className="w-3 h-3 shrink-0 text-zinc-400" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 bg-white border-zinc-200">
              <DropdownMenuItem
                onClick={() => setSelectedPropertyId("all")}
                className={`text-xs cursor-pointer ${
                  selectedPropertyId === "all" ? "bg-zinc-100 font-semibold" : ""
                }`}
              >
                All properties
              </DropdownMenuItem>
              {(selectedOrganizationId === "all"
                ? properties
                : properties.filter((p) => p.organizationId === selectedOrganizationId)
              ).map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={`text-xs cursor-pointer ${
                    selectedPropertyId === p.id ? "bg-zinc-100 font-semibold" : ""
                  }`}
                >
                  {p.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  const renderNavLinks = (isMobile = false) => {
    return (
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-xs font-medium text-zinc-500">
            Operations
          </div>
          <nav className="space-y-0.5">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isActive =
                pathname === item.href ||
                (hasChildren && item.children?.some((c) => pathname === c.href));

              if (hasChildren) {
                const isOpen =
                  item.title === "Security & access" ? securityOpen : servicesOpen;
                const toggleOpen = () => {
                  if (item.title === "Security & access") setSecurityOpen(!securityOpen);
                  else setServicesOpen(!servicesOpen);
                };

                return (
                  <div key={item.title} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={toggleOpen}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-sm transition-colors ${
                        isActive
                          ? "bg-zinc-100 text-zinc-950 font-semibold"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-zinc-500" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pl-6 space-y-0.5 pt-0.5 pb-1 border-l border-zinc-200 ml-4">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => isMobile && setMobileMenuOpen(false)}
                              className={`flex items-center px-2.5 py-1.5 text-xs rounded-sm transition-colors ${
                                isChildActive
                                  ? "bg-brand-700 text-white font-medium"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                              }`}
                            >
                              <span>{child.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? "bg-brand-700 text-white"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Platform Admin Navigation */}
        <div className="pt-2 border-t border-zinc-200">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-medium text-zinc-500">
              Platform administration
            </span>
            {role === "platform_admin" && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-zinc-100 border-zinc-300">
                active
              </Badge>
            )}
          </div>
          <nav className="space-y-0.5">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? "bg-brand-700 text-white"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-zinc-100 text-zinc-900">
      {/* Desktop Sidebar with Workspace Organisation */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-white border-r border-zinc-200">
        {/* Workspace Organisation Header */}
        {renderWorkspaceSwitcher()}

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
          {renderNavLinks()}
        </div>

        {/* Sidebar footer: Reset demo & Active Role info */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/70 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
            <span>Perspective:</span>
            <span className="font-semibold text-zinc-900">
              {roleLabels[role]?.badge}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetDemoData}
            className="w-full text-xs text-zinc-600 hover:text-zinc-900 border-zinc-300 bg-white"
          >
            Reset demo data
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur-sm border-b border-zinc-200 flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-3">
          {/* Left section: mobile hamburger & active workspace breadcrumb */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-zinc-700 h-8 w-8"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="w-4 h-4" />
            </Button>

            <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-500">
              <span className="truncate font-medium text-zinc-900">
                {currentOrg ? currentOrg.name : "Portfolio"}
              </span>
              <span className="hidden sm:inline">/</span>
              <span className="hidden sm:inline truncate">
                {selectedPropertyId === "all"
                  ? "All properties"
                  : properties.find((p) => p.id === selectedPropertyId)?.name}
              </span>
            </div>
          </div>

          {/* Right section: Notifications, Role Switcher, Profile */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            {/* Notifications Popover/Sheet */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-zinc-600 hover:text-zinc-900 h-8 w-8"
                    aria-label="View notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-700" />
                    )}
                  </Button>
                }
              />
              <SheetContent className="w-full sm:max-w-md bg-white border-l border-zinc-200 p-0 flex flex-col">
                <SheetHeader className="p-4 pr-14 border-b border-zinc-200">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-base font-semibold text-zinc-900">
                      Notifications
                    </SheetTitle>
                    <Badge variant="outline" className="text-xs">
                      {unreadNotifs.length} unread
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Demonstration alerts for resident requests, gate arrivals, and updates.
                  </p>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-10 text-xs text-zinc-500">
                      No notifications recorded.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-sm border text-xs transition-colors ${
                          n.read
                            ? "bg-zinc-50/50 border-zinc-200 text-zinc-600"
                            : "bg-white border-zinc-300 text-zinc-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-900">{n.title}</span>
                          <span className="text-[10px] text-zinc-500">
                            {formatRelativeTime(n.timestamp)}
                          </span>
                        </div>
                        <p className="leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllNotificationsRead}
                    className="text-xs border-zinc-300"
                  >
                    Mark all read
                  </Button>
                  <span className="text-xs text-zinc-500">Demo environment</span>
                </div>
              </SheetContent>
            </Sheet>

            {/* Demo Role Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-zinc-300 bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-50"
                  >
                    <span className="hidden md:inline text-zinc-500">Role:</span>
                    <span className="font-semibold">{roleLabels[role]?.badge}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 bg-white border-zinc-200">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-zinc-500">
                    Switch perspective
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-100" />
                  <DropdownMenuItem
                    onClick={() => setRole("property_manager")}
                    className="text-xs cursor-pointer flex flex-col items-start py-1.5"
                  >
                    <span className="font-semibold text-zinc-900">Property manager</span>
                    <span className="text-[11px] text-zinc-500">
                      Day-to-day operations & resident approvals
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRole("platform_admin")}
                    className="text-xs cursor-pointer flex flex-col items-start py-1.5"
                  >
                    <span className="font-semibold text-zinc-900">Platform administrator</span>
                    <span className="text-[11px] text-zinc-500">
                      Workspaces, properties & platform audit
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRole("security_supervisor")}
                    className="text-xs cursor-pointer flex flex-col items-start py-1.5"
                  >
                    <span className="font-semibold text-zinc-900">Security supervisor</span>
                    <span className="text-[11px] text-zinc-500">
                      Roster shifts, gate monitoring & arrivals
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Avatar / Quick Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs ring-1 ring-zinc-200 focus:outline-none cursor-pointer"
                    aria-label="User profile options"
                  >
                    AS
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-52 bg-white border-zinc-200">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs">
                    <div className="font-semibold text-zinc-900">Arthur Ssekandi</div>
                    <div className="text-xs text-zinc-500 font-normal">
                      arthur@smartentry.example.com
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-100" />
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="text-xs cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/reports")}
                    className="text-xs cursor-pointer"
                  >
                    Reports
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem
                  onClick={resetDemoData}
                  className="text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Reset demo data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/login")}
                  className="text-xs cursor-pointer"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 bg-white p-0 flex flex-col border-r border-zinc-200">
            {renderWorkspaceSwitcher()}
            <div className="flex-1 overflow-y-auto p-3">{renderNavLinks(true)}</div>
            <div className="p-3 border-t border-zinc-200 bg-zinc-50 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetDemoData();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-xs border-zinc-300"
              >
                Reset demo data
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Page Content Viewport */}
        <main className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6">
          {/* White content panel inset on the grey page background */}
          <div className="flex-1 min-w-0 rounded-lg bg-white p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
