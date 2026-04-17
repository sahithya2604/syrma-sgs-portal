export interface SummaryRecord {
  id: bigint;
  filename: string;
  customName: string;
  customerName: string;
  summary: string;
  timestamp: bigint;
  source: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  source: string;
  timestamp: bigint;
}

export type PanelType = "client" | "vendor" | "dashboard" | "upload";

export type UploadStatus =
  | "idle"
  | "naming"
  | "uploading"
  | "processing"
  | "done"
  | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number;
  filename: string | null;
  customName: string | null;
  error: string | null;
}
