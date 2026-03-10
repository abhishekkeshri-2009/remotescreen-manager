import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getAuth } from '../lib/auth';

export function Layout() {
  const nav = useNavigate();
  const loc = useLocation();
  const auth = typeof window !== 'undefined' ? getAuth() : null;
  const authed = !!auth?.access_token;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/apps" className="text-sm font-semibold tracking-wide">
              RemoteScreen Manager
            </Link>
            {auth?.company?.name ? (
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-200">
                {auth.company.name}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {authed ? (
              <>
                <button
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
                  onClick={() => {
                    clearAuth();
                    nav('/login');
                  }}
                >
                  Logout
                </button>
              </>
            ) : loc.pathname !== '/login' ? (
              <Link
                to="/login"
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
              >
                Login
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

