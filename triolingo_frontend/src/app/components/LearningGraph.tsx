import { CheckCircle2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useMemo, useState, useRef, useCallback } from 'react';
import type { KnowledgeGraph } from '../api';

interface LearningGraphProps {
  graph: KnowledgeGraph;
  subtitle?: string;
}

interface LayoutNode {
  id: string;
  label: string;
  description: string;
  level: number;
  position: number;
  color: string;
}

interface LayoutEdge {
  from: string;
  to: string;
}

const STATUS_COLORS: Record<string, string> = {
  known: '#22c55e',
  weak: '#eab308',
  unknown: '#6b7280',
};

const LEVEL_SPACING = 220;
const ROW_SPACING = 130;
const OFFSET_X = 80;
const OFFSET_Y = 80;
const NODE_RADIUS = 24;

function getNodeCoords(node: LayoutNode) {
  return {
    x: node.level * LEVEL_SPACING + OFFSET_X,
    y: node.position * ROW_SPACING + OFFSET_Y,
  };
}

function computeLayout(graph: KnowledgeGraph): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const prereqEdges = graph.edges.filter(e => e.relationship === 'prerequisite');
  const inDegree: Record<string, number> = {};
  const children: Record<string, string[]> = {};

  for (const node of graph.nodes) {
    inDegree[node.id] = 0;
    children[node.id] = [];
  }
  for (const edge of prereqEdges) {
    if (inDegree[edge.target] !== undefined) {
      inDegree[edge.target]++;
    }
    if (children[edge.source]) {
      children[edge.source].push(edge.target);
    }
  }

  // BFS topological layering
  const level: Record<string, number> = {};
  const queue: string[] = [];
  for (const node of graph.nodes) {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
      level[node.id] = 0;
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    for (const child of (children[curr] ?? [])) {
      level[child] = Math.max(level[child] ?? 0, level[curr] + 1);
      inDegree[child]--;
      if (inDegree[child] === 0) {
        queue.push(child);
      }
    }
  }

  // Assign nodes without edges to level 0
  for (const node of graph.nodes) {
    if (level[node.id] === undefined) {
      level[node.id] = 0;
    }
  }

  // Group by level and assign positions
  const levelGroups: Record<number, string[]> = {};
  for (const node of graph.nodes) {
    const l = level[node.id];
    if (!levelGroups[l]) levelGroups[l] = [];
    levelGroups[l].push(node.id);
  }

  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
  const position: Record<string, number> = {};
  for (const ids of Object.values(levelGroups)) {
    ids.forEach((id, i) => { position[id] = i; });
  }

  const layoutNodes: LayoutNode[] = graph.nodes.map(n => ({
    id: n.id,
    label: n.label,
    description: `${n.type} · difficulty ${n.difficulty}`,
    level: level[n.id],
    position: position[n.id],
    color: STATUS_COLORS[n.status] ?? STATUS_COLORS.unknown,
  }));

  const layoutEdges: LayoutEdge[] = graph.edges.map(e => ({
    from: e.source,
    to: e.target,
  }));

  return { nodes: layoutNodes, edges: layoutEdges };
}

export function LearningGraph({ graph, subtitle }: LearningGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graph,       setGraph]       = useState<KnowledgeGraph | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useMemo(() => computeLayout(graph), [graph]);

  const canvasWidth = useMemo(() => {
    const maxLevel = Math.max(...nodes.map(n => n.level), 0);
    return maxLevel * LEVEL_SPACING + OFFSET_X * 2 + 160;
  }, [nodes]);

  const canvasHeight = useMemo(() => {
    const maxPos = Math.max(...nodes.map(n => n.position), 0);
    return maxPos * ROW_SPACING + OFFSET_Y * 2 + 60;
  }, [nodes]);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.min(Math.max(s * (e.deltaY > 0 ? 0.9 : 1.1), 0.3), 3));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node')) return;
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => { isPanning.current = false; }, []);

  // Call POST /personalize whenever config changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setGraph(null);

    fetch(`backend`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(configToProfile(config)),
    })
      .then(r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        return r.json() as Promise<KnowledgeGraph>;
      })
      .then(data => { setGraph(data); resetView(); })
      .catch(err => setError(`Could not load graph: ${err.message}`))
      .finally(() => setLoading(false));
  }, [config, resetView]);

  // Layout computed nodes
  const { nodes, edges } = (() => {
    if (!graph) return { nodes: [], edges: [] };
    return {
      nodes: layoutNodes(graph.nodes, graph.edges),
      edges: graph.edges,
    };
  })();

  const canvasW = nodes.length ? Math.max(...nodes.map(n => n.x)) + 200 : 600;
  const canvasH = nodes.length ? Math.max(...nodes.map(n => n.y)) + 140 : 400;

  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900/30 p-8">

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="mb-2">Your Personalized Learning Path</h2>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
          <p className="text-xs text-gray-600 mt-1">{nodes.length} concepts · {edges.length} connections</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale(s => Math.min(s * 1.2, 3))} className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors" title="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setScale(s => Math.max(s * 0.8, 0.3))} className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors" title="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={resetView} className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors" title="Reset view">
            <Maximize2 className="w-4 h-4" />
          </button>
          <span className="ml-2 text-xs text-gray-500 tabular-nums">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      <div
        className="relative bg-black rounded-lg border border-gray-800 overflow-hidden select-none"
        style={{ height: '520px', cursor: isPanning.current ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute bottom-3 left-3 text-xs text-gray-600 pointer-events-none z-10">
          Scroll to zoom · Drag to pan · Hover nodes for details
        </div>

        <div
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: canvasWidth,
            height: canvasHeight,
            position: 'absolute',
          }}
        >
          <svg
            width={canvasWidth}
            height={canvasHeight}
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
          >
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const { x: x1, y: y1 } = getNodeCoords(fromNode);
              const { x: x2, y: y2 } = getNodeCoords(toNode);

              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const ux = dx / dist;
              const uy = dy / dist;

              return (
                <line
                  key={idx}
                  x1={x1 + ux * NODE_RADIUS}
                  y1={y1 + uy * NODE_RADIUS}
                  x2={x2 - ux * NODE_RADIUS}
                  y2={y2 - uy * NODE_RADIUS}
                  stroke="#39ff14"
                  strokeWidth="1.5"
                  opacity="0.35"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const { x, y } = getNodeCoords(node);
            const isHovered = hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  className="graph-node absolute"
                  style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)', zIndex: isHovered ? 50 : 10 }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {isHovered ? (
                    <div
                      className="bg-black border-2 rounded-lg p-4 shadow-2xl"
                      style={{ borderColor: node.color, minWidth: '200px', boxShadow: `0 0 24px ${node.color}30` }}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: node.color }} />
                        <h3 className="font-medium text-sm leading-tight text-white">{node.label}</h3>
                      </div>
                      <p className="text-xs text-gray-400 capitalize mb-1">{node.type} · difficulty {node.difficulty}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{node.tags.join(', ')}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                        <span className="text-xs capitalize" style={{ color: statusColor }}>{node.status}</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded-full border-2 cursor-pointer hover:scale-110 transition-transform animate-pulse"
                      style={{
                        width:  NODE_RADIUS * 2,
                        height: NODE_RADIUS * 2,
                        borderColor:       node.color,
                        backgroundColor:   'rgba(0,0,0,0.85)',
                        boxShadow:         `0 0 18px ${node.color}50`,
                        animationDuration: '3s',
                        // outer ring reflects status
                        outline:      `2px solid ${statusColor}`,
                        outlineOffset: '3px',
                      }}
                    >
                      <div className="w-full h-full rounded-full opacity-20" style={{ backgroundColor: node.color }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <h3 className="font-medium mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { color: STATUS_COLORS.known, label: 'Known' },
            { color: STATUS_COLORS.weak, label: 'Weak' },
            { color: STATUS_COLORS.unknown, label: 'Unknown' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
