import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";
import { 
  saveCanvasState, 
  loadCanvasState, 
  debounce 
} from "@/utils/localStorage";

export interface CanvasState {
  isPlaying: boolean;
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Actions
  setNodes: (nodes: Node<CustomNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Omit<Node<CustomNodeData>, "id">) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void;
  setSelectedNode: (nodeId: string | null) => void;
  toggleNodeHandles: (nodeId: string) => void;
  togglePlaying: () => void;
  setPlaying: (playing: boolean) => void;
}

// Initialize store with saved data from localStorage
const initializeStore = () => {
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
const persistState = (nodes: Node<CustomNodeData>[], edges: Edge[]) => {
  saveCanvasState(nodes, edges);
};

// Debounced save for position changes (1 second delay)
const debouncedSave = debounce((nodes: Node<CustomNodeData>[], edges: Edge[]) => {
  persistState(nodes, edges);
}, 1000);

// Immediate save for critical operations
const immediateSave = (nodes: Node<CustomNodeData>[], edges: Edge[]) => {
  persistState(nodes, edges);
};

export const useCanvasStore = create<CanvasState>((set, get) => {
  const initialState = initializeStore();
  
  return {
    isPlaying: false,
    nodes: initialState.nodes,
    edges: initialState.edges,
    selectedNodeId: null,

    setNodes: (nodes) => {
      set({ nodes });
      immediateSave(nodes, get().edges);
    },
    
    setEdges: (edges) => {
      set({ edges });
      immediateSave(get().nodes, edges);
    },

    onNodesChange: (changes) => {
      const newNodes = applyNodeChanges(changes, get().nodes) as Node<CustomNodeData>[];
      set({ nodes: newNodes });
      
      // Check if any nodes were deleted (immediate save)
      const hasDeletedNodes = changes.some(change => change.type === 'remove');
      if (hasDeletedNodes) {
        immediateSave(newNodes, get().edges);
      } else {
        // Debounce for position changes and other updates
        debouncedSave(newNodes, get().edges);
      }
    },

    onEdgesChange: (changes) => {
      const newEdges = applyEdgeChanges(changes, get().edges);
      set({ edges: newEdges });
      // Immediate save for edge changes
      immediateSave(get().nodes, newEdges);
    },

    onConnect: (connection) => {
      const newEdges = addEdge(connection, get().edges);
      set({ edges: newEdges });
      // Immediate save for new connections
      immediateSave(get().nodes, newEdges);
    },

    addNode: (nodeData) => {
      const nodeId = `node-${Date.now()}`;
      const newNode: Node<CustomNodeData> = {
        id: nodeId,
        ...nodeData,
        data: {
          ...nodeData.data,
          id: nodeId, // Ensure the data.id matches the node.id
        },
      };
      const newNodes = [...get().nodes, newNode];
      set({ nodes: newNodes });
      // Immediate save for new nodes
      immediateSave(newNodes, get().edges);
    },

    deleteNode: (nodeId) => {
      const newNodes = get().nodes.filter((node) => node.id !== nodeId);
      const newEdges = get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      set({
        nodes: newNodes,
        edges: newEdges,
      });
      // Immediate save for deletions
      immediateSave(newNodes, newEdges);
    },

    deleteEdge: (edgeId) => {
      const newEdges = get().edges.filter((edge) => edge.id !== edgeId);
      set({ edges: newEdges });
      // Immediate save for deletions
      immediateSave(get().nodes, newEdges);
    },

    updateNodeData: (nodeId, newData) => {
      const newNodes = get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      );
      set({ nodes: newNodes });
      // Immediate save for configuration changes
      immediateSave(newNodes, get().edges);
    },

    setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

    toggleNodeHandles: (nodeId) => {
      const newNodes = get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                handleOrientation:
                  node.data.handleOrientation === "horizontal"
                    ? ("vertical" as const)
                    : ("horizontal" as const),
              },
            }
          : node
      ) as Node<CustomNodeData>[];
      set({ nodes: newNodes });
      // Immediate save for handle orientation changes
      immediateSave(newNodes, get().edges);
    },

    // Playing state actions (don't persist these)
    togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setPlaying: (playing) => set({ isPlaying: playing }),
  };
});
