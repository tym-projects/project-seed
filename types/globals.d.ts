export {};

declare global {
  type AppRole = 'parent' | 'jiejie' | 'meimei';

  interface CustomJwtSessionClaims {
    metadata?: {
      role?: unknown;
    } | null;
  }
}
