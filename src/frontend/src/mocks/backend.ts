import type { backendInterface, UserRole } from "../backend";

export const mockBackend: backendInterface = {
  analyzeFile: async (filename: string, _content: Uint8Array, _source: string, _customName: string, _customerName: string) => ({
    __kind__: "ok" as const,
    ok: `AI Summary for "${filename}"\n\n**Key Insights:**\n- Contract Value: $50,000\n- Renewal Date: 2025-06-01\n- Termination Clause: 30 days notice\n- Document Type: Legal Agreement\n\nThis document outlines a service agreement between the parties. Key terms include payment schedules, deliverable milestones, and liability clauses. The agreement is valid for 12 months with automatic renewal unless terminated with 30 days written notice.`,
  }),
  getSummaries: async () => [
    {
      id: BigInt(1),
      filename: "Project Alpha Agreement.pdf",
      customName: "Project Alpha Agreement",
      customerName: "Acme Corp",
      source: "client",
      summary:
        "Legal agreement covering contract value of $50,000 with a renewal date of 2025-06-01. Includes termination clause of 30 days notice and covers deliverables, payment schedules, and liability.",
      timestamp: BigInt(Date.now() * 1_000_000),
    },
    {
      id: BigInt(2),
      filename: "Marketing Strategy Q4.docx",
      customName: "Marketing Strategy Q4",
      customerName: "Beta Supplies",
      source: "vendor",
      summary:
        "Q4 marketing strategy document outlining campaign goals, budget allocation of $15,000, target demographics, and KPIs. Includes digital channels, social media plan, and ROI projections.",
      timestamp: BigInt((Date.now() - 3600000) * 1_000_000),
    },
  ],
  getSummariesBySource: async (source: string) => [
    {
      id: BigInt(1),
      filename: "Project Alpha Agreement.pdf",
      customName: "Project Alpha Agreement",
      customerName: "Acme Corp",
      source,
      summary:
        "Legal agreement covering contract value of $50,000 with a renewal date of 2025-06-01. Includes termination clause of 30 days notice and covers deliverables, payment schedules, and liability.",
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  ],
  getSummariesByCustomer: async (customerName: string) => [
    {
      id: BigInt(1),
      filename: "Project Alpha Agreement.pdf",
      customName: "Project Alpha Agreement",
      customerName,
      source: "client",
      summary:
        "Legal agreement covering contract value of $50,000 with a renewal date of 2025-06-01.",
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  ],
  getCustomers: async (source: string) => [
    {
      id: "1",
      name: "Acme Corp",
      source,
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  ],
  getAllCustomers: async () => [
    {
      id: "1",
      name: "Acme Corp",
      source: "client",
      timestamp: BigInt(Date.now() * 1_000_000),
    },
    {
      id: "2",
      name: "Beta Supplies",
      source: "vendor",
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  ],
  saveCustomer: async (_name: string, _source: string) => ({
    __kind__: "ok" as const,
    ok: {
      id: "new",
      name: _name,
      source: _source,
      timestamp: BigInt(Date.now() * 1_000_000),
    },
  }),
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
  // Authorization extension stubs
  _initializeAccessControl: async () => {},
  assignCallerUserRole: async (_user, _role: UserRole) => {},
  getCallerUserRole: async () => "user" as unknown as UserRole,
  isCallerAdmin: async () => false,
  login: async (_username: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  register: async (_username: string, _password: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  usernameExists: async (_username: string) => false,
};
