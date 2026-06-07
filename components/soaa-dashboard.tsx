"use client";

import { useState } from "react";
import { soaaData } from "./soaa-data";

/**
 * SoaaDashboard — нативний (без iframe) дашборд «Share of AI Answer» для статті.
 * Дані — знімок із ai-visibility/output/soaa-report.json (components/soaa-data.ts).
 * Перегенерувати знімок: node scripts/07-export-data.mjs у C:\seobaza\ai-visibility.
 */

const QUAD: Record<string, string> = {
  "winning": "виграєш",
  "zero-click-risk": "zero-click ризик",
  "improve": "підтягнути",
  "absent-but-visible": "видимий, без AIO",
  "absent": "відсутній",
};

type Row = (typeof soaaData.cited)[number];

function Cards() {
  const items = [
    { n: soaaData.totalQueries, l: "запитів проаналізовано" },
    { n: soaaData.citedCount, l: "ти в стількох AI-відповідях" },
    { n: soaaData.totalClicks, l: "усього кліків" },
    { n: soaaData.totalImpr, l: "усього показів" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 not-prose">
      {items.map((it) => (
        <div key={it.l} className="rounded-xl border border-border bg-secondary p-4">
          <div className="text-2xl font-bold text-primary">{it.n}</div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{it.l}</div>
        </div>
      ))}
    </div>
  );
}

function Scatter() {
  const [hover, setHover] = useState<number | null>(null);
  const data = soaaData.cited;
  const W = 720, H = 360, padL = 44, padR = 16, padT = 16, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xMax = Math.max(10, Math.ceil(Math.max(...data.map((d) => d.my_share)) / 10) * 10);
  const yMax = Math.max(1, ...data.map((d) => d.clicks));
  const px = (v: number) => padL + (v / xMax) * plotW;
  const py = (v: number) => padT + plotH - (v / yMax) * plotH;
  const rad = (v: number) => Math.max(5, Math.min(34, Math.sqrt(v) * 1.4));
  const h = hover != null ? data[hover] : null;

  const xticks = Array.from({ length: xMax / 10 + 1 }, (_, i) => i * 10);
  const yticks = Array.from({ length: yMax + 1 }, (_, i) => i);

  return (
    <div className="rounded-xl border border-border bg-secondary p-4 mb-5 not-prose">
      <div className="text-sm font-semibold mb-1">Частка AI-відповіді проти кліків</div>
      <div className="text-xs text-muted-foreground mb-2 min-h-[2.5em]">
        {h
          ? <><b className="text-foreground">{h.query}</b> — {h.my_share}% частка, {h.clicks} кліків, {h.impressions} показів</>
          : "X = частка AI-відповіді · Y = кліки · розмір = покази. Наведи на бульбашку, щоб побачити запит."}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Scatter: частка AI-відповіді проти кліків">
        {/* осі */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="hsl(var(--border))" />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="hsl(var(--border))" />
        {xticks.map((t) => (
          <g key={`x${t}`}>
            <line x1={px(t)} y1={padT} x2={px(t)} y2={padT + plotH} stroke="hsl(var(--border))" strokeOpacity="0.4" />
            <text x={px(t)} y={padT + plotH + 16} fontSize="11" textAnchor="middle" fill="hsl(var(--muted-foreground))">{t}%</text>
          </g>
        ))}
        {yticks.map((t) => (
          <g key={`y${t}`}>
            <text x={padL - 8} y={py(t) + 4} fontSize="11" textAnchor="end" fill="hsl(var(--muted-foreground))">{t}</text>
          </g>
        ))}
        <text x={padL + plotW / 2} y={H - 4} fontSize="11" textAnchor="middle" fill="hsl(var(--muted-foreground))">Твоя частка AI-відповіді (%)</text>
        {/* бульбашки */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={px(d.my_share)}
            cy={py(d.clicks)}
            r={rad(d.impressions)}
            style={{
              fill: hover === i ? "hsl(var(--accent))" : "hsl(var(--primary))",
              fillOpacity: hover === i ? 0.75 : 0.45,
              stroke: "hsl(var(--primary))",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <title>{d.query}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function Table({ title, rows, kind }: { title: string; rows: readonly Row[]; kind: "zero" | "all" }) {
  return (
    <div className="rounded-xl border border-border bg-secondary p-4 mb-5 not-prose overflow-x-auto">
      <div className="text-sm font-semibold mb-3">{title}</div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-muted-foreground text-left">
            <th className="py-1.5 pr-3 font-medium">Запит</th>
            <th className="py-1.5 px-2 font-medium text-right">Частка</th>
            {kind === "all" && <th className="py-1.5 px-2 font-medium text-right">Кліки</th>}
            <th className="py-1.5 px-2 font-medium text-right">Покази</th>
            {kind === "zero" ? <th className="py-1.5 pl-2 font-medium text-right">Топ-конкурент</th>
              : <th className="py-1.5 pl-2 font-medium text-right">Квадрант</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-1.5 pr-3">{r.query}</td>
              <td className="py-1.5 px-2 text-right">{r.my_share}%</td>
              {kind === "all" && <td className="py-1.5 px-2 text-right">{r.clicks}</td>}
              <td className="py-1.5 px-2 text-right">{r.impressions}</td>
              {kind === "zero" ? <td className="py-1.5 pl-2 text-right">{r.top_competitor}</td>
                : <td className="py-1.5 pl-2 text-right">{QUAD[r.quadrant] ?? r.quadrant}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SoaaDashboard() {
  return (
    <div className="my-8 not-prose">
      <Cards />
      <Scatter />
      {soaaData.zeroClick.length > 0 && (
        <Table title="⚠ Ризик zero-click" rows={soaaData.zeroClick} kind="zero" />
      )}
      <Table title="Усі внески в AI-відповіді" rows={soaaData.cited} kind="all" />
      <div className="text-xs text-muted-foreground">Знімок даних: {soaaData.updated}.</div>
    </div>
  );
}
