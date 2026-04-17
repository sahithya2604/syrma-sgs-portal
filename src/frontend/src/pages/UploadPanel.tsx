import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useAnalyzeFile, useGetCustomers } from "../hooks/useQueries";
import type { CustomerRecord } from "../types";

type UploadStep =
  | "source"
  | "customer"
  | "file"
  | "processing"
  | "done"
  | "error";
type SourceType = "client" | "vendor";

function StepIndicator({
  step,
  current,
  label,
}: {
  step: number;
  current: number;
  label: string;
}) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-semibold shrink-0",
          done
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary/20 text-primary border border-primary"
              : "bg-muted text-muted-foreground",
        )}
      >
        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
      </div>
      <span
        className={cn(
          "text-xs font-body",
          active ? "text-foreground font-medium" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function SourceStep({
  onSelect,
}: {
  onSelect: (source: SourceType) => void;
}) {
  return (
    <div className="space-y-4" data-ocid="upload.source_step">
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-1">
          Choose Upload Type
        </h3>
        <p className="text-xs text-muted-foreground font-body">
          Select whether this document belongs to a client or vendor.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect("client")}
          data-ocid="upload.select_client_button"
          className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-smooth group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-display font-semibold text-foreground">
              Client
            </p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Client documents
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onSelect("vendor")}
          data-ocid="upload.select_vendor_button"
          className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-smooth group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-display font-semibold text-foreground">
              Vendor
            </p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Vendor documents
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function CustomerStep({
  source,
  customers,
  isLoading,
  onSelect,
  onBack,
}: {
  source: SourceType;
  customers: CustomerRecord[];
  isLoading: boolean;
  onSelect: (customer: CustomerRecord) => void;
  onBack: () => void;
}) {
  const label = source === "client" ? "Client" : "Vendor";

  return (
    <div className="space-y-4" data-ocid="upload.customer_step">
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-1">
          Select {label} Customer
        </h3>
        <p className="text-xs text-muted-foreground font-body">
          Choose which customer this document belongs to.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 py-8 text-center"
          data-ocid="upload.no_customers_state"
        >
          <User className="w-8 h-8 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="text-sm font-display font-medium text-foreground">
              No {label} customers found
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Add customers in the {label} panel first, then come back to
              upload.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="space-y-1.5 max-h-60 overflow-y-auto"
          data-ocid="upload.customer_list"
        >
          {customers.map((customer, index) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => onSelect(customer)}
              data-ocid={`upload.customer.item.${index + 1}`}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-smooth text-left"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                {source === "client" ? (
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <span className="text-sm font-body text-foreground truncate flex-1 min-w-0">
                {customer.name}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onBack}
        className="font-body text-xs"
        data-ocid="upload.back_to_source_button"
      >
        ← Back
      </Button>
    </div>
  );
}

function FileStep({
  source,
  customerName,
  onFileSelected,
  onBack,
}: {
  source: SourceType;
  customerName: string;
  onFileSelected: (file: File) => void;
  onBack: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
      e.target.value = "";
    },
    [onFileSelected],
  );

  const sourceLabel = source === "client" ? "Client" : "Vendor";

  return (
    <div className="space-y-4" data-ocid="upload.file_step">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-semibold text-sm text-foreground">
            Upload Document
          </h3>
          <Badge variant="secondary" className="text-xs font-body">
            {sourceLabel}: {customerName}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-body">
          Select or drag a file to upload for this customer.
        </p>
      </div>

      <button
        type="button"
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Drop zone for file upload"
        data-ocid="upload.dropzone"
        className={cn(
          "w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-smooth",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary hover:bg-muted/30",
        )}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-display font-medium text-foreground">
            Click or drag file here
          </p>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            PDF, DOCX, TXT, CSV and more
          </p>
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.pptx"
        onChange={handleFileChange}
        data-ocid="upload.file_input"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onBack}
        className="font-body text-xs"
        data-ocid="upload.back_to_customer_button"
      >
        ← Back
      </Button>
    </div>
  );
}

function ProcessingStep({
  filename,
  progress,
  status,
}: {
  filename: string;
  progress: number;
  status: string;
}) {
  return (
    <div className="space-y-4" data-ocid="upload.processing_step">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
        <FileText className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-medium text-foreground truncate">
            {filename}
          </p>
          <p className="text-xs text-muted-foreground font-body">
            {status === "uploading"
              ? "Uploading document…"
              : "Analysing with AI…"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-body">Processing…</span>
        <span className="font-medium text-foreground">{progress}%</span>
      </div>
      <Progress
        value={progress}
        className="h-1.5"
        data-ocid="upload.progress"
      />
    </div>
  );
}

function DoneStep({
  filename,
  customerName,
  onUploadAnother,
}: {
  filename: string;
  customerName: string;
  onUploadAnother: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-4 text-center"
      data-ocid="upload.success_state"
    >
      <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-green-600" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-base text-foreground">
          Document Analysed
        </h3>
        <p className="text-xs text-muted-foreground font-body max-w-xs">
          <span className="text-foreground font-medium">{filename}</span> has
          been processed and linked to{" "}
          <span className="text-foreground font-medium">{customerName}</span>.
        </p>
      </div>
      <p className="text-xs text-muted-foreground font-body">
        View it in the Dashboard by searching for that customer.
      </p>
      <Button
        type="button"
        size="sm"
        className="gap-2 font-display"
        onClick={onUploadAnother}
        data-ocid="upload.upload_another_button"
      >
        <Upload className="w-3.5 h-3.5" />
        Upload Another
      </Button>
    </div>
  );
}

function ErrorStep({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
      data-ocid="upload.error_state"
    >
      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm text-destructive font-body">{error}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onRetry}
          data-ocid="upload.retry_button"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function UploadPanel() {
  const [step, setStep] = useState<UploadStep>("source");
  const [source, setSource] = useState<SourceType>("client");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"uploading" | "processing">(
    "uploading",
  );
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const { data: customers = [], isLoading: loadingCustomers } =
    useGetCustomers(source);
  const { mutateAsync: analyzeFile } = useAnalyzeFile();

  const currentStep =
    step === "source"
      ? 1
      : step === "customer"
        ? 2
        : step === "file" ||
            step === "processing" ||
            step === "done" ||
            step === "error"
          ? 3
          : 1;

  const handleSourceSelect = (s: SourceType) => {
    setSource(s);
    setStep("customer");
  };

  const handleCustomerSelect = (customer: CustomerRecord) => {
    setSelectedCustomer(customer);
    setStep("file");
  };

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!selectedCustomer) return;
      setUploadedFile(file.name);
      setStep("processing");
      setUploadProgress(10);
      setUploadStatus("uploading");
      setUploadError("");

      try {
        const arrayBuffer = await file.arrayBuffer();
        const content = new Uint8Array(arrayBuffer);

        setUploadProgress(40);
        setUploadStatus("uploading");
        setUploadProgress(60);
        setUploadStatus("processing");

        await analyzeFile({
          source,
          customName: file.name,
          filename: file.name,
          content,
          customerName: selectedCustomer.name,
        });

        setUploadProgress(100);
        setStep("done");

        toast.success("Document analysed", {
          description: `"${file.name}" has been processed for ${selectedCustomer.name}.`,
          duration: 4000,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to process file.";
        setUploadError(message);
        setStep("error");
      }
    },
    [selectedCustomer, source, analyzeFile],
  );

  const handleReset = () => {
    setStep("source");
    setSelectedCustomer(null);
    setUploadProgress(0);
    setUploadedFile("");
    setUploadError("");
  };

  return (
    <div className="flex h-full" data-ocid="upload.panel">
      {/* Left info panel */}
      <div className="w-64 shrink-0 border-r border-border bg-muted/20 flex flex-col p-5 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-4 h-4 text-primary shrink-0" />
            <h2 className="font-display font-semibold text-sm text-foreground">
              Upload Document
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <StepIndicator step={1} current={currentStep} label="Choose type" />
            <StepIndicator
              step={2}
              current={currentStep}
              label="Select customer"
            />
            <StepIndicator step={3} current={currentStep} label="Upload file" />
          </div>
        </div>

        {selectedCustomer && (
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Selected
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                {source === "client" ? (
                  <Building2 className="w-3 h-3 text-primary" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-primary" />
                )}
              </div>
              <span className="text-xs font-body text-foreground font-medium truncate">
                {selectedCustomer.name}
              </span>
            </div>
            <Badge
              variant="outline"
              className="mt-2 text-[10px] font-body capitalize"
            >
              {source}
            </Badge>
          </div>
        )}
      </div>

      {/* Right upload area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {step === "source" && <SourceStep onSelect={handleSourceSelect} />}

          {step === "customer" && (
            <CustomerStep
              source={source}
              customers={customers}
              isLoading={loadingCustomers}
              onSelect={handleCustomerSelect}
              onBack={() => setStep("source")}
            />
          )}

          {step === "file" && selectedCustomer && (
            <FileStep
              source={source}
              customerName={selectedCustomer.name}
              onFileSelected={handleFileSelected}
              onBack={() => setStep("customer")}
            />
          )}

          {step === "processing" && (
            <ProcessingStep
              filename={uploadedFile}
              progress={uploadProgress}
              status={uploadStatus}
            />
          )}

          {step === "done" && selectedCustomer && (
            <DoneStep
              filename={uploadedFile}
              customerName={selectedCustomer.name}
              onUploadAnother={handleReset}
            />
          )}

          {step === "error" && (
            <ErrorStep error={uploadError} onRetry={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
}
