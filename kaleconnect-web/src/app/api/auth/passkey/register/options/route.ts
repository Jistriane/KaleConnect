import { NextRequest, NextResponse } from "next/server";
import { registrationOptions } from "@/lib/webauthn";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || "user@example.com";
  const options = await registrationOptions(username);
  return NextResponse.json(options);
}
