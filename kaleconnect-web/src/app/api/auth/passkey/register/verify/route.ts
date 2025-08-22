import { NextRequest, NextResponse } from "next/server";
import { verifyRegistration } from "@/lib/webauthn";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username = "user@example.com", attResp } = body || {};
  const verification = await verifyRegistration(username, attResp);
  return NextResponse.json(verification);
}
