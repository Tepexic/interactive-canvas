import amazonLogo from "@/assets/amazon.webp";
import agentLogo from "@/assets/agent.png";
import gmailLogo from "@/assets/gmail.webp";
import slackLogo from "@/assets/slack.webp";
import type { BlockType } from "@/types/canvas";

export const SOME_NODES = [
  {
    id: "node-1",
    position: { x: 100, y: 150 },
    data: {
      id: "node-1",
      type: "gmail",
      label: "Gmail",
      purpose: "Email operations",
      config: {
        recipient: "test@jarvio.com",
        subject: "Test email",
        message: "Hello there",
      },
      color: "#ea4335",
      icon: gmailLogo,
      valid: true,
    },
    type: "default",
  },
  {
    id: "node-2",
    position: { x: 400, y: 150 },
    data: {
      id: "node-2",
      type: "slack",
      label: "Slack",
      purpose: "Team communication",
      color: "#4a154b",
      icon: slackLogo,
      config: {
        channel: "#news",
        message: "Hello there",
      },
      valid: true,
    },
    type: "default",
  },
  {
    id: "node-3",
    position: { x: 250, y: 50 },
    data: {
      id: "node-3",
      type: "ai",
      label: "AI Agent",
      purpose: "Turn sales data into plain English or recommendations",
      color: "#10b981",
      icon: agentLogo,
      config: {
        prompt: "Analyze the sales data and provide insights",
      },
      valid: true,
    },
    type: "default",
  },
  {
    id: "node-4",
    position: { x: 250, y: 250 },
    data: {
      id: "node-4",
      type: "amazon",
      label: "Amazon Sales Report",
      purpose: "Pull sales data",
      color: "#3b82f6",
      icon: amazonLogo,
      config: {
        metric: "Units Sold",
        timeframe: 7,
      },
      valid: true,
    },
    type: "default",
  },
];

export const SOME_EDGES = [
  {
    id: "edge-1",
    source: "node-1",
    target: "node-2",
    type: "default",
  },
];

export const BLOCK_TYPES: BlockType[] = [
  {
    type: "amazon",
    label: "Amazon Sales Report Block",
    purpose: "Pull sales data",
    config: {
      metric: "",
      timeframe: 0,
    },
    color: "#3b82f6",
    icon: amazonLogo,
  },
  {
    type: "ai",
    label: "AI Agent Block",
    purpose: "Turn sales data into plain English or recommendations",
    config: {
      prompt: "",
    },
    color: "#10b981",
    icon: agentLogo,
  },
  {
    type: "gmail",
    label: "Gmail Block",
    purpose: "Send an email",
    config: {
      recipient: "",
      subject: "",
      message: "",
    },
    color: "#f59e0b",
    icon: gmailLogo,
  },
  {
    type: "slack",
    label: "Slack Block",
    purpose: "Send a Slack message",
    config: {
      channel: "",
      message: "",
    },
    color: "#8b5cf6",
    icon: slackLogo,
  },
];
