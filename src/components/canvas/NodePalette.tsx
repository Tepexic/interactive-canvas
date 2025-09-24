import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { BLOCK_TYPES } from "@/utils/constants";
import { DraggableNodeType } from "./DraggableNodeType";

interface NodePaletteProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export function NodePalette({ isVisible = true, onToggle }: NodePaletteProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 shadow-lg
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? "w-12" : "w-80"}
        ${!isVisible ? "translate-x-[-100%]" : "translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Node Palette</h2>
        )}
        <button
          onClick={handleToggle}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          title={isCollapsed ? "Expand palette" : "Collapse palette"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto h-full pb-20">
          {/* Instructions */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Drag & Drop:</strong> Drag any node type from this palette to the canvas to add it to your workflow.
            </p>
          </div>

          {/* Node Types */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Available Blocks
            </h3>
            {BLOCK_TYPES.map((blockType, index) => (
              <DraggableNodeType key={index} blockType={blockType} />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Total: {BLOCK_TYPES.length} block types available
            </p>
          </div>
        </div>
      )}

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="p-2 mt-4">
          <div className="space-y-2">
            {BLOCK_TYPES.map((blockType, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${blockType.color}20` }}
                title={blockType.label}
              >
                <img
                  src={blockType.icon}
                  alt={blockType.label}
                  className="w-5 h-5 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}