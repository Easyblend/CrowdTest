import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { auth_id: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

const logs = await prisma.auditLog.findMany({
  where: dbUser.role === "ADMIN"
    ? {}
    : {
        OR: [
          { actorId: dbUser.id },
          { ownerId: dbUser.id },
        ],
      },
  orderBy: { createdAt: "desc" },
  take: 50,
});

const enriched = logs.map((log) => ({
  id: log.id,

  actorId: log.actorId,
  actorSnapshot: log.actorSnapshot,

  ownerId: log.ownerId,
  ownerSnapshot: log.ownerSnapshot,

  projectId: log.projectId,

  action: log.action,
  entityType: log.entityType,
  entityId: log.entityId,
  metadata: log.metadata,

  ipAddress: log.ipAddress,
  userAgent: log.userAgent,

  createdAt: log.createdAt.toISOString(), // 🔥 important fix

  actorDisplay:
    (log.actorSnapshot as any)?.name ||
    (log.actorSnapshot as any)?.email ||
    log.actorId,

  ownerDisplay:
    (log.ownerSnapshot as any)?.name ||
    log.ownerId,
}));

return NextResponse.json(enriched);
}