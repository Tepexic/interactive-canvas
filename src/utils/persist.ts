import type { Node, Edge } from "@xyflow/react";
import {
  saveCanvasState,
  loadCanvasState,
  debounce,
} from "@/utils/localStorage";
import type { CustomNodeData } from "@/types/canvas";

// Initialize store with saved data from localStorage
export const initializeStore = () => {
  const savedState = loadCanvasState();
  if (savedState) {
    return {
      nodes: savedState.nodes,
      edges: savedState.edges,
    };
  }

  return {
    nodes: [] as Node<CustomNodeData>[],
    edges: [] as Edge[],
  };
};

// Persistence helpers
export const persistState = (nodes: Node<CustomNodeData>[], edges: Edge[]) => {
  saveCanvasState(nodes, edges);
};

// Debounced save for position changes (4 second delay)
export const debouncedSave = debounce(
  (nodes: Node<CustomNodeData>[], edges: Edge[]) => {
    persistState(nodes, edges);
  },
  4000
);

// Immediate save for critical operations
export const immediateSave = (nodes: Node<CustomNodeData>[], edges: Edge[]) => {
  persistState(nodes, edges);
};
