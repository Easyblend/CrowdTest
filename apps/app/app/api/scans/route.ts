import { NextRequest, NextResponse } from "next/server";
import { scanWebsite } from "@/lib/scanner/scanner";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          error: "A valid URL is required.",
        },
        {
          status: 400,
        }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid URL.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(`🔍 Scan requested for ${url}`);

    const result = await scanWebsite(url);

    return NextResponse.json({
      success: true,
      url,
      ...result,
    });
  } catch (error) {
    console.error("Scanner error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Scanner failed.",
      },
      {
        status: 500,
      }
    );
  }
}