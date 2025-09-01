import { NextRequest, NextResponse } from "next/server";

// Rate limiting em memória para produção
const rateLimitMap = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Rate limiting apenas para API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const now = Date.now();
    const windowMs = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000');
    const maxRequests = parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '20');
    
    // Limpar requisições antigas
    const userRequests = rateLimitMap.get(ip) || [];
    const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
    
    // Verificar limite
    if (recentRequests.length >= maxRequests) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'rate_limit_exceeded', 
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(windowMs / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(windowMs / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor((now + windowMs) / 1000))
          }
        }
      );
    }
    
    // Adicionar nova requisição
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    
    // Headers de rate limiting para sucesso
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(maxRequests));
    response.headers.set('X-RateLimit-Remaining', String(maxRequests - recentRequests.length));
    response.headers.set('X-RateLimit-Reset', String(Math.floor((now + windowMs) / 1000)));
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*'
  ]
};
