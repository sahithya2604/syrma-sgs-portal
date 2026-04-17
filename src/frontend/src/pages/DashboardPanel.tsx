import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, Search, User } from "lucide-react";
import { useState } from "react";
import { SummaryCard, SummaryDetail } from "../components/SummaryCard";
import {
  useGetSummaries,
  useGetSummariesByCustomer,
} from "../hooks/useQueries";

function LoadingSkeleton() {
  return (
    <div className="space-y-3 p-4" data-ocid="dashboard.loading_state">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="w-8 h-8 rounded-md shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyDocuments() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4"
      data-ocid="dashboard.empty_state"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="font-display font-semibold text-sm text-foreground">
          No documents uploaded yet
        </h3>
        <p className="text-xs text-muted-foreground font-body leading-relaxed">
          Upload documents via the Upload panel. They'll appear here for
          searching and review.
        </p>
      </div>
    </div>
  );
}

function NoSearchResults({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3"
      data-ocid="dashboard.search_empty_state"
    >
      <User className="w-6 h-6 text-muted-foreground/40" />
      <p className="text-xs text-muted-foreground font-body">
        No documents found for customer{" "}
        <span className="text-foreground font-medium">"{query}"</span>
      </p>
    </div>
  );
}

export function DashboardPanel() {
  const [search, setSearch] = useState("");
  const [activeSummaryId, setActiveSummaryId] = useState<number | null>(null);
  const [committedSearch, setCommittedSearch] = useState("");

  const { data: allSummaries = [], isLoading: loadingAll } = useGetSummaries();
  const { data: customerSummaries = [], isLoading: loadingCustomer } =
    useGetSummariesByCustomer(committedSearch);

  const isSearchActive = committedSearch.trim().length > 0;
  const displayedSummaries = isSearchActive ? customerSummaries : allSummaries;
  const isLoading = isSearchActive ? loadingCustomer : loadingAll;

  const activeSummary =
    displayedSummaries.find((s) => Number(s.id) === activeSummaryId) ??
    (displayedSummaries.length > 0 ? displayedSummaries[0] : null);

  const handleSearchCommit = () => {
    setCommittedSearch(search.trim());
    setActiveSummaryId(null);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchCommit();
    if (e.key === "Escape") {
      setSearch("");
      setCommittedSearch("");
      setActiveSummaryId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setCommittedSearch("");
      setActiveSummaryId(null);
    }
  };

  return (
    <div className="flex h-full" data-ocid="dashboard.panel">
      {/* Left search + results panel */}
      <div className="w-80 shrink-0 border-r border-border bg-muted/20 flex flex-col">
        {/* Search header */}
        <div className="px-4 pt-4 pb-3 border-b border-border space-y-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
            <h2 className="font-display font-semibold text-sm text-foreground">
              Document Search
            </h2>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search by customer name…"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="pl-8 h-9 text-xs font-body bg-background"
                data-ocid="dashboard.search_input"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleSearchCommit}
              className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-display font-medium hover:bg-primary/90 transition-smooth shrink-0"
              data-ocid="dashboard.search_button"
            >
              Search
            </button>
          </div>
          {!isLoading && (
            <p className="text-[11px] text-muted-foreground font-body">
              {isSearchActive
                ? `${displayedSummaries.length} result${displayedSummaries.length !== 1 ? "s" : ""} for "${committedSearch}"`
                : `${allSummaries.length} document${allSummaries.length !== 1 ? "s" : ""} total`}
            </p>
          )}
        </div>

        {/* Results list */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : !isSearchActive && allSummaries.length === 0 ? (
          <EmptyDocuments />
        ) : isSearchActive && customerSummaries.length === 0 ? (
          <NoSearchResults query={committedSearch} />
        ) : (
          <div
            className="flex-1 overflow-y-auto p-3 space-y-1.5"
            data-ocid="dashboard.results_list"
          >
            {displayedSummaries.map((record, index) => (
              <SummaryCard
                key={String(record.id)}
                record={record}
                index={index + 1}
                ocidPrefix="dashboard"
                isActive={activeSummary?.id === record.id}
                onClick={() => setActiveSummaryId(Number(record.id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right detail area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div
            className="flex items-center justify-center h-full"
            data-ocid="dashboard.content_loading_state"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-body text-muted-foreground">
                Loading documents…
              </p>
            </div>
          </div>
        ) : activeSummary ? (
          <SummaryDetail record={activeSummary} />
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-4 text-center px-8"
            data-ocid="dashboard.select_prompt"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-display font-medium text-foreground">
                Search by customer name
              </p>
              <p className="text-xs text-muted-foreground font-body max-w-xs">
                Enter a customer name and press Search or Enter to find all
                documents linked to that customer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
