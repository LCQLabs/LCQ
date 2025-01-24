/**
 * Agent configuration settings for the LCQ application
 * Defines agent types, capabilities, and default settings
 */

export type AgentType = 
  | 'transaction-optimizer'
  | 'program-deployment'
  | 'account-analyzer'
  | 'smart-contract-auditor'
  | 'data-scraper';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  requiresMcp: boolean;
  defaultEnabled: boolean;
}

export interface AgentTypeConfig {
  id: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  defaultSettings: Record<string, any>;
  icon: string;
}

// Define capabilities for each agent type
const capabilities: Record<AgentType, AgentCapability[]> = {
  'transaction-optimizer': [
    {
      id: 'fee-optimization',
      name: 'Fee Optimization',
      description: 'Analyze network congestion and recommend optimal fees',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'timing-optimization',
      name: 'Timing Optimization',
      description: 'Recommend optimal times to send transactions',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'batch-optimization',
      name: 'Batch Optimization',
      description: 'Optimize multiple transactions by batching instructions',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'historical-analysis',
      name: 'Historical Analysis',
      description: 'Analyze past fee patterns to predict future trends',
      requiresMcp: true,
      defaultEnabled: true,
    }
  ],
  'program-deployment': [
    {
      id: 'deployment-assistance',
      name: 'Deployment Assistance',
      description: 'Guide through program deployment process',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'environment-management',
      name: 'Environment Management',
      description: 'Manage deployments across devnet, testnet, and mainnet',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'upgrade-management',
      name: 'Upgrade Management',
      description: 'Assist with program upgrades and migrations',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'code-verification',
      name: 'Code Verification',
      description: 'Verify deployed program matches local code',
      requiresMcp: true,
      defaultEnabled: false,
    }
  ],
  'account-analyzer': [
    {
      id: 'balance-analysis',
      name: 'Balance Analysis',
      description: 'Analyze SOL and token balances',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'transaction-history',
      name: 'Transaction History',
      description: 'Review and analyze transaction history',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'token-holdings',
      name: 'Token Holdings',
      description: 'Analyze SPL token holdings and valuations',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'program-interactions',
      name: 'Program Interactions',
      description: 'Review program interactions and contracts',
      requiresMcp: true,
      defaultEnabled: true,
    }
  ],
  'smart-contract-auditor': [
    {
      id: 'vulnerability-detection',
      name: 'Vulnerability Detection',
      description: 'Identify common vulnerabilities in Solana programs',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'code-optimization',
      name: 'Code Optimization',
      description: 'Recommend optimizations for compute units and efficiency',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'security-best-practices',
      name: 'Security Best Practices',
      description: 'Check adherence to security best practices',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'audit-report-generation',
      name: 'Audit Report Generation',
      description: 'Generate detailed audit reports with findings and recommendations',
      requiresMcp: true,
      defaultEnabled: true,
    }
  ],
  'data-scraper': [
    {
      id: 'transaction-scraping',
      name: 'Transaction Scraping',
      description: 'Collect and analyze transaction data',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'token-transfer-analysis',
      name: 'Token Transfer Analysis',
      description: 'Track and analyze token transfers',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'program-activity-monitoring',
      name: 'Program Activity Monitoring',
      description: 'Monitor activity for specific programs',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'market-data-collection',
      name: 'Market Data Collection',
      description: 'Collect and analyze market data',
      requiresMcp: true,
      defaultEnabled: true,
    },
    {
      id: 'report-generation',
      name: 'Report Generation',
      description: 'Generate CSV and JSON reports of collected data',
      requiresMcp: false,
      defaultEnabled: true,
    }
  ]
};

// Define agent type configurations
export const agentConfigs: AgentTypeConfig[] = [
  {
    id: 'transaction-optimizer',
    name: 'Transaction Optimizer',
    description: 'Helps users optimize transaction fees based on network congestion and recommended fee structures',
    capabilities: capabilities['transaction-optimizer'],
    defaultSettings: {
      historyDepth: 1000, // Number of blocks to analyze
      updateFrequency: 60, // Update interval in seconds
      priorityLevels: {
        fast: 3, // Seconds
        standard: 12 // Seconds
      }
    },
    icon: 'optimization'
  },
  {
    id: 'program-deployment',
    name: 'Program Deployment Assistant',
    description: 'Automates and assists developers in deploying Solana programs across environments',
    capabilities: capabilities['program-deployment'],
    defaultSettings: {
      environments: ['devnet', 'testnet', 'mainnet-beta'],
      defaultEnvironment: 'devnet',
      cacheDeployments: true
    },
    icon: 'deployment'
  },
  {
    id: 'account-analyzer',
    name: 'Account Analyzer',
    description: 'Helps users analyze Solana accounts, providing insights into balances, token distributions, and transaction histories',
    capabilities: capabilities['account-analyzer'],
    defaultSettings: {
      analysisDepth: 90, // Days of history to analyze
      tokenPriceSource: 'jupiter', // Price oracle to use
      saveAccountHistory: true
    },
    icon: 'analyze'
  },
  {
    id: 'smart-contract-auditor',
    name: 'Smart Contract Auditor',
    description: 'Audits Solana smart contracts to identify vulnerabilities, inefficiencies, and provide optimization suggestions',
    capabilities: capabilities['smart-contract-auditor'],
    defaultSettings: {
      auditDepth: 'standard', // 'basic', 'standard', or 'deep'
      includeBestPractices: true,
      includeOptimizations: true,
      saveAuditHistory: true
    },
    icon: 'audit'
  },
  {
    id: 'data-scraper',
    name: 'Data Scraper',
    description: 'Scrapes data from Solana for reporting purposes, including token transfers, program interactions, and market data',
    capabilities: capabilities['data-scraper'],
    defaultSettings: {
      maxDataPoints: 10000,
      exportFormats: ['csv', 'json'],
      defaultExportFormat: 'csv',
      saveQueries: true
    },
    icon: 'data'
  }
];

/**
 * Get configuration for a specific agent type
 * @param agentType The type of agent to get configuration for
 * @returns The agent configuration or undefined if not found
 */
export function getAgentConfig(agentType: AgentType): AgentTypeConfig | undefined {
  return agentConfigs.find(config => config.id === agentType);
}

/**
 * Get all available agent types
 * @returns Array of agent type IDs
 */
export function getAgentTypes(): AgentType[] {
  return agentConfigs.map(config => config.id);
}

export default {
  agentConfigs,
  getAgentConfig,
  getAgentTypes
};