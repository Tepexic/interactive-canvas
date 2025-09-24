export interface BlockType {
  type: "amazon" | "gmail" | "ai" | "slack";
  label: string;
  purpose: string;
  config: Record<string, unknown>;
  color: string;
  icon: string;
}

export interface CustomNodeData extends BlockType, Record<string, unknown> {
  id: string; // Unique identifier for each node instance
}

export type AmazonBlockMetrics = "Revenue" | "Units Sold" | "Orders";
export type AmazonBlockTime = 7 | 30;
