"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ActivityEvent,
  BookingStatus,
  DeliveryRecord,
  Guard,
  MaintenanceRequest,
  MaintenanceStatus,
  Organization,
  PaymentTransaction,
  Plan,
  PlatformUser,
  Property,
  Resident,
  ServiceBooking,
  ServiceCategory,
  ServiceProvider,
  Subscription,
  Unit,
  UserRole,
  VisitorRequest,
  VisitorStatus,
} from "@/types";
import {
  initialAuditLogs,
  initialBookings,
  initialCategories,
  initialDeliveries,
  initialGuards,
  initialMaintenance,
  initialOrganizations,
  initialPayments,
  initialPlans,
  initialProperties,
  initialProviders,
  initialResidents,
  initialSubscriptions,
  initialUnits,
  initialUsers,
  initialVisitors,
} from "@/lib/mock-data/seed";
import { toast } from "sonner";

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "visitor" | "service" | "maintenance" | "delivery" | "system";
}

interface DemoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  selectedOrganizationId: string;
  setSelectedOrganizationId: (id: string) => void;
  dateFilter: "today" | "last_7_days" | "last_30_days";
  setDateFilter: (filter: "today" | "last_7_days" | "last_30_days") => void;

  organizations: Organization[];
  properties: Property[];
  units: Unit[];
  residents: Resident[];
  guards: Guard[];
  visitors: VisitorRequest[];
  providers: ServiceProvider[];
  bookings: ServiceBooking[];
  maintenance: MaintenanceRequest[];
  deliveries: DeliveryRecord[];
  auditLogs: ActivityEvent[];
  plans: Plan[];
  subscriptions: Subscription[];
  payments: PaymentTransaction[];
  categories: ServiceCategory[];
  users: PlatformUser[];
  notifications: DemoNotification[];

  // Actions
  approveVisitor: (visitorId: string, reason?: string) => void;
  rejectVisitor: (visitorId: string, reason: string) => void;
  checkInVisitor: (visitorId: string) => void;
  checkOutVisitor: (visitorId: string) => void;
  registerVisitor: (data: Partial<VisitorRequest>) => void;

  addProperty: (property: Partial<Property>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;

  addResident: (resident: Partial<Resident>) => void;
  updateResident: (id: string, resident: Partial<Resident>) => void;

  addGuard: (guard: Partial<Guard>) => void;
  toggleGuardDuty: (guardId: string) => void;

  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addBooking: (booking: Partial<ServiceBooking>) => void;

  updateMaintenanceStatus: (
    id: string,
    status: MaintenanceStatus,
    assignedProviderId?: string
  ) => void;
  createMaintenanceRequest: (request: Partial<MaintenanceRequest>) => void;

  registerDelivery: (delivery: Partial<DeliveryRecord>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryRecord["status"]) => void;

  toggleProviderFeatured: (providerId: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleCategoryStatus: (categoryId: string) => void;
  updateSubscriptionStatus: (
    subId: string,
    status: Subscription["status"]
  ) => void;

  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "smart_entry_demo_state_v1";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  const [role, setRoleState] = useState<UserRole>("property_manager");
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("org-1");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"today" | "last_7_days" | "last_30_days">("today");

  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [guards, setGuards] = useState<Guard[]>(initialGuards);
  const [visitors, setVisitors] = useState<VisitorRequest[]>(initialVisitors);
  const [providers, setProviders] = useState<ServiceProvider[]>(initialProviders);
  const [bookings, setBookings] = useState<ServiceBooking[]>(initialBookings);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(initialMaintenance);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(initialDeliveries);
  const [auditLogs, setAuditLogs] = useState<ActivityEvent[]>(initialAuditLogs);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [payments, setPayments] = useState<PaymentTransaction[]>(initialPayments);
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories);
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [notifications, setNotifications] = useState<DemoNotification[]>([
    {
      id: "notif-1",
      title: "Visitor Arrival at Main Gate",
      message: "Kenneth Tumusiime arrived for Grace Nakato (A-102). Awaiting resident approval.",
      timestamp: "2026-10-17T19:48:00Z",
      read: false,
      type: "visitor",
    },
    {
      id: "notif-2",
      title: "Delivery Arrived",
      message: "Jumia courier at Acacia Heights for David Mukasa (A-101).",
      timestamp: "2026-10-17T19:40:00Z",
      read: false,
      type: "delivery",
    },
    {
      id: "notif-3",
      title: "Urgent Maintenance Assigned",
      message: "Main stairwell electrical sparking assigned to BrightSpark Electrical.",
      timestamp: "2026-10-17T18:15:00Z",
      read: true,
      type: "maintenance",
    },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.properties) setProperties(parsed.properties);
        if (parsed.units) setUnits(parsed.units);
        if (parsed.residents) setResidents(parsed.residents);
        if (parsed.guards) setGuards(parsed.guards);
        if (parsed.visitors) setVisitors(parsed.visitors);
        if (parsed.providers) setProviders(parsed.providers);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.maintenance) setMaintenance(parsed.maintenance);
        if (parsed.deliveries) setDeliveries(parsed.deliveries);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.role) setRoleState(parsed.role);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch {
      // ignore parsing error
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const payload = {
        role,
        properties,
        units,
        residents,
        guards,
        visitors,
        providers,
        bookings,
        maintenance,
        deliveries,
        auditLogs,
        subscriptions,
        categories,
        users,
        notifications,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // storage limit or quota
    }
  }, [
    isInitialized,
    role,
    properties,
    units,
    residents,
    guards,
    visitors,
    providers,
    bookings,
    maintenance,
    deliveries,
    auditLogs,
    subscriptions,
    categories,
    users,
    notifications,
  ]);

  const addAuditEvent = (
    action: string,
    description: string,
    entityType: string,
    entityId: string,
    propertyId?: string
  ) => {
    const actor =
      role === "platform_admin"
        ? "Catherine Namubiru (Admin)"
        : role === "security_supervisor"
        ? "Major Ronald Kanyike (Supervisor)"
        : "Arthur Ssekandi (Property Manager)";

    const newEvent: ActivityEvent = {
      id: `aud-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      actorName: actor,
      action,
      description,
      entityType,
      entityId,
      propertyId: propertyId || (selectedPropertyId !== "all" ? selectedPropertyId : "prop-1"),
    };

    setAuditLogs((prev) => [newEvent, ...prev]);
  };

  const addSimulatedNotification = (
    title: string,
    message: string,
    type: DemoNotification["type"]
  ) => {
    const newNotif: DemoNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    addAuditEvent("Demo Role Switched", `Switched active demo preview role to ${newRole}`, "Session", "demo-role");
    toast.info(`Switched view to ${newRole.replace("_", " ").toUpperCase()} role.`);
  };

  const approveVisitor = (visitorId: string, reason?: string) => {
    const visitor = visitors.find((v) => v.id === visitorId);
    if (!visitor) return;

    const now = new Date().toISOString();
    const actor =
      role === "property_manager"
        ? `${visitor.residentName} (Simulated resident approval)`
        : "Supervisor Override";

    const updatedVisitors = visitors.map((v) => {
      if (v.id === visitorId) {
        return {
          ...v,
          status: "approved" as VisitorStatus,
          decision: "approved" as const,
          decisionAt: now,
          decisionBy: actor,
          timeline: [
            ...v.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: actor,
              action: "Entry Approved",
              description: reason ? `Approval note: ${reason}` : "Visitor approved for gate entry.",
              entityType: "VisitorRequest",
              entityId: visitor.id,
            },
          ],
        };
      }
      return v;
    });

    setVisitors(updatedVisitors);
    addAuditEvent("Visitor Entry Approved", `Approved visitor ${visitor.visitorName} for unit ${visitor.unitNumber}`, "VisitorRequest", visitor.id, visitor.propertyId);
    addSimulatedNotification("Entry Approved", `Visitor ${visitor.visitorName} was approved for entry to ${visitor.unitNumber}.`, "visitor");
    toast.success(`Visitor ${visitor.visitorName} approved. Gate may record entry.`);
  };

  const rejectVisitor = (visitorId: string, reason: string) => {
    const visitor = visitors.find((v) => v.id === visitorId);
    if (!visitor) return;

    const now = new Date().toISOString();
    const actor = `${visitor.residentName} (Simulated resident decision)`;

    const updatedVisitors = visitors.map((v) => {
      if (v.id === visitorId) {
        return {
          ...v,
          status: "rejected" as VisitorStatus,
          decision: "rejected" as const,
          decisionAt: now,
          decisionBy: actor,
          rejectionReason: reason || "Visitor declined by resident.",
          timeline: [
            ...v.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: actor,
              action: "Entry Rejected",
              description: `Reason: ${reason || "No reason given"}`,
              entityType: "VisitorRequest",
              entityId: visitor.id,
            },
          ],
        };
      }
      return v;
    });

    setVisitors(updatedVisitors);
    addAuditEvent("Visitor Entry Rejected", `Rejected visitor ${visitor.visitorName}. Reason: ${reason}`, "VisitorRequest", visitor.id, visitor.propertyId);
    addSimulatedNotification("Entry Rejected", `Visitor ${visitor.visitorName} rejected. Reason: ${reason}`, "visitor");
    toast.error(`Visitor ${visitor.visitorName} rejected.`);
  };

  const checkInVisitor = (visitorId: string) => {
    const visitor = visitors.find((v) => v.id === visitorId);
    if (!visitor) return;

    const now = new Date().toISOString();
    const guardName = "Gate Security Officer";

    const updatedVisitors = visitors.map((v) => {
      if (v.id === visitorId) {
        return {
          ...v,
          status: "checked_in" as VisitorStatus,
          checkedInAt: now,
          timeline: [
            ...v.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: guardName,
              action: "Gate Checked In",
              description: `Physical barrier opened. Visitor admitted to ${v.unitNumber}.`,
              entityType: "VisitorRequest",
              entityId: visitor.id,
            },
          ],
        };
      }
      return v;
    });

    setVisitors(updatedVisitors);
    addAuditEvent("Visitor Checked In", `Visitor ${visitor.visitorName} admitted at ${visitor.gateName}`, "VisitorRequest", visitor.id, visitor.propertyId);
    toast.success(`Entry recorded for ${visitor.visitorName}. Status: Checked In.`);
  };

  const checkOutVisitor = (visitorId: string) => {
    const visitor = visitors.find((v) => v.id === visitorId);
    if (!visitor) return;

    const now = new Date().toISOString();
    const guardName = "Gate Security Officer";

    const updatedVisitors = visitors.map((v) => {
      if (v.id === visitorId) {
        return {
          ...v,
          status: "checked_out" as VisitorStatus,
          checkedOutAt: now,
          timeline: [
            ...v.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: guardName,
              action: "Gate Checked Out",
              description: `Visitor departed premises through ${v.gateName}. Visit concluded.`,
              entityType: "VisitorRequest",
              entityId: visitor.id,
            },
          ],
        };
      }
      return v;
    });

    setVisitors(updatedVisitors);
    addAuditEvent("Visitor Checked Out", `Visitor ${visitor.visitorName} departed premises`, "VisitorRequest", visitor.id, visitor.propertyId);
    toast.success(`Exit recorded for ${visitor.visitorName}. Visit closed.`);
  };

  const registerVisitor = (data: Partial<VisitorRequest>) => {
    const property = properties.find((p) => p.id === data.propertyId) || properties[0];
    const newId = `vis-${Date.now()}`;
    const newRef = `VIS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const isPreApproved = data.status === "approved";

    const newRecord: VisitorRequest = {
      id: newId,
      reference: newRef,
      visitorName: data.visitorName || "Unnamed Guest",
      visitorPhone: data.visitorPhone || "+256 700 000000",
      visitType: data.visitType || "guest",
      propertyId: property.id,
      propertyName: property.name,
      unitNumber: data.unitNumber || "A-101",
      residentId: data.residentId || "res-1",
      residentName: data.residentName || "David Mukasa",
      gateName: data.gateName || property.gates[0] || "Main Gate",
      purpose: data.purpose || "General visit",
      expectedArrivalAt: data.expectedArrivalAt || now,
      arrivedAt: now,
      status: isPreApproved ? "approved" : "awaiting_approval",
      guardName: "Gate Security",
      timeline: [
        {
          id: `evt-${Date.now()}`,
          occurredAt: now,
          actorName: "Registration Concierge",
          action: isPreApproved ? "Pre-approved Visitor Created" : "Visitor Registered",
          description: `Logged for unit ${data.unitNumber || "A-101"}. ${
            isPreApproved ? "Pre-approved by resident." : "Awaiting approval."
          }`,
          entityType: "VisitorRequest",
          entityId: newId,
        },
      ],
    };

    setVisitors([newRecord, ...visitors]);
    addAuditEvent("Visitor Registered", `Created visitor record ${newRef} for ${newRecord.visitorName}`, "VisitorRequest", newId, property.id);
    addSimulatedNotification(
      "New Visitor Request",
      `${newRecord.visitorName} arrived at ${newRecord.gateName} for unit ${newRecord.unitNumber}.`,
      "visitor"
    );
    toast.success(`Visitor ${newRecord.visitorName} registered successfully.`);
  };

  const addProperty = (data: Partial<Property>) => {
    const newId = `prop-${Date.now()}`;
    const newProp: Property = {
      id: newId,
      organizationId: "org-1",
      name: data.name || "New Residential Property",
      type: data.type || "apartment_complex",
      address: data.address || "Kampala, Uganda",
      city: data.city || "Kampala",
      status: "active",
      totalUnits: Number(data.totalUnits) || 20,
      occupiedUnits: 0,
      gates: data.gates && data.gates.length > 0 ? data.gates : ["Main Entrance Gate"],
      notes: data.notes || "Added in demo simulation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties([newProp, ...properties]);
    addAuditEvent("Property Created", `Created property ${newProp.name}`, "Property", newId, newId);
    toast.success(`Property "${newProp.name}" added successfully.`);
  };

  const updateProperty = (id: string, data: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p))
    );
    addAuditEvent("Property Updated", `Updated details for property ${id}`, "Property", id, id);
    toast.success("Property updated successfully.");
  };

  const addResident = (data: Partial<Resident>) => {
    const prop = properties.find((p) => p.id === data.propertyId) || properties[0];
    const newId = `res-${Date.now()}`;
    const initials = `${(data.firstName || "N")[0]}${(data.lastName || "R")[0]}`.toUpperCase();

    const newRes: Resident = {
      id: newId,
      firstName: data.firstName || "New",
      lastName: data.lastName || "Resident",
      email: data.email || "resident@example.com",
      phone: data.phone || "+256 700 123456",
      propertyId: prop.id,
      propertyName: prop.name,
      unitNumber: data.unitNumber || "101",
      residentType: data.residentType || "tenant",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      recentVisitorCount: 0,
      avatarInitials: initials,
      emergencyContact: data.emergencyContact,
    };

    setResidents([newRes, ...residents]);
    addAuditEvent("Resident Added", `Added resident ${newRes.firstName} ${newRes.lastName} to ${newRes.unitNumber}`, "Resident", newId, prop.id);
    toast.success(`Resident ${newRes.firstName} ${newRes.lastName} registered.`);
  };

  const updateResident = (id: string, data: Partial<Resident>) => {
    setResidents((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    toast.success("Resident profile updated.");
  };

  const addGuard = (data: Partial<Guard>) => {
    const prop = properties.find((p) => p.id === data.propertyId) || properties[0];
    const newId = `grd-${Date.now()}`;
    const newGuard: Guard = {
      id: newId,
      fullName: data.fullName || "Security Guard",
      employeeId: `GRD-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: prop.id,
      propertyName: prop.name,
      gateName: data.gateName || prop.gates[0] || "Main Gate",
      shift: data.shift || "Day Shift (06:00 - 18:00)",
      phone: data.phone || "+256 770 000000",
      dutyStatus: data.dutyStatus || "on_duty",
      lastActivityAt: new Date().toISOString(),
    };

    setGuards([newGuard, ...guards]);
    addAuditEvent("Guard Added", `Assigned guard ${newGuard.fullName} to ${newGuard.gateName}`, "Guard", newId, prop.id);
    toast.success(`Guard ${newGuard.fullName} assigned.`);
  };

  const toggleGuardDuty = (guardId: string) => {
    setGuards((prev) =>
      prev.map((g) => {
        if (g.id === guardId) {
          const nextStatus = g.dutyStatus === "on_duty" ? "off_duty" : "on_duty";
          return { ...g, dutyStatus: nextStatus, lastActivityAt: new Date().toISOString() };
        }
        return g;
      })
    );
    toast.info("Guard duty status updated.");
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;

    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          status,
          timeline: [
            ...b.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: "Service Coordinator",
              action: `Booking Status Changed to ${status.toUpperCase()}`,
              description: `Booking updated from ${b.status} to ${status}.`,
              entityType: "ServiceBooking",
              entityId: id,
            },
          ],
        };
      }
      return b;
    });

    setBookings(updated);
    addAuditEvent("Booking Status Updated", `Booking ${booking.reference} marked as ${status}`, "ServiceBooking", id, booking.propertyId);
    addSimulatedNotification(
      "Service Booking Update",
      `Booking ${booking.reference} (${booking.serviceName}) is now ${status}.`,
      "service"
    );
    toast.success(`Booking ${booking.reference} updated to ${status}.`);
  };

  const addBooking = (data: Partial<ServiceBooking>) => {
    const prop = properties.find((p) => p.id === data.propertyId) || properties[0];
    const provider = providers.find((pv) => pv.id === data.providerId) || providers[0];
    const newId = `bk-${Date.now()}`;
    const newRef = `BKG-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking: ServiceBooking = {
      id: newId,
      reference: newRef,
      residentId: data.residentId || "res-1",
      residentName: data.residentName || "David Mukasa",
      providerId: provider.id,
      providerName: provider.businessName,
      propertyId: prop.id,
      propertyName: prop.name,
      unitNumber: data.unitNumber || "A-101",
      serviceName: data.serviceName || "Household Service",
      requestedAt: new Date().toISOString(),
      scheduledAt: data.scheduledAt,
      estimatedAmount: data.estimatedAmount || provider.indicativeStartingPrice,
      currency: "UGX",
      status: "requested",
      notes: data.notes,
      timeline: [
        {
          id: `evt-${Date.now()}`,
          occurredAt: new Date().toISOString(),
          actorName: data.residentName || "Resident",
          action: "Booking Created",
          description: `Dispatched service request to ${provider.businessName}.`,
          entityType: "ServiceBooking",
          entityId: newId,
        },
      ],
    };

    setBookings([newBooking, ...bookings]);
    addAuditEvent("Service Booking Placed", `Created booking ${newRef} for ${provider.businessName}`, "ServiceBooking", newId, prop.id);
    toast.success(`Booking ${newRef} submitted to provider.`);
  };

  const updateMaintenanceStatus = (
    id: string,
    status: MaintenanceStatus,
    assignedProviderId?: string
  ) => {
    const req = maintenance.find((m) => m.id === id);
    if (!req) return;

    const now = new Date().toISOString();
    const provider = assignedProviderId
      ? providers.find((p) => p.id === assignedProviderId)
      : undefined;

    const updated = maintenance.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status,
          assignedProviderId: assignedProviderId || m.assignedProviderId,
          assignedProviderName: provider ? provider.businessName : m.assignedProviderName,
          completedAt: status === "completed" ? now : m.completedAt,
          updatedAt: now,
          timeline: [
            ...m.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: "Maintenance Manager",
              action: `Status Updated to ${status.toUpperCase()}`,
              description: provider
                ? `Assigned to contractor ${provider.businessName}.`
                : `Status updated to ${status}.`,
              entityType: "MaintenanceRequest",
              entityId: id,
            },
          ],
        };
      }
      return m;
    });

    setMaintenance(updated);
    addAuditEvent("Maintenance Updated", `Request ${req.reference} marked as ${status}`, "MaintenanceRequest", id, req.propertyId);
    toast.success(`Maintenance request ${req.reference} updated.`);
  };

  const createMaintenanceRequest = (data: Partial<MaintenanceRequest>) => {
    const prop = properties.find((p) => p.id === data.propertyId) || properties[0];
    const newId = `mnt-${Date.now()}`;
    const newRef = `MNT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newReq: MaintenanceRequest = {
      id: newId,
      reference: newRef,
      title: data.title || "Facility Maintenance Issue",
      category: data.category || "General Maintenance",
      propertyId: prop.id,
      propertyName: prop.name,
      unitNumber: data.unitNumber || "Common Area",
      reportedBy: data.reportedBy || "Property Staff",
      reportedByEmail: data.reportedByEmail || "manager@example.com",
      description: data.description || "Reported via manager portal.",
      priority: data.priority || "normal",
      status: "pending",
      assignedProviderId: data.assignedProviderId,
      createdAt: now,
      updatedAt: now,
      notes: ["Initial ticket submitted."],
      timeline: [
        {
          id: `evt-${Date.now()}`,
          occurredAt: now,
          actorName: data.reportedBy || "Manager",
          action: "Ticket Created",
          description: "New maintenance ticket opened.",
          entityType: "MaintenanceRequest",
          entityId: newId,
        },
      ],
    };

    setMaintenance([newReq, ...maintenance]);
    addAuditEvent("Maintenance Ticket Created", `Opened ticket ${newRef}: ${newReq.title}`, "MaintenanceRequest", newId, prop.id);
    addSimulatedNotification(
      "Maintenance Ticket Logged",
      `Ticket ${newRef} logged for ${newReq.propertyName} (${newReq.unitNumber}).`,
      "maintenance"
    );
    toast.success(`Maintenance request ${newRef} created.`);
  };

  const registerDelivery = (data: Partial<DeliveryRecord>) => {
    const prop = properties.find((p) => p.id === data.propertyId) || properties[0];
    const newId = `del-${Date.now()}`;
    const newRef = `DEL-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newDel: DeliveryRecord = {
      id: newId,
      reference: newRef,
      company: data.company || "Local Courier",
      deliveryPerson: data.deliveryPerson || "Delivery Rider",
      deliveryPhone: data.deliveryPhone || "+256 700 112233",
      propertyId: prop.id,
      propertyName: prop.name,
      unitNumber: data.unitNumber || "A-101",
      residentName: data.residentName || "David Mukasa",
      arrivedAt: now,
      description: data.description || "Package delivery parcel",
      status: "awaiting_resident_decision",
      recordedBy: "Main Gate Guard",
      timeline: [
        {
          id: `evt-${Date.now()}`,
          occurredAt: now,
          actorName: "Gate Guard",
          action: "Delivery Rider Arrived",
          description: `Rider for ${data.company || "Courier"} checked in at barrier.`,
          entityType: "DeliveryRecord",
          entityId: newId,
        },
      ],
    };

    setDeliveries([newDel, ...deliveries]);
    addAuditEvent("Delivery Logged", `Logged delivery ${newRef} from ${newDel.company}`, "DeliveryRecord", newId, prop.id);
    addSimulatedNotification(
      "Delivery at Gate",
      `${newDel.company} courier arrived with package for ${newDel.unitNumber}.`,
      "delivery"
    );
    toast.success(`Delivery arrival ${newRef} recorded.`);
  };

  const updateDeliveryStatus = (id: string, status: DeliveryRecord["status"]) => {
    const del = deliveries.find((d) => d.id === id);
    if (!del) return;

    const now = new Date().toISOString();
    const updated = deliveries.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status,
          timeline: [
            ...d.timeline,
            {
              id: `evt-${Date.now()}`,
              occurredAt: now,
              actorName: "Gate Concierge",
              action: `Delivery Status: ${status}`,
              description: `Action applied to delivery parcel.`,
              entityType: "DeliveryRecord",
              entityId: id,
            },
          ],
        };
      }
      return d;
    });

    setDeliveries(updated);
    addAuditEvent("Delivery Status Changed", `Delivery ${del.reference} marked as ${status}`, "DeliveryRecord", id, del.propertyId);
    toast.success(`Delivery ${del.reference} status updated.`);
  };

  const toggleProviderFeatured = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, featured: !p.featured } : p))
    );
    toast.info("Provider featured status toggled.");
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    addAuditEvent("User Role Modified", `Changed user ${userId} role to ${newRole}`, "PlatformUser", userId);
    toast.success("User role updated successfully.");
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
    toast.info("Service category status toggled.");
  };

  const updateSubscriptionStatus = (subId: string, status: Subscription["status"]) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === subId ? { ...s, status } : s)));
    toast.success("Subscription status updated.");
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.info("All notifications marked as read.");
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setProperties(initialProperties);
    setUnits(initialUnits);
    setResidents(initialResidents);
    setGuards(initialGuards);
    setVisitors(initialVisitors);
    setProviders(initialProviders);
    setBookings(initialBookings);
    setMaintenance(initialMaintenance);
    setDeliveries(initialDeliveries);
    setAuditLogs(initialAuditLogs);
    setPlans(initialPlans);
    setSubscriptions(initialSubscriptions);
    setPayments(initialPayments);
    setCategories(initialCategories);
    setUsers(initialUsers);
    setRoleState("property_manager");
    setSelectedOrganizationId("org-1");
    setSelectedPropertyId("all");
    toast.success("Demo dataset reset to initial state!");
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        selectedPropertyId,
        setSelectedPropertyId,
        selectedOrganizationId,
        setSelectedOrganizationId,
        dateFilter,
        setDateFilter,

        organizations,
        properties,
        units,
        residents,
        guards,
        visitors,
        providers,
        bookings,
        maintenance,
        deliveries,
        auditLogs,
        plans,
        subscriptions,
        payments,
        categories,
        users,
        notifications,

        approveVisitor,
        rejectVisitor,
        checkInVisitor,
        checkOutVisitor,
        registerVisitor,

        addProperty,
        updateProperty,

        addResident,
        updateResident,

        addGuard,
        toggleGuardDuty,

        updateBookingStatus,
        addBooking,

        updateMaintenanceStatus,
        createMaintenanceRequest,

        registerDelivery,
        updateDeliveryStatus,

        toggleProviderFeatured,
        updateUserRole,
        toggleCategoryStatus,
        updateSubscriptionStatus,

        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
