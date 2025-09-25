import { useState } from "react";
import type { BlockType } from "@/types/canvas";

interface DraggableNodeTypeProps {
  blockType: BlockType;
}

export function DraggableNodeType({ blockType }: DraggableNodeTypeProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    // Store the block type data in the drag event
    event.dataTransfer.setData("application/json", JSON.stringify(blockType));
    event.dataTransfer.effectAllowed = "copy";
    
    // Create a custom drag image
    const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = "rotate(5deg)";
    dragImage.style.opacity = "0.8";
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 50, 25);
    
    // Clean up the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm
        hover:shadow-md hover:border-gray-300 cursor-grab active:cursor-grabbing
        transition-all duration-200 user-select-none
        ${isDragging ? "opacity-50 rotate-1" : "opacity-100"}
      `}
      style={{ backgroundColor: `${blockType.color}10` }} // Light tint of the block color
    >
      {/* Node Icon */}
      <div className="flex-shrink-0 mr-3">
        <img
          src={blockType.icon}
          alt={blockType.label}
          className="w-8 h-8 object-contain"
          draggable={false}
        />
      </div>

      {/* Node Information */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {blockType.label}
        </h3>
        <p className="text-xs text-gray-500 truncate mt-1">
          {blockType.purpose}
        </p>
      </div>

      {/* Color indicator */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
        style={{ backgroundColor: blockType.color }}
      />
    </div>
  );
}