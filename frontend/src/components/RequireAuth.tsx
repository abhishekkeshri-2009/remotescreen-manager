import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../lib/auth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = typeof window !== 'undefined' ? getToken() : null;
  const loc = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

