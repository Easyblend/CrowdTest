import { supabase } from "./supabaseClient";

export async function logAudit({
    actorId,
    ownerId,
    projectId,

    actorSnapshot,
    ownerSnapshot,   // project owner

    action,
    entityType,
    entityId,

    metadata = {},
    req,
}: {
    actorId?: string;
    ownerId?: string;
    projectId?: string;
    actorSnapshot?: any;   // can be user object or null
    ownerSnapshot?: any;   // can be user object or null
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
    req?: any;
}) {
    const ipAddress =
        req?.headers?.get("x-forwarded-for")?.split(",")[0] ||
        req?.headers?.get("x-real-ip") ||
        "unknown";

    const userAgent =
        req?.headers?.get("user-agent") || "unknown";

    const { error } = await supabase.from("AuditLog").insert({
        actorId,
        ownerId,
        projectId,

        actorSnapshot,
        ownerSnapshot,   // project owner
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