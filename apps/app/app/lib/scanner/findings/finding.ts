export type FindingCategory =
  | "javascript"
  | "network"
  | "broken_link"
  | "broken_resource";

export type FindingSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type FindingConfidence =
  | "high"
  | "medium"
  | "low";

export interface Finding {
  category: FindingCategory;
  severity: FindingSeverity;
  confidence: FindingConfidence;

  url: string;
  description: string;

  evidence: {
    selector?: string;
    request?: string;
    statusCode?: number;
    error?: string;
    stack?: string;
  };
}