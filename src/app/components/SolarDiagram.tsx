"use client";

/**
 * SolarDiagram — animated SVG energy-flow diagrams for the four solar
 * solution types. Energy "marches" along the connections via the
 * .flow-line CSS animation (stroke-dashoffset). Nodes are simple glyphs.
 */

type DiagramType = "on-grid" | "off-grid" | "hybrid" | "bess";

type NodeKind = "sun" | "panels" | "inverter" | "battery" | "grid" | "home" | "solar";

interface Node {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  reverse?: boolean; // flow visually travels target -> source
  accent?: "green" | "lime" | "amber";
  slow?: boolean;
}

const W = 780;
const H = 280;

const NW = 60; // node box half-width reference (visual chip ~ 52)

function glyph(kind: NodeKind) {
  switch (kind) {
    case "sun":
    case "solar":
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
          <circle cx="0" cy="0" r="6" />
          <path d="M0 -11V-14M0 11V14M-11 0H-14M11 0H14M-8 -8L-10 -10M8 8L10 10M8 -8L10 -10M-8 8L-10 10" />
        </g>
      );
    case "panels":
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="-12" y="-11" width="24" height="16" rx="1.5" />
          <path d="M-4 -11V5M4 -11V5M-12 -3H12M0 5V12M-6 12H6" />
        </g>
      );
    case "inverter":
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="-11" y="-12" width="22" height="24" rx="3" />
          <path d="M-6 2C-6 -3 -2 -3 0 0S6 3 6 -2" />
        </g>
      );
    case "battery":
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="-12" y="-8" width="22" height="16" rx="2.5" />
          <path d="M10 -3V3" />
          <path d="M-4 -2L1 -2M-4 2L1 2" />
        </g>
      );
    case "grid":
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M-8 12L-4 -10H4L8 12M-7 -2H7M-9 5H9M0 -10V-13" />
        </g>
      );
    case "home":
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M-11 0L0 -11L11 0" />
          <path d="M-8 -2V11H8V-2" />
          <path d="M-2 11V4H2V11" />
        </g>
      );
  }
}

const configs: Record<DiagramType, { nodes: Node[]; edges: Edge[]; boundary?: boolean }> = {
  "on-grid": {
    nodes: [
      { id: "sun", kind: "sun", x: 110, y: 70, label: "Sunlight" },
      { id: "panels", kind: "panels", x: 110, y: 200, label: "Solar Panels" },
      { id: "inverter", kind: "inverter", x: 340, y: 200, label: "Inverter" },
      { id: "grid", kind: "grid", x: 545, y: 70, label: "Utility Grid" },
      { id: "home", kind: "home", x: 680, y: 200, label: "Home / Load" },
    ],
    edges: [
      { from: "sun", to: "panels" },
      { from: "panels", to: "inverter" },
      { from: "inverter", to: "home" },
      { from: "inverter", to: "grid", accent: "lime" },
      { from: "grid", to: "home", accent: "amber", slow: true },
    ],
  },
  "off-grid": {
    nodes: [
      { id: "sun", kind: "sun", x: 110, y: 70, label: "Sunlight" },
      { id: "panels", kind: "panels", x: 110, y: 200, label: "Solar Panels" },
      { id: "inverter", kind: "inverter", x: 300, y: 200, label: "Inverter" },
      { id: "battery", kind: "battery", x: 480, y: 200, label: "Battery" },
      { id: "home", kind: "home", x: 660, y: 200, label: "Home / Load" },
    ],
    edges: [
      { from: "sun", to: "panels" },
      { from: "panels", to: "inverter" },
      { from: "inverter", to: "battery" },
      { from: "battery", to: "home" },
    ],
    boundary: true,
  },
  hybrid: {
    nodes: [
      { id: "sun", kind: "sun", x: 100, y: 70, label: "Sunlight" },
      { id: "panels", kind: "panels", x: 100, y: 205, label: "Solar Panels" },
      { id: "battery", kind: "battery", x: 335, y: 70, label: "Battery" },
      { id: "inverter", kind: "inverter", x: 335, y: 205, label: "Hybrid Inverter" },
      { id: "grid", kind: "grid", x: 565, y: 70, label: "Utility Grid" },
      { id: "home", kind: "home", x: 690, y: 205, label: "Home / Load" },
    ],
    edges: [
      { from: "sun", to: "panels" },
      { from: "panels", to: "inverter" },
      { from: "inverter", to: "battery", accent: "lime" },
      { from: "inverter", to: "grid", accent: "amber", slow: true },
      { from: "inverter", to: "home" },
    ],
  },
  bess: {
    nodes: [
      { id: "solar", kind: "solar", x: 110, y: 70, label: "Solar Input" },
      { id: "grid", kind: "grid", x: 110, y: 210, label: "Grid Input" },
      { id: "battery", kind: "battery", x: 400, y: 140, label: "BESS Storage" },
      { id: "home", kind: "home", x: 680, y: 140, label: "Backup / Load" },
    ],
    edges: [
      { from: "solar", to: "battery", accent: "lime" },
      { from: "grid", to: "battery", accent: "amber", slow: true },
      { from: "battery", to: "home" },
    ],
  },
};

const accentColor = { green: "#00AC4E", lime: "#a9d80c", amber: "#e0a000" } as const;

export default function SolarDiagram({ type }: { type: DiagramType }) {
  const cfg = configs[type];
  const byId = Object.fromEntries(cfg.nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${type} system diagram`}>
      <defs>
        <marker id={`arrow-${type}`} markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* off-grid boundary */}
      {cfg.boundary && (
        <rect
          x="58"
          y="150"
          width="660"
          height="100"
          rx="20"
          fill="none"
          stroke="#00AC4E"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
      )}

      {/* edges */}
      {cfg.edges.map((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        const color = accentColor[e.accent ?? "green"];
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" markerEnd={`url(#arrow-${type})`} />
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              className={`flow-line${e.slow ? " flow-line-slow" : ""}`}
            />
          </g>
        );
      })}

      {/* nodes */}
      {cfg.nodes.map((n) => {
        const big = type === "bess" && n.kind === "battery";
        const w = big ? 76 : 52;
        const h = big ? 60 : 52;
        return (
          <g key={n.id}>
            {/* pulse glow */}
            <circle cx={n.x} cy={n.y} r={big ? 40 : 30} fill="#00AC4E" opacity="0.06" />
            {/* chip */}
            <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <g transform={`translate(${n.x} ${n.y - (big ? 4 : 0)})`} className="text-[#00AC4E]">
              {glyph(n.kind)}
            </g>
            {/* bess charge bar */}
            {big && (
              <>
                <rect x={n.x - 26} y={n.y + 14} width="52" height="7" rx="3.5" fill="#e2e8f0" />
                <rect x={n.x - 26} y={n.y + 14} width="36" height="7" rx="3.5" fill="#00AC4E">
                  <animate attributeName="width" values="6;48;6" dur="4s" repeatCount="indefinite" />
                </rect>
              </>
            )}
            <text x={n.x} y={n.y + (big ? 44 : 40)} textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
