import { supabase } from "./supabaseClient";

export async function logAudit({
    userId,
    action,
    entityType,
    entityId,
    metadata = {},
    req, // Optional: Pass the request object to capture IP and user agent
}: {
    userId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
    req?: any;
}) {

    const ipAddress =
        req?.headers.get("x-forwarded-for")?.split(",")[0] ||
        req?.headers.get("x-real-ip") ||
        "unknown";

    const userAgent =
        req?.headers.get("user-agent") || "unknown";

    const { error } = await supabase.from("AuditLog").insert({
        userId,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress,
        userAgent,
    });

    if (error) {
        console.error("Audit log failed:", error);
    }
}