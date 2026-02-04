'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import type { AnalyzeResponse } from '@/types/analyze';
import { useSemanticGraph } from './useSemanticGraph';

cytoscape.use(fcose);

interface SemanticGraphProps {
  data: AnalyzeResponse;
}

export function SemanticGraph({ data }: SemanticGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<{
    label: string;
    summary?: string;
    x: number;
    y: number;
  } | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (data?.nodes?.length && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [data]);

  const layout = useMemo(
    () =>
      ({
        name: 'fcose',
        quality: 'proof',
        randomize: false,
        animate: true,
        animationDuration: 900,
        nodeDimensionsIncludeLabels: true,
        packComponents: false,
        nodeRepulsion: 26000,
        componentSpacing: 280,
        gravity: 0.02,
        idealEdgeLength: (edge: cytoscape.EdgeSingular) => {
          const s = edge.data('strength') as number;
          const t = Math.max(0, Math.min(1, (s - 0.5) / 0.5));
          const MIN = 30;
          const MAX = 150;
          return MAX - Math.pow(t, 1.8) * (MAX - MIN);
        },
        edgeElasticity: (edge: cytoscape.EdgeSingular) => {
          const s = edge.data('strength') as number;
          const t = Math.max(0, Math.min(1, (s - 0.5) / 0.5));
          return 0.05 + (1 - t) * 0.9;
        },
        numIter: 420,
        initialTemp: 300,
        coolingFactor: 0.97,
        minTemp: 0.5,
      }) as cytoscape.LayoutOptions,
    []
  );

  const elements: cytoscape.ElementDefinition[] = [
    ...data.nodes.map((node) => ({
      data: {
        id: String(node.id),
        label: node.label,
        importance: node.importance ?? 0.5,
        summary: node.summary,
      },
    })),
    ...data.edges.map((edge, index) => ({
      data: {
        id: `e-${index}`,
        source: String(data.nodes.find((n) => n.label === edge.from)?.id),
        target: String(data.nodes.find((n) => n.label === edge.to)?.id),
        strength: edge.strength,
        relation: edge.relation,
      },
    })),
  ];

  const graphLogic = useSemanticGraph(layout, setHoveredNode);

  return (
    <section ref={sectionRef} className="relative mt-12">
      <header className="mb-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
            Semantic Relationship Graph
          </h3>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 rounded bg-[#22c55e]" />
              <span>Strong</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 rounded bg-[#facc15]" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 rounded bg-[#ef4444]" />
              <span>Weak</span>
            </div>
          </div>
        </div>

        {data.document.tags?.length > 0 && (
          <div className="mt-3 flex items-center flex-wrap gap-2">
            <span className='text-xs'>Tags:</span>
            {data.document.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-700/70 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="
          relative h-[540px]
          rounded-2xl
          border border-zinc-800/80
          bg-gradient-to-b
          from-zinc-950/85
          via-zinc-950/80
          to-black/85
          backdrop-blur-[2px]
          shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_80px_rgba(0,0,0,0.7)]
          overflow-hidden
        "
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

        {hoveredNode && (
          <div
            className="
              absolute z-20
              max-w-xs
              rounded-xl
              border border-zinc-700/70
              bg-zinc-950/95
              backdrop-blur-md
              px-4 py-3
              shadow-[0_10px_40px_rgba(0,0,0,0.6)]
              pointer-events-none
            "
            style={{
              left: hoveredNode.x + 16,
              top: hoveredNode.y + 16,
            }}
          >
            <div className="text-sm font-semibold text-zinc-100">
              {hoveredNode.label}
            </div>
            {hoveredNode.summary && (
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {hoveredNode.summary}
              </p>
            )}
          </div>
        )}

        <CytoscapeComponent
          elements={elements}
          layout={layout}
          style={{ width: '100%', height: '100%' }}
          {...graphLogic}
          stylesheet={[
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                width: 'label',
                height: 'label',
                'min-width': '64px',
                'min-height': '44px',
                'background-color': '#1f2933',
                'border-color': '#3f3f46',
                'border-width': 'mapData(importance, 0, 1, 1px, 2.5px)',
                color: '#f9fafb',
                'font-size': 'mapData(importance, 0, 1, 12px, 16px)',
                'font-weight': 'bold',
                'text-wrap': 'wrap',
                'text-max-width': '140px',
                'text-valign': 'center',
                'text-halign': 'center',
                shape: 'roundrectangle',
                padding: '14px',
              },
            },
            {
              selector: 'node:hover',
              style: {
                'background-color': '#2a2a2e',
                'border-color': '#e5e7eb',
                'border-width': '3px',
                'overlay-color': '#ffffff',
                'overlay-opacity': 0.18,
                'overlay-padding': '0px',
              },
            },
            { selector: 'edge[strength < 0.575]', style: { width: 2, 'line-color': '#ef4444', opacity: 0.7 } },
            { selector: 'edge[strength >= 0.575][strength < 0.65]', style: { width: 3, 'line-color': '#fb923c', opacity: 0.75 } },
            { selector: 'edge[strength >= 0.65][strength < 0.725]', style: { width: 4, 'line-color': '#facc15', opacity: 0.8 } },
            { selector: 'edge[strength >= 0.725][strength < 0.80]', style: { width: 5, 'line-color': '#fde047', opacity: 0.85 } },
            { selector: 'edge[strength >= 0.80][strength < 0.87]', style: { width: 6, 'line-color': '#a3e635', opacity: 0.9 } },
            { selector: 'edge[strength >= 0.87]', style: { width: 8, 'line-color': '#22c55e', opacity: 0.95 } },
            { selector: 'edge:not(:hover)', style: { label: '' } },
          ]}
        />
      </div>
    </section>
  );
}