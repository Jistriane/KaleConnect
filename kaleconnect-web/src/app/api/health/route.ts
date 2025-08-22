import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "kaleconnect-web", time: new Date().toISOString() });
}
