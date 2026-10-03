import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getRoleRouteDecision, parseAppRole } from '../../lib/role-authorization-policy';

export default async function JiejieLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, redirectToSignIn, sessionClaims } = await auth();

  if (!isAuthenticated) {
    redirectToSignIn();
  }

  const role = parseAppRole(sessionClaims?.metadata?.role);
  const decision = getRoleRouteDecision('/jiejie', role);
  if (decision.type === 'redirect') {
    redirect(decision.location);
  }

  return <>{children}</>;
}
