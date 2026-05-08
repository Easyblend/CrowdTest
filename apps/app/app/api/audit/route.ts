import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer();

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

  return NextResponse.json(logs);
}