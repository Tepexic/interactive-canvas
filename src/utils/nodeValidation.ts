import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";
import { getIsolatedNodes, hasCycles } from "./graphTraversal";

/**
 * Validates flow connectivity using graph traversal utilities
 * Now supports both linear and complex flows
 */
export const validateFlowConnectivity = (
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): { isValid: boolean; error?: string } => {
  if (nodes.length === 0) {
    return { isValid: false, error: "No nodes in the flow" };
  }

  if (nodes.length === 1) {
    return { isValid: true }; // Single node is always valid
  }

  // Check for cycles using graph traversal utility
  if (hasCycles(nodes, edges)) {
    return {
      isValid: false,
      error: "Flow contains cycles. Cyclic dependencies are not allowed.",
    };
  }

  // Check for isolated nodes (optional - you can allow or disallow these)
  const isolatedNodes = getIsolatedNodes(nodes, edges);
  if (isolatedNodes.length > 0) {
    const isolatedNodeNames = isolatedNodes
      .map((node) => `"${node.data.label}"`)
      .join(", ");

    // You can choose to allow isolated nodes or not
    // For now, let's allow them but warn
    console.warn(
      `Isolated nodes found: ${isolatedNodeNames}. They will be executed independently.`
    );
  }

  return { isValid: true };
};
