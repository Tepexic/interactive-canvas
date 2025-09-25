import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";
import { useState, useCallback } from "react";
import {
  TrashIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useCanvasStore } from "@/stores/canvasStore";
import { ConfirmationModal } from "../modals/ConfirmationModal";

export function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData;
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { deleteNode, setSelectedNode, edges, isPlaying } = useCanvasStore();

  const relevantNodeInfo = (): string => {
    switch (nodeData.type) {
      case "gmail":
        return String(nodeData.config.recipient || "");
      case "amazon":
        return nodeData.config.timeframe
          ? String(
              `${nodeData.config.metric} / ${nodeData.config.timeframe} Days` ||
                ""
            )
          : "";
      case "slack":
        return String(nodeData.config.channel || "");
      default:
        return String(nodeData.config.prompt || "");
    }
  };

  // Fixed handle positions - always left/right
  const sourcePosition = Position.Right;
  const targetPosition = Position.Left;

  // Helper function to count connected edges
  const getConnectedEdgesCount = () => {
    return edges.filter(
      (edge) => edge.source === nodeData.id || edge.target === nodeData.id
    ).length;
  };

  // Button handlers
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (isPlaying) return;
    deleteNode(nodeData.id);
    setShowDeleteConfirm(false);
  }, [deleteNode, nodeData.id]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleConfigure = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedNode(nodeData.id);
      // The Canvas component handles opening the modal when selectedNodeId changes
    },
    [setSelectedNode, nodeData.id]
  );

  const getStateIcon = () => {
    switch (nodeData.state) {
      case "idle":
        return <></>;
      case "running":
        return (
          <Cog6ToothIcon
            className="w-8 h-8 animate-spin"
            style={{ color: nodeData.color }}
          />
        );
      case "success":
        return <CheckIcon className="w-8 h-8 text-green-600" />;
      case "error":
        return <ExclamationCircleIcon className="w-8 h-8 text-red-600" />;
      default:
        return <></>;
    }
  };

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[200px] max-w-[300px] relative transition-all duration-300 ${
        selected ? "border-blue-500" : "border-gray-200"
      } ${
        nodeData.state === "running"
          ? "border-green-600 shadow-green-400/50 shadow-2xl"
          : ""
      }`}
      style={{ borderLeftColor: nodeData.color, borderLeftWidth: "4px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={targetPosition}
        id="target"
        className="w-4 h-4 !bg-blue-600"
      />

      <div className="flex items-center space-x-2">
        {nodeData.icon && (
          <img
            src={nodeData.icon}
            alt={nodeData.label}
            className="w-8 h-8 object-contain flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-left font-medium text-gray-900 truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-left text-gray-500 truncate">
            {relevantNodeInfo()}
          </div>
        </div>

        {nodeData.valid ? (
          getStateIcon()
        ) : (
          <div className="relative group">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Configuration needed, please add the missing fields
              {/* Tooltip arrow */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 rotate-180 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={sourcePosition}
        id="source"
        className="w-4 h-4 !bg-blue-600"
      />

      {/* Hover Configuration Panel */}
      <div
        className={`absolute right-0 top-0 transform -translate-y-full ml-2 space-y-1 transition-opacity duration-300 ${
          isHovered && !isPlaying
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-md p-1 border border-gray-200 flex">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-6 h-5 flex items-center justify-center rounded text-red-600 hover:bg-red-50 transition-colors duration-200"
            aria-label="Delete block"
            title="Delete block"
          >
            <TrashIcon className="w-4 h-4" />
          </button>

          {/* Configure Button */}
          <button
            onClick={handleConfigure}
            className="w-6 h-5 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Configure block"
            title="Configure block"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Block?"
        message={`Are you sure you want to delete "${nodeData.label}"?${
          getConnectedEdgesCount() > 0
            ? ` This action will also remove ${getConnectedEdgesCount()} connected edge(s).`
            : ""
        }`}
        confirmText="Delete Block"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
}
