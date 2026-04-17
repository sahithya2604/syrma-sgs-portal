import { create } from "zustand";
import type {
  CustomerRecord,
  PanelType,
  SummaryRecord,
  UploadState,
} from "./types";

interface AppStore {
  selectedPanel: PanelType;
  setSelectedPanel: (panel: PanelType) => void;

  summaries: SummaryRecord[];
  addSummary: (record: SummaryRecord) => void;
  clearSummaries: () => void;

  customers: CustomerRecord[];
  setCustomers: (customers: CustomerRecord[]) => void;

  uploadState: UploadState;
  setUploadState: (state: Partial<UploadState>) => void;
  resetUpload: () => void;

  activeSummaryId: number | null;
  setActiveSummaryId: (id: number | null) => void;
}

const defaultUpload: UploadState = {
  status: "idle",
  progress: 0,
  filename: null,
  customName: null,
  error: null,
};

export const useAppStore = create<AppStore>((set) => ({
  selectedPanel: "dashboard",
  setSelectedPanel: (panel) => set({ selectedPanel: panel }),

  summaries: [],
  addSummary: (record) => set((s) => ({ summaries: [record, ...s.summaries] })),
  clearSummaries: () => set({ summaries: [] }),

  customers: [],
  setCustomers: (customers) => set({ customers }),

  uploadState: defaultUpload,
  setUploadState: (partial) =>
    set((s) => ({ uploadState: { ...s.uploadState, ...partial } })),
  resetUpload: () => set({ uploadState: defaultUpload }),

  activeSummaryId: null,
  setActiveSummaryId: (id) => set({ activeSummaryId: id }),
}));
