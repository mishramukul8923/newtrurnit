// /middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware triggered for:', request.nextUrl.pathname);

  // const isAuthenticated = Boolean(request.cookies.get('token'));
  const isAuthenticated = true;

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to certain paths
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
