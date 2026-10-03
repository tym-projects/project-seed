import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isPublicAuthPath } from './lib/auth-route-policy';
import { getRoleRouteDecision, parseAppRole } from './lib/role-authorization-policy';

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  if (isPublicAuthPath(pathname)) return NextResponse.next();

  const { isAuthenticated, redirectToSignIn, sessionClaims } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn({ returnBackUrl: request.url });
  }

  const role = parseAppRole(sessionClaims?.metadata?.role);
  const decision = getRoleRouteDecision(pathname, role);
  if (decision.type === 'redirect') {
    return NextResponse.redirect(new URL(decision.location, request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};
