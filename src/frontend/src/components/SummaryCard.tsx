import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, Lightbulb } from "lucide-react";

interface SummaryRecordDisplay {
  id: bigint;
  filename: string;
  customName: string;
  summary: string;
  timestamp: bigint;
  source: string;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface SummaryCardProps {
  record: SummaryRecordDisplay;
  isActive: boolean;
  onClick: () => void;
  index: number;
  ocidPrefix?: string;
}

export function SummaryCard({
  record,
  isActive,
  onClick,
  index,
  ocidPrefix = "panel",
}: SummaryCardProps) {
  const displayName = record.customName || record.filename;
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`${ocidPrefix}.summary_list.item.${index}`}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-smooth flex items-start gap-3",
        isActive
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card hover:border-primary/20 hover:bg-muted/30",
      )}
    >
      <div
        className={cn(
          "mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0",
          isActive ? "bg-primary/15" : "bg-muted",
        )}
      >
        <FileText
          className={cn(
            "w-4 h-4",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-medium text-foreground truncate">
          {displayName}
        </p>
        {record.customName && record.customName !== record.filename && (
          <p className="text-xs text-muted-foreground/70 truncate">
            {record.filename}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimestamp(record.timestamp)}
        </p>
      </div>
      <ChevronRight
        className={cn(
          "w-4 h-4 shrink-0 mt-1 transition-smooth",
          isActive ? "text-primary" : "text-muted-foreground/40",
        )}
      />
    </button>
  );
}

interface SummaryDetailProps {
  record: SummaryRecordDisplay;
}

function renderSummaryLine(line: string, i: number) {
  const key = `line-${i}`;
  if (!line.trim()) return <div key={key} className="h-1" />;

  if (line.startsWith("**") && line.endsWith("**")) {
    return (
      <p
        key={key}
        className="font-display font-semibold text-foreground mt-3 first:mt-0"
      >
        {line.replace(/\*\*/g, "")}
      </p>
    );
  }

  if (line.startsWith("- ")) {
    const parts = line.slice(2).split(/(\*\*[^*]+\*\*)/);
    return (
      <div key={key} className="flex items-start gap-2">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <p className="flex-1 min-w-0">
          {parts.map((p, j) => {
            const pk = `${key}-p-${j}`;
            return p.startsWith("**") ? (
              <strong key={pk} className="font-semibold text-accent-foreground">
                {p.replace(/\*\*/g, "")}
              </strong>
            ) : (
              <span key={pk}>{p}</span>
            );
          })}
        </p>
      </div>
    );
  }

  const parts = line.split(/(\*\*[^*]+\*\*)/);
  return (
    <p key={key} className="text-muted-foreground">
      {parts.map((p, j) => {
        const pk = `${key}-p-${j}`;
        return p.startsWith("**") ? (
          <strong key={pk} className="font-semibold text-foreground">
            {p.replace(/\*\*/g, "")}
          </strong>
        ) : (
          <span key={pk}>{p}</span>
        );
      })}
    </p>
  );
}

export function SummaryDetail({ record }: SummaryDetailProps) {
  const lines = record.summary.split("\n");
  const ts = Number(record.timestamp / BigInt(1_000_000));
  const dateStr = new Date(ts).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayName = record.customName || record.filename;

  return (
    <div className="h-full flex flex-col" data-ocid="summary.detail">
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-base text-foreground truncate">
              {displayName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {record.customName && record.customName !== record.filename && (
                <span className="text-xs text-muted-foreground">
                  Original file:{" "}
                  <span className="text-foreground font-medium">
                    {record.filename}
                  </span>
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                Uploaded:{" "}
                <span className="text-foreground font-medium">{dateStr}</span>
              </span>
            </div>
          </div>
          <Badge className="shrink-0 bg-accent/20 text-accent-foreground border-accent/30 text-xs font-display">
            AI Analysed
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Card className="p-5 border-border bg-card shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-accent-foreground" />
            </div>
            <h3 className="font-display font-semibold text-sm text-foreground">
              Key Insights
            </h3>
          </div>
          <div className="space-y-2 font-body text-sm text-foreground leading-relaxed">
            {lines.map((line, i) => renderSummaryLine(line, i))}
          </div>
        </Card>

        <p className="mt-4 text-xs text-muted-foreground font-body leading-relaxed px-1">
          AI-generated summary — information extracted from document content.
          Non-verbatim interpretation for reference purposes only.
        </p>
      </div>
    </div>
  );
}
