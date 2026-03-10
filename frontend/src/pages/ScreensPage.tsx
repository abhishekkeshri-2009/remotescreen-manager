import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

type ScreenRow = {
  id: string;
  app_id: string;
  screen_name: string;
  layout_json: any;
  published: boolean;
  updatedAt: string;
};

export function ScreensPage() {
  const { appId } = useParams();
  const [screens, setScreens] = useState<ScreenRow[]>([]);
  const [screenName, setScreenName] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultLayout = useMemo(
    () => ({
      screen: screenName,
      components: [{ type: 'search' }, { type: 'banner', image: 'banner.png' }, { type: 'destinations' }],
    }),
    [screenName],
  );

  async function load() {
    if (!appId) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.get('/screens', { params: { app_id: appId } });
      setScreens(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load screens');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [appId]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!appId) return;
    setError(null);
    try {
      await api.post('/screens', { app_id: appId, screen_name: screenName.trim(), layout_json: defaultLayout });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create screen');
    }
  }

  async function onPublish(id: string) {
    setError(null);
    try {
      await api.post(`/screens/${id}/publish`);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to publish screen');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Screens</h1>
          <p className="mt-1 text-sm text-slate-300">Create, edit, reorder components, and publish.</p>
        </div>
        <form className="flex gap-2" onSubmit={onCreate}>
          <input
            className="w-64 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="screen_name (e.g. home)"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
          />
          <button className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
            Create
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Link className="text-slate-300 hover:text-white underline" to="/apps">
          ← Back to apps
        </Link>
      </div>

      {error ? <div className="rounded-md bg-red-950/40 p-2 text-sm text-red-200">{error}</div> : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/30">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold">App screens</div>
        <div className="divide-y divide-slate-800">
          {loading ? (
            <div className="px-4 py-4 text-sm text-slate-300">Loading…</div>
          ) : screens.length === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-300">No screens yet.</div>
          ) : (
            screens.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">{s.screen_name}</div>
                    {s.published ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-200">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-200">Draft</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">Updated {new Date(s.updatedAt).toLocaleString()}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
                    to={`/apps/${appId}/screens/${s.id}/builder`}
                  >
                    Edit layout
                  </Link>
                  <button
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                    disabled={s.published}
                    onClick={() => onPublish(s.id)}
                  >
                    Publish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

