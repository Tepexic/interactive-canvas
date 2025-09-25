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
import { initializeStore, immediateSave, debouncedSave } from "@/utils/persist";
import { validateFlowConnectivity } from "@/utils/nodeValidation";
import { getNodeExecutionOrder } from "@/utils/graphTraversal";
import {
  mockAIApiCall,
  mockAmazonApiCall,
  mockGmailApiCall,
  mockSlackApiCall,
} from "@/utils/mocks";

const apiCallMap: Record<string, any> = {
  amazon: mockAmazonApiCall,
  gmail: mockGmailApiCall,
  ai: mockAIApiCall,
  slack: mockSlackApiCall,
};

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
  setPlaying: (
    playing: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  processNodes: () => void;
}

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
      const newNodes = applyNodeChanges(
        changes,
        get().nodes
      ) as Node<CustomNodeData>[];
      set({ nodes: newNodes });

      // Check if any nodes were deleted (immediate save)
      const hasDeletedNodes = changes.some(
        (change) => change.type === "remove"
      );
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
      const nodes = get().nodes;
      const nodeIndex = nodes.findIndex((node) => node.id === nodeId);
      if (nodeIndex === -1) return;

      const newNodes = [...nodes];
      newNodes[nodeIndex] = {
        ...nodes[nodeIndex],
        data: { ...nodes[nodeIndex].data, ...newData },
      };

      set({ nodes: newNodes });
      immediateSave(newNodes, get().edges);
    },

    setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

    setPlaying: async (playing) => {
      if (!playing) {
        set({ isPlaying: false });
        return { success: true };
      }

      const nodes = get().nodes;
      const edges = get().edges;

      // Validate all nodes have valid data
      const invalidNode = nodes.find((node) => !node.data.valid);
      if (invalidNode) {
        set({ isPlaying: false });
        return {
          success: false,
          error: `Node "${invalidNode.data.label}" has invalid configuration. Please configure all nodes before starting.`,
        };
      }

      // Validate flow connectivity
      const flowValidation = validateFlowConnectivity(nodes, edges);
      if (!flowValidation.isValid) {
        set({ isPlaying: false });
        return {
          success: false,
          error: flowValidation.error || "Invalid flow connectivity",
        };
      }

      set({ isPlaying: true });
      get().processNodes();
      return { success: true };
    },

    processNodes: async () => {
      const nodes = get().nodes;
      const edges = get().edges;

      for (const node of nodes) {
        get().updateNodeData(node.id, { ...node.data, state: "idle" });
      }

      const orderedNodes = getNodeExecutionOrder(nodes, edges);

      // Process nodes in the correct order
      for (const node of orderedNodes) {
        const apiCall = apiCallMap[node.data.type];
        if (!apiCall) continue;

        try {
          get().updateNodeData(node.id, { ...node.data, state: "running" });
          await apiCall();
          get().updateNodeData(node.id, { ...node.data, state: "success" });
        } catch (e) {
          console.error(e);
          set({ isPlaying: false });
          get().updateNodeData(node.id, { ...node.data, state: "error" });
          break;
        }
      }

      set({ isPlaying: false });
    },
  };
});
