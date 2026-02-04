'use client';

import { useMemo } from 'react';
import cytoscape from 'cytoscape';

export function useSemanticGraph(
  layout: cytoscape.LayoutOptions,
  setHoveredNode: (node: {
    label: string;
    summary?: string;
    x: number;
    y: number;
  } | null) => void
) {
  return useMemo(() => {
    return {
      cy: (cy: cytoscape.Core) => {
        // ===== Zoom bounds =====
        cy.minZoom(0.6);
        cy.maxZoom(1.8);

        // ===== Initial fit AFTER layout =====
        const l = cy.layout(layout);
        l.run();

        l.one('layoutstop', () => {
          cy.fit(undefined, 40);
        });

        // ===== Optional: soft zoom correction =====
        cy.on('zoom', () => {
          const z = cy.zoom();
          if (z < 0.6) cy.zoom(0.6);
          if (z > 1.8) cy.zoom(1.8);
        });

        // ===== Hover logic (unchanged) =====
        cy.on('mouseover', 'node', (evt) => {
          const node = evt.target;
          const pos = evt.renderedPosition;

          setHoveredNode({
            label: node.data('label'),
            summary: node.data('summary'),
            x: pos.x,
            y: pos.y,
          });
        });

        cy.on('mouseout', 'node', () => setHoveredNode(null));
      },
    };
  }, [layout, setHoveredNode]);
}