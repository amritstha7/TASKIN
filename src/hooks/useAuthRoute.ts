import { useEffect, useState } from 'react';

// The app has no router library — the main app itself intentionally stays
// state-based (see AppContext's `currentScreen`). This is a minimal,
// dependency-free router scoped only to the 4 pre-auth pages, so password
// reset / OAuth redirects and browser back/forward have real, bookmarkable
// URLs to land on.
export type AuthRoute = '/login' | '/signup' | '/forgot-password' | '/reset-password';
const VALID_ROUTES: AuthRoute[] = ['/login', '/signup', '/forgot-password', '/reset-password'];

function normalize(path: string): AuthRoute {
  return (VALID_ROUTES as string[]).includes(path) ? (path as AuthRoute) : '/login';
}

export function useAuthRoute() {
  const [route, setRoute] = useState<AuthRoute>(() => normalize(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(normalize(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: AuthRoute) => {
    if (window.location.pathname !== next) {
      window.history.pushState({}, '', next);
    }
    setRoute(next);
  };

  return { route, navigate };
}
