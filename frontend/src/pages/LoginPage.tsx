import { FormEvent, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { setAuth } from '../lib/auth';

export function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as any)?.from ?? '/apps';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [companyName, setCompanyName] = useState('Acme');
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === 'login' ? 'Login' : 'Register'), [mode]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await api.post('/auth/login', { email, password })
          : await api.post('/auth/register', { companyName, email, password });
      setAuth(res.data);
      nav(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex gap-1 rounded-lg bg-slate-950 p-1">
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${
                mode === 'login' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900'
              }`}
              onClick={() => setMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm ${
                mode === 'register'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
              onClick={() => setMode('register')}
              type="button"
            >
              Register
            </button>
          </div>
        </div>

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          {mode === 'register' ? (
            <label className="block">
              <div className="mb-1 text-xs text-slate-300">Company name</div>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>
          ) : null}

          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Email</div>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Password</div>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <div className="mt-1 text-xs text-slate-400">Min 8 characters.</div>
          </label>

          {error ? <div className="rounded-md bg-red-950/40 p-2 text-sm text-red-200">{error}</div> : null}

          <button
            className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Please wait…' : title}
          </button>
        </form>
      </div>
    </div>
  );
}

