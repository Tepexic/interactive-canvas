import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";

export function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData;

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

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[200px] max-w-[280px] ${
        selected ? "border-blue-500" : "border-gray-200"
      }`}
      style={{ borderLeftColor: nodeData.color, borderLeftWidth: "4px" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-blue-600"
      />

      <div className="flex items-center space-x-3">
        {nodeData.icon && (
          <img
            src={nodeData.icon}
            alt={nodeData.label}
            className="w-8 h-8 object-contain flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {nodeData.label}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {relevantNodeInfo()}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-blue-600"
      />
    </div>
  );
}
