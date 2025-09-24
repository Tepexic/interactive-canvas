import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import { useCanvasStore } from "../../stores/canvasStore";
import { CanvasToolbar } from "./CanvasToolbar";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { ConfigurationModal } from "../modals/ConfigurationModal";
import type { CustomNodeData } from "@/types/canvas";

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
  } = useCanvasStore();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<CustomNodeData | null>(null);

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    // Open configuration modal with the node data
    const nodeData = node.data as CustomNodeData;
    setSelectedNodeData(nodeData);
    setIsModalOpen(true);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNodeData(null);
  };

  const handleModalSave = (config: Record<string, unknown>) => {
    if (selectedNodeData) {
      // Update the node configuration in the store
      updateNodeData(selectedNodeData.id, { config });
      handleModalClose();
    }
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
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
          }}
          className="bg-gray-50 dark:bg-gray-800"
        >
          <Background className="dark:opacity-20" />
          <Controls className="dark:bg-gray-700 dark:border-gray-600" />
          <MiniMap className="dark:bg-gray-700" />
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
