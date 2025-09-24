import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  PlayIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useCanvasStore } from "@/stores/canvasStore";
import { BLOCK_TYPES } from "@/utils/constants";
import type { BlockType } from "@/types/canvas";
import { AlertDialog } from "@/components/modals/AlertDialog";
import { useAlert } from "@/hooks/useAlert";

export function CanvasToolbar() {
  const { addNode, setPlaying, togglePalette, isPaletteVisible } = useCanvasStore();
  const { alertState, showError, closeAlert } = useAlert();

  const handleAddNode = (block: BlockType) => {
    // Get current nodes to position new node to the right
    const { nodes } = useCanvasStore.getState();
    const rightmostX =
      nodes.length > 0
        ? Math.max(...nodes.map((node) => node.position.x)) + 300
        : 100;

    addNode({
      position: {
        x: rightmostX,
        y: 150, // Keep consistent vertical alignment
      },
      data: {
        id: "", // Will be set by addNode function
        ...block,
        valid: false,
        state: "idle",
      },
      type: "default",
    });
  };

  const handlePlayClick = async () => {
    const result = await setPlaying(true);

    if (!result.success && result.error) {
      showError("Cannot Start Flow", result.error);
    }
  };

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white flex items-center">
            <ArrowTrendingUpIcon className="w-6 h-6 mr-2" />
            Flow Builder
          </h1>

          <div className="flex items-center space-x-2">
            {/* Palette Toggle Button */}
            <button
              onClick={togglePalette}
              className={`
                inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
                ${isPaletteVisible 
                  ? "border-indigo-500 text-indigo-200 bg-indigo-600 hover:bg-indigo-700" 
                  : "border-gray-300 text-gray-200 bg-gray-700 hover:bg-gray-600"
                }
              `}
              title={isPaletteVisible ? "Hide Node Palette" : "Show Node Palette"}
            >
              <Squares2X2Icon className="w-4 h-4 mr-1" />
              Palette
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ocus:ring-indigo-400">
                <PlusIcon className="w-4 h-4 mr-1" />
                Block
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-gray-800 shadow-lg ring-1 ring-gray-600 ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {BLOCK_TYPES.map((blockType, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <button
                            onClick={() => handleAddNode(blockType)}
                            className={`${
                              active
                                ? "bg-gray-700 text-white"
                                : "text-gray-200"
                            } group flex items-center px-4 py-2 text-sm w-full text-left`}
                          >
                            <span className="mr-3">
                              <img
                                src={blockType.icon}
                                alt={blockType.label}
                                className="w-5 h-5 object-contain"
                              />
                            </span>
                            <div>
                              <div className="font-medium">
                                {blockType.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {blockType.purpose}
                              </div>
                            </div>
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <button
              onClick={handlePlayClick}
              className="inline-flex items-center px-3 py-2 border border-green-600 shadow-sm text-sm leading-4 font-medium rounded-md text-green-400 bg-gray-700 hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              <PlayIcon className="w-4 h-4 mr-1" />
              Execute Flow
            </button>
          </div>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        showCancel={alertState.showCancel}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel || closeAlert}
      />
    </>
  );
}
