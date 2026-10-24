import { Finding } from "./finding";

export type ResourceType =
  | "document"
  | "script"
  | "stylesheet"
  | "image"
  | "font"
  | "xhr"
  | "fetch"
  | "media"
  | "manifest"
  | "other";

interface ClassifyResponseInput {
  status: number;
  resourceType: ResourceType;
  isTargetPage: boolean;
}

export function classifyResponse({
  status,
  resourceType,
  isTargetPage,
}: ClassifyResponseInput): Pick<
  Finding,
  "category" | "severity" | "confidence"
> {
  if (isTargetPage) {
    return {
      category: "network",
      severity: status >= 500 ? "critical" : "high",
      confidence: "high",
    };
  }

  if (
    resourceType === "xhr" ||
    resourceType === "fetch"
  ) {
    return {
      category: "network",
      severity: status >= 500 ? "high" : "medium",
      confidence: "high",
    };
  }

  if (resourceType === "script") {
    return {
      category: "broken_resource",
      severity: "high",
      confidence: "high",
    };
  }

  if (resourceType === "stylesheet") {
    return {
      category: "broken_resource",
      severity: "medium",
      confidence: "high",
    };
  }

  if (resourceType === "image") {
    return {
      category: "broken_resource",
      severity: "low",
      confidence: "high",
    };
  }

  if (resourceType === "font") {
    return {
      category: "broken_resource",
      severity: "low",
      confidence: "high",
    };
  }

  if (status >= 500) {
    return {
      category: "network",
      severity: "high",
      confidence: "high",
    };
  }

  return {
    category: "network",
    severity: "medium",
    confidence: "high",
  };
}

export function classifyJavaScriptError(): Pick<
  Finding,
  "category" | "severity" | "confidence"
> {
  return {
    category: "javascript",
    severity: "high",
    confidence: "high",
  };
}

export function classifyBrokenLink(
  status: number
): Pick<
  Finding,
  "category" | "severity" | "confidence"
> | null {
  // Authentication is not proof that a link is broken.
  if (status === 401) {
    return null;
  }

  // Forbidden resources may be intentionally protected.
  if (status === 403) {
    return null;
  }

  // Rate limiting is not a broken link.
  if (status === 429) {
    return null;
  }

  if (status >= 500) {
    return {
      category: "broken_link",
      severity: "high",
      confidence: "high",
    };
  }

  if (status >= 400) {
    return {
      category: "broken_link",
      severity: "medium",
      confidence: "high",
    };
  }

  return null;
}