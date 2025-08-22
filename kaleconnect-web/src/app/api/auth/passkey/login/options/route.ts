import { NextRequest, NextResponse } from "next/server";
import { authenticationOptions } from "@/lib/webauthn";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || "user@example.com";
  const options = await authenticationOptions(username);
  return NextResponse.json(options);
}
