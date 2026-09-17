export type Role = "ADMIN" | "ANALYST" | "VIEWER";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  workspaceName?: string;
}

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  workspaceName: string;
  iat?: number;
  exp?: number;
}

export interface FeedbackFilter {
  search?: string;
  sentiment?: string;
  status?: string;
  channel?: string;
}

export interface CreateFeedbackInput {
  content: string;
  channel?: string;
  sourceRef?: string;
  customerLabel?: string;
  sentiment?: string;
  sentimentScore?: number;
  status?: string;
}

export interface UpdateFeedbackInput {
  content?: string;
  channel?: string;
  sourceRef?: string;
  customerLabel?: string;
  sentiment?: string;
  sentimentScore?: number;
  status?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}
