import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "../../stores/canvasStore";
import { CanvasToolbar } from "./CanvasToolbar";
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
    </div>
  );
}
