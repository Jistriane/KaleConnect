import { NextRequest, NextResponse } from "next/server";
import { verifyAuthentication } from "@/lib/webauthn";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username = "user@example.com", authResp } = body || {};
  const verification = await verifyAuthentication(username, authResp);
  return NextResponse.json(verification);
}
