import { useMemo } from 'react';
import { ComponentType, ScreenComponent, ScreenLayout } from './types';

function componentLabel(c: ScreenComponent) {
  switch (c.type) {
    case 'search':
      return 'Search';
    case 'banner':
      return `Banner (${c.image || 'image'})`;
    case 'destinations':
      return 'Destinations';
  }
}

export function LayoutBuilder(props: {
  layout: ScreenLayout;
  onChange: (next: ScreenLayout) => void;
}) {
  const { layout, onChange } = props;

  const json = useMemo(() => JSON.stringify(layout, null, 2), [layout]);

  function addComponent(type: ComponentType) {
    const next: ScreenComponent =
      type === 'banner' ? { type: 'banner', image: 'banner.png' } : type === 'search' ? { type: 'search' } : { type: 'destinations' };
    onChange({ ...layout, components: [...layout.components, next] });
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...layout.components];
    const to = idx + dir;
    if (to < 0 || to >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[to];
    next[to] = tmp;
    onChange({ ...layout, components: next });
  }

  function remove(idx: number) {
    const next = layout.components.filter((_, i) => i !== idx);
    onChange({ ...layout, components: next });
  }

  function updateBannerImage(idx: number, image: string) {
    const next = [...layout.components];
    const c = next[idx];
    if (c?.type !== 'banner') return;
    next[idx] = { ...c, image };
    onChange({ ...layout, components: next });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold">Add component</div>
          <div className="flex flex-wrap gap-2 p-4">
            <button
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              onClick={() => addComponent('search')}
              type="button"
            >
              + Search
            </button>
            <button
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              onClick={() => addComponent('banner')}
              type="button"
            >
              + Banner
            </button>
            <button
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              onClick={() => addComponent('destinations')}
              type="button"
            >
              + Destinations
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold">Components</div>
          <div className="divide-y divide-slate-800">
            {layout.components.length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-300">No components yet.</div>
            ) : (
              layout.components.map((c, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold">{componentLabel(c)}</div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900"
                        onClick={() => move(idx, -1)}
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900"
                        onClick={() => move(idx, 1)}
                        type="button"
                      >
                        ↓
                      </button>
                      <button
                        className="rounded-md border border-red-800 bg-red-950/30 px-2 py-1 text-xs text-red-200 hover:bg-red-950/50"
                        onClick={() => remove(idx)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {c.type === 'banner' ? (
                    <div className="mt-3 grid gap-2">
                      <label className="block">
                        <div className="mb-1 text-xs text-slate-300">Banner image</div>
                        <input
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-slate-500"
                          value={c.image}
                          onChange={(e) => updateBannerImage(idx, e.target.value)}
                        />
                      </label>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="border-b border-slate-800 px-4 py-3 text-sm font-semibold">Preview JSON</div>
          <pre className="max-h-[70vh] overflow-auto p-4 text-xs text-slate-200">
            <code>{json}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

