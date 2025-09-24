import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useEffect } from "react";
import { useCanvasStore } from "../../stores/canvasStore";
import { CanvasToolbar } from "./CanvasToolbar";
import type { CustomNodeData } from "../../types/canvas";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { ConfigurationModal } from "../modals/ConfigurationModal";

const nodeTypes = {
  default: CustomNode,
};

const edgeTypes = {
  default: CustomEdge,
};

export default function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    updateNodeData,
    selectedNodeId,
    isPlaying,
  } = useCanvasStore();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] =
    useState<CustomNodeData | null>(null);

  // Effect to open modal when a node is selected (from hover panel or click)
  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        const nodeData = node.data as CustomNodeData;
        setSelectedNodeData(nodeData);
        setIsModalOpen(true);
      }
    }
  }, [selectedNodeId, nodes]);

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNodeData(null);
    setSelectedNode(null); // Clear the selected node
  };

  const handleModalSave = (config: Record<string, unknown>) => {
    if (selectedNodeData) {
      // Update the node configuration in the store
      updateNodeData(selectedNodeData.id, { config, valid: true });
      handleModalClose();
    }
  };

  // Custom function to return node colors for minimap
  const getNodeColor = (node: Node<CustomNodeData>) => {
    return node.data?.color || "#6b7280"; // fallback to gray if no color
  };

  return (
    <div className="w-full h-full flex flex-col">
      <CanvasToolbar />
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{}}
          // Disable editing
          nodesDraggable={!isPlaying}
          nodesConnectable={!isPlaying}
          elementsSelectable={!isPlaying}
          className="bg-gray-50 "
        >
          <Background />
          <Controls />
          <MiniMap nodeColor={getNodeColor} />
        </ReactFlow>
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal
        isOpen={isModalOpen}
        blockData={selectedNodeData}
        onSave={handleModalSave}
        onClose={handleModalClose}
      />
    </div>
  );
}
