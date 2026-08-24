"use client";

/**
 * SolarDiagram — clean vector single-line diagrams for the four solar
 * solution types (On-Grid, Hybrid, BESS, Off-Grid).
 *
 * Everything is laid out on a fixed 3x3 grid and connected with orthogonal
 * (right-angle) runs so the result reads like an engineering single-line
 * drawing rather than a scatter of diagonal lines. Flow direction is shown
 * with static arrow heads — the diagrams are deliberately not animated.
 */

export type DiagramType = "on-grid" | "hybrid" | "bess" | "off-grid";

type NodeKind = "panels" | "inverter" | "battery" | "grid" | "home";
type FlowKind = "solar" | "grid" | "battery";

/* ---------------------------------------------------------------- canvas */

const W = 900;
const PAD = 26; // vertical breathing room above/below the outermost cards

const CARD_W = 132;
const CARD_H = 96;
const HW = CARD_W / 2;
const HH = CARD_H / 2;
const GAP = 10; // breathing room between a card edge and its connector

const COL = [110, 450, 790]; // x centres
const ROW = [70, 240, 410]; // y centres

const FLOW: Record<FlowKind, { color: string; label: string }> = {
  solar: { color: "#00AC4E", label: "Solar generation" },
  grid: { color: "#E0A000", label: "Utility grid" },
  battery: { color: "#6BAA1E", label: "Battery storage" },
};

/* ----------------------------------------------------------------- model */

interface DNode {
  id: string;
  kind: NodeKind;
  col: 0 | 1 | 2;
  row: 0 | 1 | 2;
  label: string;
  sub?: string;
  /** render larger / filled — used for the hero node of a diagram */
  hero?: boolean;
  /** greyed out, e.g. the grid on an off-grid system */
  muted?: boolean;
}

interface DEdge {
  from: string;
  to: string;
  flow: FlowKind;
  /** energy moves both ways (import + export) */
  both?: boolean;
  /** not connected at all — drawn as a broken link */
  severed?: boolean;
}

interface Config {
  nodes: DNode[];
  edges: DEdge[];
  caption: string;
}

const configs: Record<DiagramType, Config> = {
  "on-grid": {
    caption: "Solar powers the building by day; surplus is exported and the grid covers the shortfall.",
    nodes: [
      { id: "grid", kind: "grid", col: 1, row: 0, label: "Utility Grid", sub: "Import / Export" },
      { id: "panels", kind: "panels", col: 0, row: 1, label: "Solar Array", sub: "DC generation" },
      { id: "inverter", kind: "inverter", col: 1, row: 1, label: "Grid-Tie Inverter", sub: "DC → AC", hero: true },
      { id: "home", kind: "home", col: 2, row: 1, label: "Home / Load", sub: "AC consumption" },
    ],
    edges: [
      { from: "panels", to: "inverter", flow: "solar" },
      { from: "inverter", to: "home", flow: "solar" },
      { from: "inverter", to: "grid", flow: "grid", both: true },
    ],
  },

  hybrid: {
    caption: "Grid connection and battery storage combined — solar first, battery next, grid as backup.",
    nodes: [
      { id: "grid", kind: "grid", col: 1, row: 0, label: "Utility Grid", sub: "Import / Export" },
      { id: "panels", kind: "panels", col: 0, row: 1, label: "Solar Array", sub: "DC generation" },
      { id: "inverter", kind: "inverter", col: 1, row: 1, label: "Hybrid Inverter", sub: "Smart routing", hero: true },
      { id: "home", kind: "home", col: 2, row: 1, label: "Home / Load", sub: "Always supplied" },
      { id: "battery", kind: "battery", col: 1, row: 2, label: "Battery Bank", sub: "Charge / Discharge" },
    ],
    edges: [
      { from: "panels", to: "inverter", flow: "solar" },
      { from: "inverter", to: "home", flow: "solar" },
      { from: "inverter", to: "grid", flow: "grid", both: true },
      { from: "inverter", to: "battery", flow: "battery", both: true },
    ],
  },

  bess: {
    caption: "Stores surplus solar and cheap off-peak grid energy, then releases it on demand.",
    nodes: [
      { id: "panels", kind: "panels", col: 0, row: 0, label: "Solar Input", sub: "Surplus generation" },
      { id: "battery", kind: "battery", col: 1, row: 1, label: "BESS", sub: "Energy storage", hero: true },
      { id: "home", kind: "home", col: 2, row: 1, label: "Backup / Load", sub: "On-demand supply" },
      { id: "grid", kind: "grid", col: 0, row: 2, label: "Grid Input", sub: "Off-peak charging" },
    ],
    edges: [
      { from: "panels", to: "battery", flow: "solar" },
      { from: "grid", to: "battery", flow: "grid" },
      { from: "battery", to: "home", flow: "battery" },
    ],
  },

  "off-grid": {
    caption: "Fully independent — no utility connection. Solar charges the battery, the battery runs the load.",
    nodes: [
      { id: "grid", kind: "grid", col: 1, row: 0, label: "Utility Grid", sub: "Not connected", muted: true },
      { id: "panels", kind: "panels", col: 0, row: 1, label: "Solar Array", sub: "DC generation" },
      { id: "inverter", kind: "inverter", col: 1, row: 1, label: "Inverter / Charger", sub: "Off-grid control", hero: true },
      { id: "home", kind: "home", col: 2, row: 1, label: "Home / Load", sub: "Day & night supply" },
      { id: "battery", kind: "battery", col: 1, row: 2, label: "Battery Bank", sub: "Full autonomy" },
    ],
    edges: [
      { from: "panels", to: "inverter", flow: "solar" },
      { from: "inverter", to: "home", flow: "solar" },
      { from: "inverter", to: "battery", flow: "battery", both: true },
      { from: "grid", to: "inverter", flow: "grid", severed: true },
    ],
  },
};

/* ----------------------------------------------------------------- icons */
/* Drawn on a ~48px box centred on the origin, stroked with currentColor. */

function glyph(kind: NodeKind) {
  switch (kind) {
    case "panels":
      return (
        <>
          <rect x="-16" y="-14" width="32" height="21" rx="2.5" />
          <path d="M-16 -7H16M-16 0H16M-5.4 -14V7M5.4 -14V7" />
          <path d="M0 7v8M-7 15h14" />
        </>
      );
    case "inverter":
      return (
        <>
          <rect x="-13" y="-15" width="26" height="30" rx="4.5" />
          <path d="M-7.5 5c0-7 4.5-7 7.5-2.5S7.5 2 7.5 -5" />
          <path d="M-6 -9.5h12" />
        </>
      );
    case "battery":
      return (
        <>
          <rect x="-16" y="-10.5" width="28" height="21" rx="4" />
          <path d="M14.5 -4.5v9" />
          <path d="M1.5 -6 -4 1h5l-2 6" />
        </>
      );
    case "grid":
      return (
        <>
          <path d="M-11 15 -5.5 -10h11L11 15" />
          <path d="M-9 -10h18M0 -10v-4.5" />
          <path d="M-7.4 -3h14.8M-9.4 6h18.8" />
        </>
      );
    case "home":
      return (
        <>
          <path d="M-14 -1 0 -14l14 13" />
          <path d="M-10.5 -3.5V14h21V-3.5" />
          <path d="M-3.2 14V6h6.4v8" />
        </>
      );
  }
}

/* ------------------------------------------------------------- geometry */

interface Pos {
  cx: number;
  cy: number;
  col: number;
  row: number;
}

const ARC = 18; // corner radius on elbow runs

/**
 * Orthogonal run between two cards: straight when they share a row or a
 * column, otherwise leave horizontally and turn once into the target's face.
 */
function connector(a: Pos, b: Pos, offset = 0): string {
  // same row -> straight horizontal
  if (a.row === b.row) {
    const dir = b.cx > a.cx ? 1 : -1;
    const x1 = a.cx + dir * (HW + GAP);
    const x2 = b.cx - dir * (HW + GAP);
    const y = a.cy + offset;
    return `M ${x1} ${y} H ${x2}`;
  }

  // same column -> straight vertical
  if (a.col === b.col) {
    const dir = b.cy > a.cy ? 1 : -1;
    const y1 = a.cy + dir * (HH + GAP);
    const y2 = b.cy - dir * (HH + GAP);
    const x = a.cx + offset;
    return `M ${x} ${y1} V ${y2}`;
  }

  // elbow: out the side of `a`, turn once, into the top/bottom of `b`
  const hDir = b.cx > a.cx ? 1 : -1;
  const vDir = b.cy > a.cy ? 1 : -1;
  const x1 = a.cx + hDir * (HW + GAP);
  const turnX = b.cx;
  const yEnd = b.cy - vDir * (HH + GAP);
  // sweep: right-then-down and left-then-up are clockwise
  const sweep = hDir === vDir ? 1 : 0;
  return [
    `M ${x1} ${a.cy}`,
    `H ${turnX - hDir * ARC}`,
    `A ${ARC} ${ARC} 0 0 ${sweep} ${turnX} ${a.cy + vDir * ARC}`,
    `V ${yEnd}`,
  ].join(" ");
}

/* --------------------------------------------------------------- render */

export default function SolarDiagram({
  type,
  uniform = false,
}: {
  type: DiagramType;
  /** pad every diagram to the same height so a grid of them lines up */
  uniform?: boolean;
}) {
  const cfg = configs[type];
  const uid = `d-${type}`;
  const pos: Record<string, Pos> = Object.fromEntries(
    cfg.nodes.map((n) => [n.id, { cx: COL[n.col], cy: ROW[n.row], col: n.col, row: n.row }])
  );

  const usedFlows = Array.from(
    new Set(cfg.edges.filter((e) => !e.severed).map((e) => e.flow))
  ) as FlowKind[];

  const rows = cfg.nodes.map((n) => n.row);
  const contentTop = ROW[Math.min(...rows)] - HH - PAD;
  const contentHeight = ROW[Math.max(...rows)] + HH + PAD - contentTop;
  // In `uniform` mode every diagram gets the full three-row box, with its
  // own content centred inside it, so cards in a grid stay aligned.
  const fullHeight = ROW[2] + HH + PAD - (ROW[0] - HH - PAD);
  const vbHeight = uniform ? fullHeight : contentHeight;
  const vbTop = uniform ? contentTop - (fullHeight - contentHeight) / 2 : contentTop;

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 ${vbTop} ${W} ${vbHeight}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby={`${uid}-title ${uid}-desc`}
      >
        <title id={`${uid}-title`}>{type.replace("-", " ")} system diagram</title>
        <desc id={`${uid}-desc`}>{cfg.caption}</desc>

        <defs>
          <filter id={`${uid}-shadow`} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#0f172a" floodOpacity="0.07" />
          </filter>
          {(Object.keys(FLOW) as FlowKind[]).map((f) => (
            <marker
              key={f}
              id={`${uid}-arw-${f}`}
              markerWidth="9"
              markerHeight="9"
              refX="6.4"
              refY="3"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0 0 6.5 3 0 6Z" fill={FLOW[f].color} />
            </marker>
          ))}
        </defs>

        {/* ---- connectors ---- */}
        {cfg.edges.map((e, i) => {
          const a = pos[e.from];
          const b = pos[e.to];
          const { color } = FLOW[e.flow];

          if (e.severed) {
            const d = connector(a, b);
            const midX = (a.cx + b.cx) / 2;
            const midY = (a.cy + b.cy) / 2;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
                <circle cx={midX} cy={midY} r="13" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <path
                  d={`M ${midX - 4.5} ${midY - 4.5} l 9 9 M ${midX + 4.5} ${midY - 4.5} l -9 9`}
                  stroke="#94a3b8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            );
          }

          // bidirectional links are drawn as a pair of offset runs
          const lanes = e.both
            ? [
                { off: -6, rev: false },
                { off: 6, rev: true },
              ]
            : [{ off: 0, rev: false }];

          return (
            <g key={i}>
              {lanes.map((lane, li) => {
                const d = lane.rev ? connector(b, a, lane.off) : connector(a, b, lane.off);
                return (
                  <g key={li}>
                    <path d={d} fill="none" stroke="#eef2f6" strokeWidth="6" strokeLinecap="round" />
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      markerEnd={`url(#${uid}-arw-${e.flow})`}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* ---- nodes ---- */}
        {cfg.nodes.map((n) => {
          const { cx, cy } = pos[n.id];
          const accent = n.muted ? "#94a3b8" : n.hero ? "#00AC4E" : "#0f172a";
          return (
            <g key={n.id} opacity={n.muted ? 0.55 : 1}>
              <rect
                x={cx - HW}
                y={cy - HH}
                width={CARD_W}
                height={CARD_H}
                rx="18"
                fill={n.hero ? "#f6fdf9" : "#ffffff"}
                stroke={n.hero ? "#00AC4E" : "#e2e8f0"}
                strokeWidth={n.hero ? 2 : 1.5}
                strokeDasharray={n.muted ? "5 5" : undefined}
                filter={`url(#${uid}-shadow)`}
              />
              <g
                transform={`translate(${cx} ${cy - 21}) scale(0.7)`}
                stroke={accent}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {glyph(n.kind)}
              </g>
              <text
                x={cx}
                y={cy + 18}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={n.muted ? "#64748b" : "#0f172a"}
              >
                {n.label}
              </text>
              {n.sub && (
                <text x={cx} y={cy + 34} textAnchor="middle" fontSize="11" fontWeight="600" fill="#94a3b8">
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* ---- legend ---- */}
      <figcaption className="mt-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {usedFlows.map((f) => (
            <span key={f} className="inline-flex items-center gap-2 text-[11px] font-bold text-stone-500">
              <span className="w-5 h-[3px] rounded-full" style={{ backgroundColor: FLOW[f].color }} />
              {FLOW[f].label}
            </span>
          ))}
          {cfg.edges.some((e) => e.severed) && (
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-stone-400">
              <span className="w-5 h-[3px] rounded-full bg-stone-300" />
              No grid connection
            </span>
          )}
        </div>
        <p className="text-center text-xs text-stone-500 font-medium leading-relaxed max-w-xl mx-auto">
          {cfg.caption}
        </p>
      </figcaption>
    </figure>
  );
}
