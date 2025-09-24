import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";

export interface PersistedCanvasState {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  version: string;
  timestamp: number;
}

export const CANVAS_STORAGE_KEY = "interactive-canvas-state";
export const STORAGE_VERSION = "1.0.0";

/**
 * Save canvas state to localStorage with error handling
 */
export const saveCanvasState = (nodes: Node<CustomNodeData>[], edges: Edge[]): void => {
  if (!checkStorageAvailable()) {
    console.warn("localStorage is not available, canvas state will not be saved");
    return;
  }

  try {
    const dataToSave: PersistedCanvasState = {
      nodes,
      edges,
      version: STORAGE_VERSION,
      timestamp: Date.now(),
    };
    const serialized = JSON.stringify(dataToSave);
    localStorage.setItem(CANVAS_STORAGE_KEY, serialized);
    console.log("✅ Canvas state saved successfully");
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn("localStorage quota exceeded, cannot save canvas state");
    } else {
      console.warn("Failed to save canvas state:", error);
    }
  }
};

/**
 * Load canvas state from localStorage with validation and error handling
 */
export const loadCanvasState = (): PersistedCanvasState | null => {
  if (!checkStorageAvailable()) {
    console.warn("localStorage is not available, starting with empty canvas");
    return null;
  }

  try {
    const stored = localStorage.getItem(CANVAS_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Validate data structure
    if (
      !parsed.nodes ||
      !parsed.edges ||
      !Array.isArray(parsed.nodes) ||
      !Array.isArray(parsed.edges) ||
      typeof parsed.version !== "string" ||
      typeof parsed.timestamp !== "number"
    ) {
      throw new Error("Invalid data structure");
    }

    // Validate each node has required properties
    for (const node of parsed.nodes) {
      if (!node.id || !node.data || typeof node.position !== "object") {
        throw new Error("Invalid node structure");
      }
    }

    // Validate each edge has required properties
    for (const edge of parsed.edges) {
      if (!edge.id || !edge.source || !edge.target) {
        throw new Error("Invalid edge structure");
      }
    }

    console.log("✅ Canvas state loaded successfully from localStorage");
    return parsed;
  } catch (error) {
    console.warn("Failed to load canvas state:", error);
    // Clear corrupted data
    clearCanvasState();
    return null;
  }
};

/**
 * Clear canvas state from localStorage
 */
export const clearCanvasState = (): void => {
  try {
    localStorage.removeItem(CANVAS_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear canvas state:", error);
  }
};

/**
 * Check if localStorage is available and working
 */
export const checkStorageAvailable = (): boolean => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce utility function for delayed saves
 */
export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};