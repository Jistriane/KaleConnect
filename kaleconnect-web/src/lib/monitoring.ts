// Sistema de monitoramento e observabilidade para backend em produção

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  operation: string;
  message: string;
  metadata?: Record<string, unknown>;
  duration?: number;
  statusCode?: number;
  userId?: string;
  requestId?: string;
}

export interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

// Cache em memória para métricas (em produção, use Redis ou similar)
const metricsBuffer: ApiMetrics[] = [];
const logsBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 1000;

export class Logger {
  private service: string;
  private logLevel: LogLevel;

  constructor(service: string) {
    this.service = service;
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentIndex = levels.indexOf(this.logLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  private writeLog(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    // Em desenvolvimento, log no console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.service}] ${entry.operation}: ${entry.message}`, entry.metadata || '');
    }

    // Buffer para produção
    logsBuffer.push(entry);
    if (logsBuffer.length > MAX_BUFFER_SIZE) {
      logsBuffer.shift(); // Remove o mais antigo
    }
  }

  debug(operation: string, message: string, metadata?: Record<string, unknown>) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      service: this.service,
      operation,
      message,
      metadata
    });
  }

  info(operation: string, message: string, metadata?: Record<string, unknown>) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      service: this.service,
      operation,
      message,
      metadata
    });
  }

  warn(operation: string, message: string, metadata?: Record<string, unknown>) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      service: this.service,
      operation,
      message,
      metadata
    });
  }

  error(operation: string, message: string, metadata?: Record<string, unknown>) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      service: this.service,
      operation,
      message,
      metadata
    });
  }

  // Helper para logging de performance
  time(operation: string, message: string, metadata?: Record<string, unknown>) {
    const start = Date.now();
    return {
      end: (statusCode?: number, additionalMetadata?: Record<string, unknown>) => {
        const duration = Date.now() - start;
        this.info(operation, `${message} (${duration}ms)`, {
          ...metadata,
          ...additionalMetadata,
          duration,
          statusCode
        });
        return duration;
      }
    };
  }
}

// Singleton logger para backend
export const backendLogger = new Logger('kaleconnect-backend');

// Métricas de API
export function recordApiMetric(metric: ApiMetrics) {
  metricsBuffer.push(metric);
  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.shift();
  }

  // Log crítico para erros de API
  if (metric.statusCode >= 500) {
    backendLogger.error('api-error', `API error: ${metric.method} ${metric.endpoint}`, {
      statusCode: metric.statusCode,
      duration: metric.duration,
      userAgent: metric.userAgent,
      ip: metric.ip
    });
  }
}

// Health check para monitoramento
export function getHealthMetrics() {
  const now = Date.now();
  const last5Minutes = now - 5 * 60 * 1000;
  
  const recentMetrics = metricsBuffer.filter(m => 
    new Date(m.timestamp).getTime() > last5Minutes
  );

  const totalRequests = recentMetrics.length;
  const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
  const avgDuration = recentMetrics.length > 0 
    ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
    : 0;

  const recentLogs = logsBuffer.filter(l => 
    new Date(l.timestamp).getTime() > last5Minutes
  );

  const errorLogs = recentLogs.filter(l => l.level === 'error').length;

  return {
    status: errorCount / totalRequests > 0.1 ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    metrics: {
      totalRequests,
      errorCount,
      errorRate: totalRequests > 0 ? errorCount / totalRequests : 0,
      avgDuration: Math.round(avgDuration),
      errorLogs
    },
    limits: {
      maxBufferSize: MAX_BUFFER_SIZE,
      currentMetricsCount: metricsBuffer.length,
      currentLogsCount: logsBuffer.length
    }
  };
}

// Middleware helper para tracking de requisições
export function createRequestTracker(endpoint: string, method: string) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  return {
    requestId,
    complete: (statusCode: number, userAgent?: string, ip?: string) => {
      const duration = Date.now() - startTime;
      
      recordApiMetric({
        endpoint,
        method,
        statusCode,
        duration,
        timestamp: new Date().toISOString(),
        userAgent,
        ip
      });

      return duration;
    }
  };
}

// Limpeza periódica de buffers (chamar em cron job)
export function cleanupBuffers() {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 horas
  
  const validMetrics = metricsBuffer.filter(m => 
    new Date(m.timestamp).getTime() > cutoff
  );
  
  const validLogs = logsBuffer.filter(l => 
    new Date(l.timestamp).getTime() > cutoff
  );

  metricsBuffer.length = 0;
  metricsBuffer.push(...validMetrics);
  
  logsBuffer.length = 0;
  logsBuffer.push(...validLogs);

  backendLogger.info('cleanup', `Cleaned buffers: ${validMetrics.length} metrics, ${validLogs.length} logs retained`);
}
