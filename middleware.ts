import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');

  if (host === 'dark.liibra.com.br') {
    return NextResponse.rewrite(new URL('/dark', req.url));
  }

  return NextResponse.next();
}
