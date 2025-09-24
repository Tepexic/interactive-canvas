import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";
import { useState, useCallback } from "react";
import { 
  TrashIcon, 
  Cog6ToothIcon, 
  ArrowsUpDownIcon 
} from "@heroicons/react/24/outline";
import { useCanvasStore } from "@/stores/canvasStore";

export function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData;
  const [isHovered, setIsHovered] = useState(false);
  
  const { deleteNode, toggleNodeHandles, setSelectedNode } = useCanvasStore();

  const relevantNodeInfo = (): string => {
    switch (nodeData.type) {
      case "gmail":
        return String(nodeData.config.recipient || "");
      case "amazon":
        return String(nodeData.config.metric || "");
      case "slack":
        return String(nodeData.config.channel || "");
      default:
        return "AI Agent";
    }
  };

  // Get handle positions based on orientation
  const getHandlePositions = () => {
    const orientation = nodeData.handleOrientation || "vertical";
    return orientation === "horizontal"
      ? { source: Position.Right, target: Position.Left }
      : { source: Position.Bottom, target: Position.Top };
  };

  const { source: sourcePosition, target: targetPosition } = getHandlePositions();

  // Button handlers
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(nodeData.id);
  }, [deleteNode, nodeData.id]);

  const handleConfigure = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(nodeData.id);
    // The Canvas component handles opening the modal when selectedNodeId changes
  }, [setSelectedNode, nodeData.id]);

  const handleToggleHandles = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNodeHandles(nodeData.id);
  }, [toggleNodeHandles, nodeData.id]);

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[150px] relative ${
        selected ? "border-blue-500" : "border-gray-200"
      }`}
      style={{ borderLeftColor: nodeData.color, borderLeftWidth: "4px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={targetPosition}
        className="w-16 !bg-teal-500"
      />

      <div className="flex items-center space-x-2">
        {nodeData.icon && (
          <img
            src={nodeData.icon}
            alt={nodeData.label}
            className="w-6 h-6 object-contain"
          />
        )}
        <div>
          <div className="text-sm font-medium text-gray-900">
            {nodeData.label}
          </div>
          <div className="text-xs text-gray-500">{relevantNodeInfo()}</div>
        </div>
      </div>

      <Handle
        type="source"
        position={sourcePosition}
        className="w-16 !bg-teal-500"
      />

      {/* Hover Configuration Panel */}
      <div
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-2 flex flex-col space-y-1 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-md p-1 border border-gray-200">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded text-red-600 hover:bg-red-50 transition-colors duration-200"
            aria-label="Delete node"
            title="Delete node"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          
          {/* Configure Button */}
          <button
            onClick={handleConfigure}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Configure node"
            title="Configure node"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
          
          {/* Handle Swap Button */}
          <button
            onClick={handleToggleHandles}
            className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Toggle handle orientation"
            title="Toggle handle orientation"
          >
            <ArrowsUpDownIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
