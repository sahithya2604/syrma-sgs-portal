import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type RegisterResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CustomerRecord {
    id: string;
    source: string;
    name: string;
    timestamp: Timestamp;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface SummaryRecord {
    id: bigint;
    customerName: string;
    source: string;
    filename: string;
    summary: string;
    timestamp: Timestamp;
    customName: string;
}
export type LoginResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type SaveCustomerResult = {
    __kind__: "ok";
    ok: CustomerRecord;
} | {
    __kind__: "err";
    err: string;
};
export interface http_header {
    value: string;
    name: string;
}
export type UploadResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzeFile(filename: string, content: Uint8Array, source: string, customName: string, customerName: string): Promise<UploadResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllCustomers(): Promise<Array<CustomerRecord>>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomers(source: string): Promise<Array<CustomerRecord>>;
    getSummaries(): Promise<Array<SummaryRecord>>;
    getSummariesByCustomer(customerName: string): Promise<Array<SummaryRecord>>;
    getSummariesBySource(source: string): Promise<Array<SummaryRecord>>;
    isCallerAdmin(): Promise<boolean>;
    login(username: string, password: string): Promise<LoginResult>;
    register(username: string, password: string): Promise<RegisterResult>;
    saveCustomer(name: string, source: string): Promise<SaveCustomerResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    usernameExists(username: string): Promise<boolean>;
}
