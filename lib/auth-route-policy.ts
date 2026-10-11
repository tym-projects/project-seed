const PUBLIC_AUTH_PATHS = ['/sign-in', '/__clerk'];
const STATIC_ASSET_PATTERN = /\.[^/]+$/;

export function isPublicAuthPath(pathname: string): boolean {
  return (
    PUBLIC_AUTH_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) ||
    pathname === '/_next' ||
    pathname.startsWith('/_next/') ||
    STATIC_ASSET_PATTERN.test(pathname)
  );
}

export function isProtectedAuthPath(pathname: string): boolean {
  return !isPublicAuthPath(pathname);
}

export function getAuthRouteDecision(
  pathname: string,
  isAuthenticated: boolean,
): { type: 'public' | 'allow' | 'redirect' } {
  if (isPublicAuthPath(pathname)) return { type: 'public' };
  return isAuthenticated ? { type: 'allow' } : { type: 'redirect' };
}
