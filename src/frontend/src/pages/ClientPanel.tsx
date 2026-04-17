import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, FileText, Users } from "lucide-react";
import { useState } from "react";
import {
  useGetCustomers,
  useGetSummariesBySource,
  useSaveCustomer,
} from "../hooks/useQueries";

function LoadingSkeleton() {
  return (
    <div className="space-y-3 p-4" data-ocid="client.loading_state">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton className="w-8 h-8 rounded-md shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClientPanel() {
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState("");

  const { data: customers = [], isLoading: loadingCustomers } =
    useGetCustomers("client");
  const { data: summaries = [] } = useGetSummariesBySource("client");
  const { mutate: saveCustomer, isPending: isSaving } = useSaveCustomer();

  const handleSave = () => {
    if (!customerName.trim()) {
      setNameError("Please enter a customer name.");
      return;
    }
    const exists = customers.some(
      (c) => c.name.toLowerCase() === customerName.trim().toLowerCase(),
    );
    if (exists) {
      setNameError("This customer name already exists.");
      return;
    }
    setNameError("");
    saveCustomer(
      { name: customerName.trim(), source: "client" },
      { onSuccess: () => setCustomerName("") },
    );
  };

  return (
    <div className="flex h-full" data-ocid="client.panel">
      {/* Left panel */}
      <div className="w-80 shrink-0 border-r border-border bg-muted/20 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <h2 className="font-display font-semibold text-sm text-foreground flex-1 min-w-0 truncate">
              Client Management
            </h2>
            {!loadingCustomers && customers.length > 0 && (
              <Badge variant="secondary" className="text-xs font-body shrink-0">
                {customers.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Add Customer Form */}
        <div className="px-4 py-4 border-b border-border space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="client-customer-name"
              className="text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Add Customer
            </Label>
            <Input
              id="client-customer-name"
              type="text"
              placeholder="Enter customer name…"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className="h-9 text-sm font-body"
              data-ocid="client.customer_name_input"
            />
            {nameError && (
              <p
                className="text-xs text-destructive font-body"
                data-ocid="client.name_field_error"
              >
                {nameError}
              </p>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            className="w-full gap-2 font-display text-xs"
            onClick={handleSave}
            disabled={isSaving || !customerName.trim()}
            data-ocid="client.save_customer_button"
          >
            {isSaving ? "Saving…" : "Save Customer"}
          </Button>
        </div>

        {/* Customer List */}
        <div className="px-4 pt-3 pb-1.5 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-[11px] font-display font-semibold uppercase tracking-widest text-muted-foreground">
            Saved Customers
          </span>
        </div>

        {loadingCustomers ? (
          <LoadingSkeleton />
        ) : (
          <div
            className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5"
            data-ocid="client.customer_list"
          >
            {customers.length === 0 ? (
              <div
                className="py-8 flex flex-col items-center gap-2 text-center px-2"
                data-ocid="client.empty_state"
              >
                <Users className="w-6 h-6 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground font-body">
                  No customers saved yet
                </p>
              </div>
            ) : (
              customers.map((customer, index) => {
                const docCount = summaries.filter(
                  (s) => s.customerName === customer.name,
                ).length;
                return (
                  <div
                    key={customer.id}
                    data-ocid={`client.customer.item.${index + 1}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-medium text-foreground truncate">
                        {customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {docCount} document{docCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Right info pane */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center bg-background">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="w-7 h-7 text-muted-foreground" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="font-display font-semibold text-base text-foreground">
            Manage Client Customers
          </h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Save customer names here. Then use the{" "}
            <strong className="text-foreground">Upload</strong> panel to attach
            documents to a specific customer.
          </p>
        </div>
      </div>
    </div>
  );
}
