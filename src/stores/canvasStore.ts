import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import type { CustomNodeData, BlockType } from "@/types/canvas";
import amazonLogo from "@/assets/amazon.webp";
import agentLogo from "@/assets/agent.png";
import gmailLogo from "@/assets/gmail.webp";
import slackLogo from "@/assets/slack.webp";

export const blockTypes: BlockType[] = [
  {
    type: "amazon",
    label: "Amazon Sales Report Block",
    purpose: "Pull sales data",
    config: {
      metric: "Units Sold",
      timeframe: 7,
    },
    color: "#3b82f6",
    icon: amazonLogo,
  },
  {
    type: "ai",
    label: "AI Agent Block",
    purpose: "Turn sales data into plain English or recommendations",
    config: {
      prompt: "",
    },
    color: "#10b981",
    icon: agentLogo,
  },
  {
    type: "gmail",
    label: "Gmail Block",
    purpose: "Send an email",
    config: {
      recipient: "",
      subject: "",
      message: "",
    },
    color: "#f59e0b",
    icon: gmailLogo,
  },
  {
    type: "slack",
    label: "Slack Block",
    purpose: "Send a Slack message",
    config: {
      channel: "",
      message: "",
    },
    color: "#8b5cf6",
    icon: slackLogo,
  },
];

export interface CanvasState {
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
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [
    {
      id: "node-1",
      position: { x: 100, y: 150 },
      data: {
        id: "node-1",
        type: "gmail",
        label: "Gmail",
        purpose: "Email operations",
        config: {
          recipient: "test@jarvio.com",
          subject: "Test email",
          message: "Hello there",
        },
        color: "#ea4335",
        icon: gmailLogo,
      },
      type: "default",
    },
    {
      id: "node-2",
      position: { x: 400, y: 150 },
      data: {
        id: "node-2",
        type: "slack",
        label: "Slack",
        purpose: "Team communication",
        color: "#4a154b",
        icon: slackLogo,
        config: {
          channel: "#news",
          message: "Hello there",
        },
      },
      type: "default",
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      type: "default",
    },
  ],
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
}));
