import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "@/types/canvas";

/**
 * Performs topological sort on nodes based on their connections
 * Returns nodes in execution order (sources first, then their dependencies)
 */
export function getNodeExecutionOrder(
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const inDegree = new Map<string, number>();
  const outEdges = new Map<string, string[]>();

  // Initialize in-degree and out-edges maps
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    outEdges.set(node.id, []);
  });

  // Build the graph
  edges.forEach((edge) => {
    const sourceId = edge.source;
    const targetId = edge.target;

    // Increase in-degree of target
    inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);

    // Add target to source's out-edges
    const targets = outEdges.get(sourceId) || [];
    targets.push(targetId);
    outEdges.set(sourceId, targets);
  });

  // Find nodes with no incoming edges (starting points)
  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  const orderedNodes: Node<CustomNodeData>[] = [];
  const processedCount = new Set<string>();

  // Process nodes in topological order
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodeMap.get(currentId);

    if (currentNode) {
      orderedNodes.push(currentNode);
      processedCount.add(currentId);
    }

    // Process all nodes that depend on current node
    const targets = outEdges.get(currentId) || [];
    targets.forEach((targetId) => {
      const newInDegree = (inDegree.get(targetId) || 0) - 1;
      inDegree.set(targetId, newInDegree);

      if (newInDegree === 0) {
        queue.push(targetId);
      }
    });
  }

  return orderedNodes;
}

/**
 * Gets all paths from root nodes (no incoming edges) to leaf nodes (no outgoing edges)
 */
export function getAllExecutionPaths(
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): Node<CustomNodeData>[][] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const outEdges = new Map<string, string[]>();
  const inEdges = new Map<string, string[]>();

  // Initialize maps
  nodes.forEach((node) => {
    outEdges.set(node.id, []);
    inEdges.set(node.id, []);
  });

  // Build adjacency lists
  edges.forEach((edge) => {
    const sourceId = edge.source;
    const targetId = edge.target;

    outEdges.get(sourceId)?.push(targetId);
    inEdges.get(targetId)?.push(sourceId);
  });

  // Find root nodes (no incoming edges)
  const rootNodes = nodes.filter(
    (node) => (inEdges.get(node.id) || []).length === 0
  );

  const paths: Node<CustomNodeData>[][] = [];

  function dfs(nodeId: string, currentPath: Node<CustomNodeData>[]) {
    const node = nodeMap.get(nodeId);
    if (!node) return;

    const newPath = [...currentPath, node];
    const targets = outEdges.get(nodeId) || [];

    if (targets.length === 0) {
      // Leaf node - end of path
      paths.push(newPath);
    } else {
      // Continue to next nodes
      targets.forEach((targetId) => {
        dfs(targetId, newPath);
      });
    }
  }

  // Start DFS from each root node
  rootNodes.forEach((rootNode) => {
    dfs(rootNode.id, []);
  });

  return paths;
}

/**
 * Gets the next nodes that should be executed after the current node
 */
export function getNextNodes(
  currentNodeId: string,
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): Node<CustomNodeData>[] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return edges
    .filter((edge) => edge.source === currentNodeId)
    .map((edge) => nodeMap.get(edge.target))
    .filter((node): node is Node<CustomNodeData> => node !== undefined);
}

/**
 * Gets the previous nodes that lead to the current node
 */
export function getPreviousNodes(
  currentNodeId: string,
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): Node<CustomNodeData>[] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return edges
    .filter((edge) => edge.target === currentNodeId)
    .map((edge) => nodeMap.get(edge.source))
    .filter((node): node is Node<CustomNodeData> => node !== undefined);
}

/**
 * Checks if the flow has any cycles
 */
export function hasCycles(
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): boolean {
  const orderedNodes = getNodeExecutionOrder(nodes, edges);
  // If we can't order all nodes, there must be cycles
  return orderedNodes.length !== nodes.length;
}

/**
 * Gets all nodes that have no connections (isolated nodes)
 */
export function getIsolatedNodes(
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): Node<CustomNodeData>[] {
  const connectedNodes = new Set<string>();

  // Add all nodes that are part of edges
  edges.forEach((edge) => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  // Return nodes that are not connected
  return nodes.filter((node) => !connectedNodes.has(node.id));
}
