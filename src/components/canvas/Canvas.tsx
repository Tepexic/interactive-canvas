import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "../../stores/canvasStore";
import { CanvasToolbar } from "./CanvasToolbar";
import type { CustomNodeData } from "../../types/canvas";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";

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
  } = useCanvasStore();

  const onNodeClick = (_event: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
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
          className="bg-gray-50 "
        >
          <Background />
          <Controls />
          <MiniMap nodeColor={getNodeColor} className="dark:bg-gray-700" />
        </ReactFlow>
      </div>
    </div>
  );
}
