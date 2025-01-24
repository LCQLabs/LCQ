/**
 * Type definitions for LCQ Agents
 */

import { McpClient } from '../lib/mcp/client';
import { AgentType } from '../config/agent-config';

/**
 * Response object from an agent
 */
export interface AgentResponse {
  text: string;  // Text response to display to the user
  data?: any;    // Optional structured data from the response
  [key: string]: any;  // Additional fields specific to agent types
}

/**
 * Base interface for all agent types
 */
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  isCustom: boolean;
  
  // Methods
  processMessage(message: string, context?: Record<string, any>): Promise<AgentResponse>;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
  reset(): Promise<void>;
  
  // Getters and setters
  getId(): string;
  getName(): string;
  setName(name: string): void;
  getType(): AgentType;
  getOptions(): Record<string, any>;
  updateOptions(options: Record<string, any>): void;
  isCustomAgent(): boolean;
  setCustom(isCustom: boolean): void;
  saveState(): Record<string, any>;
  loadState(state: Record<string, any>): void;
  getDescription(): string;
  getCapabilities(): any[];
}

/**
 * Agent factory interface
 */
export interface AgentFactory {
  createAgent(
    type: AgentType,
    id?: string,
    name?: string,
    options?: Record<string, any>
  ): Agent;
  
  loadAgent(agentData: any): Agent;
  cloneAgent(agent: Agent, newId?: string, newName?: string): Agent;
}

/**
 * Agent manager interface for handling multiple agents
 */
export interface AgentManager {
  createAgent(
    type: AgentType,
    name?: string,
    options?: Record<string, any>
  ): Promise<Agent>;
  
  getAgent(id: string): Agent | undefined;
  getAllAgents(): Agent[];
  deleteAgent(id: string): boolean;
  saveAgents(): Promise<void>;
  loadAgents(): Promise<void>;
  getAgentsByType(type: AgentType): Agent[];
  getDefaultAgent(type: AgentType): Agent;
}

/**
 * Agent hook return type
 */
export interface UseAgentResult {
  agent?: Agent;
  agents?: Agent[];
  loading: boolean;
  error?: Error;
  createAgent: (type: AgentType, name?: string, options?: Record<string, any>) => Promise<Agent>;
  deleteAgent: (id: string) => boolean;
  resetAgent: (id: string) => Promise<void>;
}

/**
 * Agent conversation message
 */
export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'error';
  content: string;
  timestamp: string;
  data?: any;
  agentId?: string;
  attachment?: {
    name: string;
    type: string;
    url?: string;
  };
}

/**
 * Agent conversation
 */
export interface AgentConversation {
  id: string;
  agentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AgentMessage[];
  status: 'active' | 'archived' | 'deleted';
}

/**
 * Agent conversation hook return type
 */
export interface UseAgentConversationResult {
  conversation?: AgentConversation;
  messages: AgentMessage[];
  loading: boolean;
  error?: Error;
  sendMessage: (content: string) => Promise<AgentMessage>;
  addMessage: (message: Partial<AgentMessage>) => void;
  clearMessages: () => void;
  isProcessing: boolean;
}

/**
 * Transaction Optimizer agent specific interfaces
 */
export namespace TransactionOptimizer {
  export interface NetworkStatus {
    baseFee: number;
    congestionLevel: string;
    currentSlot: number;
    averageBlockTime: number;
    transactionsPerSecond: number;
  }
  
  export interface OptimizationResult {
    baseFee: number;
    congestionLevel: string;
    recommendations: {
      economical: {
        fee: number;
        estimatedTime: string;
        success: string;
      };
      standard: {
        fee: number;
        estimatedTime: string;
        success: string;
      };
      priority: {
        fee: number;
        estimatedTime: string;
        success: string;
      };
    };
    batchRecommendation?: {
      optimal: number;
      savings: string;
    };
    bestTimeWindows: Array<{
      start: string;
      end: string;
      congestion: string;
    }>;
  }
}

/**
 * Program Deployment agent specific interfaces
 */
export namespace ProgramDeployment {
  export interface DeploymentOptions {
    network: string;
    keypairPath: string;
    programPath: string;
    upgradeAuthority?: string;
    bufferAuthority?: string;
  }
  
  export interface EnvironmentInfo {
    name: string;
    purpose: string;
    endpoints: string[];
    explorer: string;
    airdrop: boolean;
    stability: string;
    reset: string;
    cost: string;
  }
}

/**
 * Account Analyzer agent specific interfaces
 */
export namespace AccountAnalyzer {
  export interface AccountSummary {
    address: string;
    solBalance: number;
    solValue: number;
    tokensValue: number;
    totalValue: number;
    age: string;
    lastActivity: string;
    transactionCount: number;
    tokenCount: number;
  }
  
  export interface TokenInfo {
    mint: string;
    amount: number;
    symbol: string;
    usdValue: number;
  }
}

/**
 * Smart Contract Auditor agent specific interfaces
 */
export namespace SmartContractAuditor {
  export interface AuditFinding {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    title: string;
    description: string;
    location: string;
    recommendation: string;
  }
  
  export interface AuditResult {
    programId: string;
    name: string;
    programType: string;
    lastUpdate: string;
    verified: boolean;
    findings: AuditFinding[];
    stats: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
    };
  }
}

/**
 * Data Scraper agent specific interfaces
 */
export namespace DataScraper {
  export interface ScrapingOptions {
    startTime?: string;
    endTime?: string;
    limit?: number;
    filter?: Record<string, any>;
    exportFormat?: 'csv' | 'json';
  }
  
  export interface ScrapingResult {
    query: string;
    resultCount: number;
    format: 'csv' | 'json';
    data: any[];
    stats: Record<string, any>;
  }
  
  export interface Report {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    status: 'complete' | 'running' | 'error';
    query: string;
    resultCount: number;
  }
}