const PUBLIC_OR_INTERNAL_PATHS = ['/sign-in', '/__clerk'];
const STATIC_ASSET_PATTERN = /\.[^/]+$/;

type RoleRouteDecision =
  | { type: 'allow' }
  | { type: 'redirect'; location: string };

function isPublicOrInternalPath(pathname: string): boolean {
  return (
    PUBLIC_OR_INTERNAL_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) ||
    pathname === '/_next' ||
    pathname.startsWith('/_next/') ||
    STATIC_ASSET_PATTERN.test(pathname)
  );
}

function isRouteFamily(pathname: string, family: string): boolean {
  return pathname === family || pathname.startsWith(`${family}/`);
}

export function parseAppRole(value: unknown): AppRole | null {
  return value === 'parent' || value === 'jiejie' || value === 'meimei'
    ? value
    : null;
}

export function getRoleHome(role: AppRole): string {
  if (role === 'jiejie') return '/jiejie';
  if (role === 'meimei') return '/meimei';
  return '/';
}

export function getRoleRouteDecision(
  pathname: string,
  roleValue: unknown,
): RoleRouteDecision {
  if (isPublicOrInternalPath(pathname) || pathname === '/access-denied') {
    return { type: 'allow' };
  }

  const role = parseAppRole(roleValue);
  if (role === null) {
    return { type: 'redirect', location: '/access-denied' };
  }

  if (role === 'parent') return { type: 'allow' };

  const home = getRoleHome(role);
  if (pathname === '/') return { type: 'redirect', location: home };
  if (isRouteFamily(pathname, home)) return { type: 'allow' };

  return { type: 'redirect', location: home };
}
