import { clerkMiddleware } from '@clerk/nextjs/server';
import { getAuthRouteDecision } from './lib/auth-route-policy';

export default clerkMiddleware(async (auth, request) => {
  const { isAuthenticated, redirectToSignIn } = await auth();
  const decision = getAuthRouteDecision(request.nextUrl.pathname, isAuthenticated);

  if (decision.type === 'redirect') {
    return redirectToSignIn({ returnBackUrl: request.url });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};
