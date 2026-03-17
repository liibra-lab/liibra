import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  const pathname = req.nextUrl.pathname;

  // Allow dark page ONLY via dark.liibra.com.br
  if (pathname.startsWith('/dark')) {
    if (host !== 'dark.liibra.com.br') {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  }

  // Route dark.liibra.com.br root to /dark
  if (host === 'dark.liibra.com.br' && pathname === '/') {
    return NextResponse.rewrite(new URL('/dark', req.url));
  }

  return NextResponse.next();
}
