"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDemo } from "@/lib/store/demo-context";
import { VisitorRequest } from "@/types";

interface UseVisitorsParams {
  propertyId?: string;
  search?: string;
  statusFilter?: string;
}

export function useVisitorsQuery({
  propertyId = "all",
  search = "",
  statusFilter = "all",
}: UseVisitorsParams = {}) {
  const { visitors } = useDemo();

  return useQuery({
    queryKey: ["visitors", { propertyId, search, statusFilter, length: visitors.length }],
    queryFn: async () => {
      // Small simulated latency for snappy, realistic cache & state transitions
      await new Promise((res) => setTimeout(res, 40));

      const query = (search || "").toLowerCase().trim();

      return visitors.filter((v) => {
        const matchesProperty =
          propertyId === "all" || v.propertyId === propertyId;
        const matchesSearch =
          !query ||
          v.visitorName.toLowerCase().includes(query) ||
          v.unitNumber.toLowerCase().includes(query) ||
          v.reference.toLowerCase().includes(query) ||
          v.residentName.toLowerCase().includes(query) ||
          v.gateName.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || v.status === statusFilter;

        return matchesProperty && matchesSearch && matchesStatus;
      });
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useVisitorMutations() {
  const queryClient = useQueryClient();
  const {
    approveVisitor,
    rejectVisitor,
    checkInVisitor,
    checkOutVisitor,
    registerVisitor,
  } = useDemo();

  const approveMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      approveVisitor(id, reason);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      rejectVisitor(id, reason);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async (id: string) => {
      checkInVisitor(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (id: string) => {
      checkOutVisitor(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Partial<VisitorRequest>) => {
      registerVisitor(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });

  return {
    approveMutation,
    rejectMutation,
    checkInMutation,
    checkOutMutation,
    registerMutation,
  };
}
