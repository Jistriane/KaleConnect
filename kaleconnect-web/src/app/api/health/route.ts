import { NextResponse } from "next/server";
import { getHealthMetrics, backendLogger, createRequestTracker } from "@/lib/monitoring";

export async function GET() {
  const tracker = createRequestTracker('/api/health', 'GET');
  
  try {
    backendLogger.info('health-check', 'Health check requested');
    
    const healthMetrics = getHealthMetrics();
    const systemInfo = {
      status: "ok",
      service: "kaleconnect-backend",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      network: {
        stellar: "testnet",
        soroban_rpc: process.env.NEXT_PUBLIC_SOROBAN_RPC,
        horizon: process.env.NEXT_PUBLIC_HORIZON_URL
      },
      features: {
        webauthn: true,
        kyc: true,
        remittances: true,
        elisa_chat: true,
        audit_logs: true,
        rate_limiting: true
      },
      contracts: {
        kyc: process.env.NEXT_PUBLIC_CONTRACT_ID_KYC ? "configured" : "missing",
        rates: process.env.NEXT_PUBLIC_CONTRACT_ID_RATES ? "configured" : "missing",
        remittance: process.env.NEXT_PUBLIC_CONTRACT_ID_REMITTANCE ? "configured" : "missing"
      },
      monitoring: healthMetrics
    };

    const duration = tracker.complete(200);
    backendLogger.info('health-check', `Health check completed in ${duration}ms`, {
      status: systemInfo.monitoring.status,
      requestCount: systemInfo.monitoring.metrics.totalRequests
    });

    return NextResponse.json(systemInfo, { status: 200 });
    
  } catch (error) {
    const duration = tracker.complete(500);
    backendLogger.error('health-check', 'Health check failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration 
    });
    
    return NextResponse.json(
      { 
        status: "error", 
        service: "kaleconnect-backend", 
        timestamp: new Date().toISOString(),
        error: "Health check failed"
      }, 
      { status: 500 }
    );
  }
}
