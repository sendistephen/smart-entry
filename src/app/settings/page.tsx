"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useDemo } from "@/lib/store/demo-context";
import { Settings, Bell, Shield, Database, RotateCcw, Building } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { role, setRole, resetDemoData } = useDemo();

  // Notification toggles
  const [notifVisitorArrival, setNotifVisitorArrival] = useState(true);
  const [notifDecisions, setNotifDecisions] = useState(true);
  const [notifMaintenance, setNotifMaintenance] = useState(true);
  const [notifDeliveries, setNotifDeliveries] = useState(true);
  const [notifGuards, setNotifGuards] = useState(false);

  return (
    <AppShell>
      <PageHeader
        title="Portal & System Settings"
        description="Configure demonstration preferences, simulated notification triggers, organization profile, and security permissions."
        actions={
          <Button
            variant="outline"
            onClick={resetDemoData}
            className="border-zinc-300 text-xs sm:text-sm h-9 bg-white text-zinc-800 hover:bg-zinc-50"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 text-zinc-600" />
            Reset All Demo Data
          </Button>
        }
      />

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-zinc-100 p-1 border border-zinc-200">
          <TabsTrigger value="notifications" className="text-xs data-[state=active]:bg-white">
            Notification Triggers
          </TabsTrigger>
          <TabsTrigger value="organization" className="text-xs data-[state=active]:bg-white">
            Organization Profile
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs data-[state=active]:bg-white">
            Role Matrix
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs data-[state=active]:bg-white">
            Data & Privacy Policy
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-200/70">
              <CardTitle className="text-base font-bold text-zinc-900">
                Simulated Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Configure which gate and facility events create in-app demo alerts. No external SMS or WhatsApp messages are transmitted.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-5 sm:pt-5 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-zinc-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900">
                    Visitor Barrier Arrival
                  </div>
                  <div className="text-zinc-500">
                    Dispatch notification to destination resident when guest arrives at the gate.
                  </div>
                </div>
                <Switch
                  checked={notifVisitorArrival}
                  onCheckedChange={setNotifVisitorArrival}
                  className="data-[state=checked]:bg-brand-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-zinc-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900">
                    Resident Entry Decision
                  </div>
                  <div className="text-zinc-500">
                    Notify security officer tablet when resident approves or rejects access.
                  </div>
                </div>
                <Switch
                  checked={notifDecisions}
                  onCheckedChange={setNotifDecisions}
                  className="data-[state=checked]:bg-brand-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-zinc-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900">
                    Maintenance Ticket Progression
                  </div>
                  <div className="text-zinc-500">
                    Alert reporting resident when contractor is assigned or work is completed.
                  </div>
                </div>
                <Switch
                  checked={notifMaintenance}
                  onCheckedChange={setNotifMaintenance}
                  className="data-[state=checked]:bg-brand-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-zinc-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900">
                    Delivery Rider at Barrier
                  </div>
                  <div className="text-zinc-500">
                    Notify resident immediately upon courier arrival at the entrance gate.
                  </div>
                </div>
                <Switch
                  checked={notifDeliveries}
                  onCheckedChange={setNotifDeliveries}
                  className="data-[state=checked]:bg-brand-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-white border border-zinc-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900">
                    Guard Shift Check-ins
                  </div>
                  <div className="text-zinc-500">
                    Alert property manager when security guard starts or concludes a shift.
                  </div>
                </div>
                <Switch
                  checked={notifGuards}
                  onCheckedChange={setNotifGuards}
                  className="data-[state=checked]:bg-brand-700"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => toast.success("Notification preferences saved locally.")}
                  className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization">
          <Card>
            <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-200/70">
              <CardTitle className="text-base font-bold text-zinc-900">
                Organization Profile
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Primary corporate details for the property management firm.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-5 sm:pt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Company Name</label>
                  <Input
                    defaultValue="Apex Crest Property Holdings"
                    className="h-9 text-xs border-zinc-300 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Business Registration (TIN)</label>
                  <Input
                    defaultValue="1009849201"
                    className="h-9 text-xs border-zinc-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 min-[425px]:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Administrative Email</label>
                  <Input
                    defaultValue="admin@apexcrest.example.com"
                    className="h-9 text-xs border-zinc-300 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Support Helpline</label>
                  <Input
                    defaultValue="+256 772 100293"
                    className="h-9 text-xs border-zinc-300 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Head Office Address</label>
                <Input
                  defaultValue="Plot 14 Kololo Hill Drive, Kampala, Uganda"
                  className="h-9 text-xs border-zinc-300 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => toast.success("Organization profile updated.")}
                  className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs"
                >
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Matrix */}
        <TabsContent value="permissions">
          <Card className="bg-white">
            <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900">
                Role Permission Hierarchy
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Summary of operational permissions simulated in this web presentation.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto">
                <table className="w-full min-w-max [&_tr>*:first-child]:pl-5 [&_tr>*:last-child]:pr-5 text-left text-xs text-zinc-700">
                  <thead className="bg-zinc-50 border-b border-zinc-200 font-medium text-xs text-zinc-900">
                    <tr>
                      <th className="px-4 py-3.5">Capability / action</th>
                      <th className="px-4 py-3.5">Resident</th>
                      <th className="px-4 py-3.5">Gate guard</th>
                      <th className="px-4 py-3.5">Property manager</th>
                      <th className="px-4 py-3.5">Platform admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    <tr>
                      <td className="px-4 py-3.5 font-medium text-zinc-900">Approve / Reject Visitors</td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-900">Primary Authority</td>
                      <td className="px-4 py-3.5 text-zinc-400">View Only</td>
                      <td className="px-4 py-3.5 text-zinc-700">Supervisor Override</td>
                      <td className="px-4 py-3.5 text-zinc-700">Full Audit</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-medium text-zinc-900">Record Gate Check-in & Departure</td>
                      <td className="px-4 py-3.5 text-zinc-400">No</td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-900">Primary Authority</td>
                      <td className="px-4 py-3.5 text-zinc-700">Allowed</td>
                      <td className="px-4 py-3.5 text-zinc-700">Allowed</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-medium text-zinc-900">Book Service Marketplace</td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-900">Direct Request</td>
                      <td className="px-4 py-3.5 text-zinc-400">No</td>
                      <td className="px-4 py-3.5 text-zinc-700">Assisted Request</td>
                      <td className="px-4 py-3.5 text-zinc-700">Manage Listings</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-medium text-zinc-900">Manage Properties & Units</td>
                      <td className="px-4 py-3.5 text-zinc-400">No</td>
                      <td className="px-4 py-3.5 text-zinc-400">No</td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-900">Assigned Properties</td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-900">Global Portfolio</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-medium text-zinc-900">SaaS Subscriptions & Plans</td>
                      <td className="px-4 py-3.5 text-zinc-400">No</td>
                      <td className="px-4 py-3.5 text-zinc-400">No</td>
                      <td className="px-4 py-3.5 text-zinc-700">View Own Tier</td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-900">Manage Plans</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy Policy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader className="pb-4 sm:pb-5 border-b border-zinc-200/70">
              <CardTitle className="text-base font-bold text-zinc-900">
                Data Retention & Privacy Notice
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Legal and compliance placeholder policy text.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-5 sm:pt-5 text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                <strong>Residential Visitor Data Retention:</strong> Gate arrival and exit records containing visitor identity, vehicle registration, and destination residential units are preserved for 90 days in accordance with community security policies before archival.
              </p>
              <p>
                <strong>Security Guard Accountability:</strong> All access override actions and barrier logs capture the digital identity of the on-duty officer to ensure non-repudiation in the event of an incident.
              </p>
              <p>
                <strong>Demonstration Note:</strong> All resident identities and contact numbers within this software evaluation instance are fictitious and comply with client demonstration safeguards.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
