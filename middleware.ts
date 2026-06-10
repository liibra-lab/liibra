import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/dark')) {
    if (hostname !== 'dark.liibra.com.br') {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  }

  if (hostname === 'dark.liibra.com.br' && pathname === '/') {
    return NextResponse.rewrite(new URL('/dark', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
