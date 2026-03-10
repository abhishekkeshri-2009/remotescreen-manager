import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { isLayout, ScreenLayout } from '../layout-builder/types';
import { LayoutBuilder } from '../layout-builder/LayoutBuilder';

type ScreenRow = {
  id: string;
  app_id: string;
  screen_name: string;
  layout_json: any;
  published: boolean;
};

export function LayoutBuilderPage() {
  const nav = useNavigate();
  const { appId, screenId } = useParams();

  const [screen, setScreen] = useState<ScreenRow | null>(null);
  const [layout, setLayout] = useState<ScreenLayout | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!appId || !screenId) return;
    setError(null);
    try {
      const res = await api.get('/screens', { params: { app_id: appId } });
      const found = (res.data as ScreenRow[]).find((s) => s.id === screenId) ?? null;
      setScreen(found);
      const candidate = found?.layout_json;
      if (found && isLayout(candidate)) setLayout(candidate);
      else if (found) setLayout({ screen: found.screen_name, components: [] });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load screen');
    }
  }

  useEffect(() => {
    void load();
  }, [appId, screenId]);

  async function onSave() {
    if (!screenId || !layout) return;
    setError(null);
    setSaving(true);
    try {
      await api.put(`/screens/${screenId}`, {
        screen_name: layout.screen,
        layout_json: layout,
      });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (!appId || !screenId) return <div className="text-sm text-slate-300">Missing params.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Layout builder</h1>
          <p className="mt-1 text-sm text-slate-300">Add components, reorder, and preview the SDUI JSON.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
            onClick={onSave}
            disabled={saving || !layout}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
            onClick={() => nav(`/apps/${appId}/screens`)}
          >
            Back
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Link className="text-slate-300 hover:text-white underline" to={`/apps/${appId}/screens`}>
          ← Screens
        </Link>
        {screen?.published ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-200">Published</span>
        ) : (
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-200">Draft</span>
        )}
      </div>

      {error ? <div className="rounded-md bg-red-950/40 p-2 text-sm text-red-200">{error}</div> : null}
      {!screen ? <div className="text-sm text-slate-300">Loading screen…</div> : null}

      {layout ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4">
          <label className="block">
            <div className="mb-1 text-xs text-slate-300">Screen name</div>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
              value={layout.screen}
              onChange={(e) => setLayout({ ...layout, screen: e.target.value })}
            />
          </label>
        </div>
      ) : null}

      {layout ? <LayoutBuilder layout={layout} onChange={setLayout} /> : null}
    </div>
  );
}

