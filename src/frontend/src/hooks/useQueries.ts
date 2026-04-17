import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { SummaryRecord } from "../backend.d";

// Map backend SummaryRecord to our extended frontend type
function mapRecord(r: SummaryRecord) {
  return {
    ...r,
    customName: r.customName ?? r.filename,
    customerName: r.customerName ?? "",
    source: r.source ?? "unknown",
  };
}

export function useGetSummaries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["summaries"],
    queryFn: async () => {
      if (!actor) return [];
      const records = await actor.getSummaries();
      return records.map(mapRecord);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSummariesBySource(source: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["summaries", "source", source],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.getSummariesBySource(source);
      return all.map(mapRecord);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSummariesByCustomer(customerName: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["summaries", "customer", customerName],
    queryFn: async () => {
      if (!actor || !customerName.trim()) return [];
      const records = await actor.getSummariesByCustomer(customerName);
      return records.map(mapRecord);
    },
    enabled: !!actor && !isFetching && !!customerName.trim(),
  });
}

export function useGetCustomers(source: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["customers", source],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomers(source);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCustomers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["customers", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCustomer() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, source }: { name: string; source: string }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const result = await actor.saveCustomer(name, source);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.source],
      });
      queryClient.invalidateQueries({ queryKey: ["customers", "all"] });
      toast.success("Customer saved", {
        description: `"${variables.name}" has been added.`,
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to save customer", {
        description: error.message ?? "An unexpected error occurred.",
        duration: 5000,
      });
    },
  });
}

export function useAnalyzeFile() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      source,
      customName,
      filename,
      content,
      customerName,
    }: {
      source: string;
      customName: string;
      filename: string;
      content: Uint8Array;
      customerName: string;
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const result = await actor.analyzeFile(
        filename,
        content,
        source,
        customName,
        customerName,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["summaries"] });
      queryClient.invalidateQueries({
        queryKey: ["summaries", "customer", variables.customerName],
      });
    },
    onError: (error: Error) => {
      toast.error("Analysis failed", {
        description: error.message ?? "An unexpected error occurred.",
        duration: 5000,
      });
    },
  });
}
