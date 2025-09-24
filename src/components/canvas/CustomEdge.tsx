import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCanvasStore } from "../../stores/canvasStore";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const deleteEdge = useCanvasStore((state) => state.deleteEdge);

  const onEdgeClick = () => {
    deleteEdge(id);
  };

  return (
    <>
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,4 L6,2 z"
            fill="#6b7280"
            className="fill-gray-500 dark:fill-gray-400"
          />
        </marker>
      </defs>
      <BaseEdge
        path={edgePath}
        markerEnd={`url(#arrow-${id})`}
        style={{
          stroke: "#6b7280",
          strokeWidth: 2,
          ...style,
        }}
        className="stroke-gray-500 dark:stroke-gray-400"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button
            className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
            onClick={onEdgeClick}
            aria-label="Delete edge"
            style={{
              border: "none",
              cursor: "pointer",
            }}
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
