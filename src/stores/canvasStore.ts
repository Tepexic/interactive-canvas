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
import { SOME_NODES, BLOCK_TYPES, SOME_EDGES } from "@/utils/constants";

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

export const useCanvasStore = create<CanvasState>((set, get) => ({
  isPlaying: false,
  nodes: [],
  edges: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as Node<CustomNodeData>[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
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
    set({
      nodes: [...get().nodes, newNode],
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    });
  },

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

  toggleNodeHandles: (nodeId) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                handleOrientation:
                  node.data.handleOrientation === "horizontal"
                    ? "vertical"
                    : "horizontal",
              },
            }
          : node
      ),
    });
  },

  // Playing state actions
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),
}));
