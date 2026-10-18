export type RecordStatus = "active" | "inactive";

export type UserRole =
  | "property_manager"
  | "platform_admin"
  | "security_supervisor"
  | "guard"
  | "resident"
  | "service_provider";

export type VisitType =
  | "guest"
  | "service_provider"
  | "delivery"
  | "vendor"
  | "maintenance";

export type VisitorStatus =
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "checked_in"
  | "checked_out"
  | "expired"
  | "cancelled";

export type ResidentType = "owner" | "tenant";

export type MaintenanceStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "awaiting_parts"
  | "completed"
  | "rejected"
  | "cancelled";

export type Priority = "low" | "normal" | "high" | "urgent";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Organization {
  id: string;
  name: string;
  status: RecordStatus;
  planId?: string;
  propertyCount: number;
  contactEmail: string;
  createdAt: string;
}

export interface Property {
  id: string;
  organizationId: string;
  name: string;
  type: "apartment_complex" | "gated_community" | "residential_estate" | "standalone_building";
  address: string;
  city: string;
  status: RecordStatus;
  managerId?: string;
  totalUnits: number;
  occupiedUnits: number;
  gates: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  propertyId: string;
  name: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  buildingName?: string;
  unitNumber: string;
  occupancyStatus: "occupied" | "vacant" | "maintenance";
  residentIds: string[];
  primaryResidentName?: string;
  openMaintenanceCount: number;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  residentType: ResidentType;
  status: "active" | "pending_invitation" | "inactive";
  joinedDate: string;
  recentVisitorCount: number;
  emergencyContact?: string;
  avatarInitials: string;
}

export interface Guard {
  id: string;
  fullName: string;
  employeeId: string;
  propertyId: string;
  propertyName: string;
  gateName: string;
  shift: string;
  phone: string;
  dutyStatus: "on_duty" | "off_duty" | "leave";
  lastActivityAt: string;
}

export interface ActivityEvent {
  id: string;
  occurredAt: string;
  actorId?: string;
  actorName: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  propertyId?: string;
}

export interface VisitorRequest {
  id: string;
  reference: string;
  visitorName: string;
  visitorPhone?: string;
  visitType: VisitType;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  residentId: string;
  residentName: string;
  gateName: string;
  purpose: string;
  expectedArrivalAt: string;
  arrivedAt?: string;
  decision?: "approved" | "rejected";
  decisionAt?: string;
  decisionBy?: string;
  rejectionReason?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  status: VisitorStatus;
  guardId?: string;
  guardName?: string;
  notes?: string;
  timeline: ActivityEvent[];
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  contactPerson: string;
  categories: string[];
  description: string;
  serviceAreas: string[];
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  indicativeStartingPrice: number;
  currency: "UGX";
  verificationStatus: "pending" | "verified" | "rejected";
  availability: "available" | "busy" | "unavailable";
  featured: boolean;
  status: RecordStatus;
}

export type PortfolioMediaKind = "image" | "video";

export interface PortfolioMedia {
  id: string;
  kind: PortfolioMediaKind;
  /** Image URL, direct video file URL, or a TikTok video id when platform is "tiktok". */
  src: string;
  /** Preview image for videos. */
  poster?: string;
  /** Width / height ratio, used to render the masonry layout without layout shift. */
  aspect: number;
  caption: string;
  /** Videos only: how `src` is played. Defaults to "file". */
  platform?: "file" | "tiktok";
}

export interface ProviderReview {
  id: string;
  author: string;
  unit: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProviderProfile {
  providerId: string;
  tagline: string;
  yearsExperience: number;
  completedJobs: number;
  responseTime: string;
  languages: string[];
  services: string[];
  certifications: string[];
  portfolio: PortfolioMedia[];
  reviews: ProviderReview[];
}

export interface ServiceBooking {
  id: string;
  reference: string;
  residentId: string;
  residentName: string;
  providerId: string;
  providerName: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  serviceName: string;
  requestedAt: string;
  scheduledAt?: string;
  estimatedAmount: number;
  currency: "UGX";
  status: BookingStatus;
  notes?: string;
  timeline: ActivityEvent[];
}

export interface MaintenanceRequest {
  id: string;
  reference: string;
  title: string;
  category: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  reportedBy: string;
  reportedByEmail: string;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes: string[];
  timeline: ActivityEvent[];
}

export interface DeliveryRecord {
  id: string;
  reference: string;
  company: string;
  deliveryPerson: string;
  deliveryPhone?: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  residentName: string;
  arrivedAt: string;
  description: string;
  status:
    | "arrived"
    | "awaiting_resident_decision"
    | "entry_approved"
    | "entry_rejected"
    | "delivered_to_resident"
    | "left_at_gate"
    | "departed"
    | "cancelled";
  recordedBy: string;
  timeline: ActivityEvent[];
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  currency: "UGX";
  maxProperties: number | "unlimited";
  maxUnits: number | "unlimited";
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  organizationName: string;
  propertyName: string;
  planId: string;
  planName: string;
  billingCycle: "Monthly" | "Annual";
  status: "active" | "past_due" | "cancelled";
  amount: number;
  currency: "UGX";
  nextBillingDate: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  type: "Subscription" | "Service Commission" | "Platform Fee";
  description: string;
  relatedEntity: string;
  amount: number;
  currency: "UGX";
  status: "Completed" | "Pending" | "Refunded";
  date: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  providerCount: number;
  status: RecordStatus;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationName: string;
  status: "active" | "pending_invitation" | "inactive";
  lastActive: string;
  avatarInitials: string;
}
