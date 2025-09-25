import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  ConnectionMode,
  type Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useEffect, useCallback } from "react";
import { useCanvasStore } from "../../stores/canvasStore";
import type { CustomNodeData, BlockType } from "../../types/canvas";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { ConfigurationModal } from "../modals/ConfigurationModal";
import { NodePalette } from "./NodePalette";

const nodeTypes = {
  default: CustomNode,
};

const edgeTypes = {
  default: CustomEdge,
};

function CanvasContent() {
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
    addNode,
  } = useCanvasStore();

  const { screenToFlowPosition } = useReactFlow();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] =
    useState<CustomNodeData | null>(null);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);

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

  // Drag and drop handlers
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      try {
        const blockTypeData = event.dataTransfer.getData("application/json");
        if (!blockTypeData) return;

        const blockType: BlockType = JSON.parse(blockTypeData);

        // Convert screen coordinates to flow coordinates
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Add the new node
        addNode({
          position,
          data: {
            id: "", // Will be set by addNode function
            ...blockType,
            valid: false,
            state: "idle",
          },
          type: "default",
        });
      } catch (error) {
        console.error("Error handling drop:", error);
      }
    },
    [addNode, screenToFlowPosition]
  );

  // Custom function to return node colors for minimap
  const getNodeColor = (node: Node<CustomNodeData>) => {
    return node.data?.color || "#6b7280"; // fallback to gray if no color
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Node Palette */}
      <NodePalette />
      <div
        className={`flex-1 transition-all duration-300 `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          connectionMode={ConnectionMode.Loose}
          fitView
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            animated: isPlaying,
          }}
          // Disable editing
          nodesDraggable={!isPlaying}
          nodesConnectable={!isPlaying}
          elementsSelectable={!isPlaying}
          className={`bg-gray-50 ${
            isDragOver ? "bg-blue-50 ring-2 ring-blue-300" : ""
          }`}
        >
          <Background />
          <Controls />
          <MiniMap nodeColor={getNodeColor} />

          {/* Drop zone indicator */}
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
                Drop here to add Block
              </div>
            </div>
          )}
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

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
}
