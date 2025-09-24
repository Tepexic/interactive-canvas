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
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[150px] ${
        selected ? "border-blue-500" : "border-gray-200"
      }`}
      style={{ borderLeftColor: nodeData.color, borderLeftWidth: "4px" }}
    >
      <Handle
        type="target"
        position={Position.Top}
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
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
