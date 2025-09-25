import { useState } from "react";
import {
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { BLOCK_TYPES } from "@/utils/constants";
import { DraggableNodeType } from "./DraggableNodeType";
import { useCanvasStore } from "@/stores/canvasStore";
import { useAlert } from "@/hooks/useAlert";
import { AlertDialog } from "@/components/modals/AlertDialog";

export function NodePalette() {
  const { setPlaying, isPlaying } = useCanvasStore();
  const { alertState, showError } = useAlert();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePlayClick = async () => {
    const result = await setPlaying(true);
    setIsCollapsed(true);
    if (!result.success && result.error) {
      showError("Cannot Start Flow", result.error);
    }
  };

  return (
    <div
      className={`
        w-full bg-gray-50 border-r border-gray-200 shadow-lg
        transition-all duration-300 ease-in-out z-10
        ${isCollapsed ? "h-12" : "h-55"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold text-gray-900 flex items-center">
          {isPlaying ? (
            <Cog6ToothIcon className="w-6 h-6 mr-2 animate-spin" />
          ) : (
            <ArrowTrendingUpIcon className="w-6 h-6 mr-2" />
          )}
          <span>Flow Builder</span>
        </h1>

        <div className="flex items-center space-x-3">
          {/* Collapsed state content */}
          {isCollapsed && (
            <div className="flex space-x-3 overflow-x-scroll">
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
          )}

          <button
            onClick={handlePlayClick}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            disabled={isPlaying}
          >
            <PlayIcon className="w-4 h-4 mr-1" />
            {isPlaying ? "Running..." : "Execute Flow"}
          </button>
          <button
            onClick={handleToggle}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Expand palette" : "Collapse palette"}
            disabled={isPlaying}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUpIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Node Types */}
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-100">
              <p className="text-sm text-gray-700">
                <strong>Drag & Drop:</strong> Drag any Block from this palette
                into your workflow.
              </p>
              <div className="p-3  rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  Total: {BLOCK_TYPES.length} block types available
                </p>
              </div>
            </div>
            <div className="flex w-full space-x-3 overflow-x-scroll py-2">
              {BLOCK_TYPES.map((blockType, index) => (
                <DraggableNodeType key={index} blockType={blockType} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        onClose={alertState.onClose}
      />
    </div>
  );
}
