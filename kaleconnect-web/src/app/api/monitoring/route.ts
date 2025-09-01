import { NextRequest, NextResponse } from "next/server";
import { getHealthMetrics, backendLogger, createRequestTracker } from "@/lib/monitoring";

// Endpoint protegido para monitoramento em produção
export async function GET(request: NextRequest) {
  const tracker = createRequestTracker('/api/monitoring', 'GET');
  
  try {
    // Autenticação simples para acesso ao monitoramento
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.MONITORING_TOKEN || 'dev-monitoring-token';
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      tracker.complete(401);
      return NextResponse.json(
        { error: 'Unauthorized access to monitoring endpoint' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const details = searchParams.get('details') === 'true';

    backendLogger.info('monitoring', 'Monitoring data requested', { format, details });

    const healthMetrics = getHealthMetrics();
    
    const monitoringData = {
      timestamp: new Date().toISOString(),
      service: 'kaleconnect-backend',
      status: healthMetrics.status,
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      ...healthMetrics,
      
      ...(details && {
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          pid: process.pid,
          platform: process.platform,
          nodeVersion: process.version
        },
        configuration: {
          logLevel: process.env.LOG_LEVEL || 'info',
          debugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
          rateLimit: {
            windowMs: process.env.API_RATE_LIMIT_WINDOW_MS || '60000',
            maxRequests: process.env.API_RATE_LIMIT_MAX_REQUESTS || '20'
          },
          compliance: {
            strictMode: process.env.COMPLIANCE_STRICT_MODE === 'true',
            highValueThreshold: process.env.HIGH_VALUE_THRESHOLD_USD || '1000'
          },
          network: {
            stellar: 'testnet',
            sorobanRpc: process.env.NEXT_PUBLIC_SOROBAN_RPC,
            horizon: process.env.NEXT_PUBLIC_HORIZON_URL
          }
        }
      })
    };

    // Formato Prometheus para integração com sistemas de monitoramento
    if (format === 'prometheus') {
      const metrics = [
        `# HELP kaleconnect_requests_total Total number of API requests`,
        `# TYPE kaleconnect_requests_total counter`,
        `kaleconnect_requests_total ${healthMetrics.metrics.totalRequests}`,
        ``,
        `# HELP kaleconnect_errors_total Total number of API errors`,
        `# TYPE kaleconnect_errors_total counter`,
        `kaleconnect_errors_total ${healthMetrics.metrics.errorCount}`,
        ``,
        `# HELP kaleconnect_error_rate Current error rate`,
        `# TYPE kaleconnect_error_rate gauge`,
        `kaleconnect_error_rate ${healthMetrics.metrics.errorRate}`,
        ``,
        `# HELP kaleconnect_avg_duration_ms Average request duration in milliseconds`,
        `# TYPE kaleconnect_avg_duration_ms gauge`,
        `kaleconnect_avg_duration_ms ${healthMetrics.metrics.avgDuration}`,
        ``,
        `# HELP kaleconnect_uptime_seconds Process uptime in seconds`,
        `# TYPE kaleconnect_uptime_seconds gauge`,
        `kaleconnect_uptime_seconds ${process.uptime()}`,
        ``
      ].join('\n');

      tracker.complete(200);
      return new NextResponse(metrics, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' }
      });
    }

    const duration = tracker.complete(200);
    backendLogger.info('monitoring', `Monitoring data served in ${duration}ms`, {
      format,
      details,
      dataSize: JSON.stringify(monitoringData).length
    });

    return NextResponse.json(monitoringData, { status: 200 });

  } catch (error) {
    const duration = tracker.complete(500);
    backendLogger.error('monitoring', 'Failed to serve monitoring data', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    });

    return NextResponse.json(
      { error: 'Failed to retrieve monitoring data' },
      { status: 500 }
    );
  }
}

// Endpoint para limpeza de buffers (pode ser chamado via cron)
export async function DELETE(request: NextRequest) {
  const tracker = createRequestTracker('/api/monitoring', 'DELETE');

  try {
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.MONITORING_TOKEN || 'dev-monitoring-token';
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      tracker.complete(401);
      return NextResponse.json(
        { error: 'Unauthorized access to monitoring endpoint' },
        { status: 401 }
      );
    }

    // Importar dinamicamente para evitar side effects no build
    const { cleanupBuffers } = await import('@/lib/monitoring');
    cleanupBuffers();

    const duration = tracker.complete(200);
    backendLogger.info('monitoring', `Buffer cleanup completed in ${duration}ms`);

    return NextResponse.json(
      { 
        status: 'success', 
        message: 'Monitoring buffers cleaned up',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    const duration = tracker.complete(500);
    backendLogger.error('monitoring', 'Buffer cleanup failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    });

    return NextResponse.json(
      { error: 'Failed to cleanup monitoring buffers' },
      { status: 500 }
    );
  }
}
