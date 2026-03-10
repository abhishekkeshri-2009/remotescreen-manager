import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type AppRow = { id: string; name: string; createdAt: string };

export function AppsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get('/apps');
      setApps(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load apps');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    try {
      await api.post('/apps', { name: name.trim() });
      setName('');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create app');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Apps</h1>
          <p className="mt-1 text-sm text-slate-300">Create an app to manage its screens.</p>
        </div>
        <form className="flex gap-2" onSubmit={onCreate}>
          <input
            className="w-64 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="New app name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
            Create
          </button>
        </form>
      </div>

      {error ? <div className="rounded-md bg-red-950/40 p-2 text-sm text-red-200">{error}</div> : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/30">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold">Your apps</div>
        <div className="divide-y divide-slate-800">
          {loading ? (
            <div className="px-4 py-4 text-sm text-slate-300">Loading…</div>
          ) : apps.length === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-300">No apps yet.</div>
          ) : (
            apps.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">{a.name}</div>
                  <div className="text-xs text-slate-400">Created {new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <Link
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
                  to={`/apps/${a.id}/screens`}
                >
                  Manage screens
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

