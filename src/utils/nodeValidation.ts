import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";

/**
 * This function checks:
 * - Has nodes
 * - All nodes are connected in a single path
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

  const connectedNodes = new Set<string>();

  // Add all nodes that are part of edges
  edges.forEach((edge) => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  // Check if any nodes are isolated
  const isolatedNodes = nodes.filter((node) => !connectedNodes.has(node.id));

  if (isolatedNodes.length > 0) {
    const isolatedNodeNames = isolatedNodes
      .map((node) => `"${node.data.label}"`)
      .join(", ");
    return {
      isValid: false,
      error: `Isolated nodes found: ${isolatedNodeNames}. All nodes must be connected to the flow.`,
    };
  }

  // With React Flow's constraints, if all nodes are connected and we have edges,
  // then we must have a valid linear flow
  if (edges.length !== nodes.length - 1) {
    return {
      isValid: false,
      error:
        "Invalid flow structure. The flow must be a single connected path.",
    };
  }

  return { isValid: true };
};
