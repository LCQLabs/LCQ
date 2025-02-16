/**
 * Model Context Protocol (MCP) configuration
 * Defines settings and endpoints for MCP integration
 */

export interface McpEndpoint {
    id: string;
    name: string;
    url: string;
    description: string;
    isDefault?: boolean;
  }
  
  export interface McpMethod {
    id: string;
    name: string;
    description: string;
    requiresApiKey: boolean;
    rateLimitPerMinute: number;
  }
  
  export interface McpConfig {
    endpoints: McpEndpoint[];
    methods: McpMethod[];
    defaultTimeout: number;
    retryAttempts: number;
    rateLimitPerMinute: number;
  }
  
  // Define MCP endpoints
  const endpoints: McpEndpoint[] = [
    {
      id: 'lcq-default',
      name: 'LCQ MCP (Default)',
      url: 'https://mcp.lcq.gg/v1',
      description: 'Default MCP endpoint provided by LCQ',
      isDefault: true
    },
    {
      id: 'local-development',
      name: 'Local Development',
      url: 'http://localhost:3001/mcp',
      description: 'Local MCP server for development'
    },
    {
      id: 'custom',
      name: 'Custom Endpoint',
      url: '',
      description: 'Custom MCP endpoint (set in settings)'
    }
  ];
  
  // Define MCP methods
  const methods: McpMethod[] = [
    {
      id: 'getAccountInfo',
      name: 'Get Account Info',
      description: 'Fetch account information from Solana',
      requiresApiKey: true,
      rateLimitPerMinute: 60
    },
    {
      id: 'getBalance',
      name: 'Get Balance',
      description: 'Fetch SOL balance for an account',
      requiresApiKey: true,
      rateLimitPerMinute: 120
    },
    {
      id: 'getTransaction',
      name: 'Get Transaction',
      description: 'Fetch transaction details by signature',
      requiresApiKey: true,
      rateLimitPerMinute: 60
    },
    {
      id: 'getTokenAccounts',
      name: 'Get Token Accounts',
      description: 'Fetch token accounts for an owner',
      requiresApiKey: true,
      rateLimitPerMinute: 40
    },
    {
      id: 'getTokenBalance',
      name: 'Get Token Balance',
      description: 'Fetch token balance for a specific token account',
      requiresApiKey: true,
      rateLimitPerMinute: 120
    },
    {
      id: 'getProgramAccounts',
      name: 'Get Program Accounts',
      description: 'Fetch accounts owned by a program',
      requiresApiKey: true,
      rateLimitPerMinute: 20
    },
    {
      id: 'getSignaturesForAddress',
      name: 'Get Signatures For Address',
      description: 'Fetch transaction signatures for an address',
      requiresApiKey: true,
      rateLimitPerMinute: 30
    },
    {
      id: 'getClusterNodes',
      name: 'Get Cluster Nodes',
      description: 'Fetch list of nodes in the cluster',
      requiresApiKey: true,
      rateLimitPerMinute: 10
    },
    {
      id: 'getBlockTime',
      name: 'Get Block Time',
      description: 'Fetch estimated production time of a block',
      requiresApiKey: true,
      rateLimitPerMinute: 30
    },
    {
      id: 'getSlot',
      name: 'Get Slot',
      description: 'Fetch current slot in ledger',
      requiresApiKey: true,
      rateLimitPerMinute: 60
    },
    {
      id: 'getHealth',
      name: 'Get Health',
      description: 'Check RPC health status',
      requiresApiKey: false,
      rateLimitPerMinute: 120
    },
    {
      id: 'getVersion',
      name: 'Get Version',
      description: 'Fetch node version information',
      requiresApiKey: false,
      rateLimitPerMinute: 30
    }
  ];
  
  // MCP configuration
  export const mcpConfig: McpConfig = {
    endpoints,
    methods,
    defaultTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    rateLimitPerMinute: 180 // Overall rate limit
  };
  
  /**
   * Get a specific MCP endpoint by ID
   * @param id Endpoint ID
   * @returns The endpoint configuration or undefined if not found
   */
  export function getEndpoint(id: string): McpEndpoint | undefined {
    return mcpConfig.endpoints.find(endpoint => endpoint.id === id);
  }
  
  /**
   * Get the default MCP endpoint
   * @returns The default endpoint configuration
   */
  export function getDefaultEndpoint(): McpEndpoint {
    const defaultEndpoint = mcpConfig.endpoints.find(endpoint => endpoint.isDefault);
    return defaultEndpoint || mcpConfig.endpoints[0];
  }
  
  /**
   * Get a specific MCP method by ID
   * @param id Method ID
   * @returns The method configuration or undefined if not found
   */
  export function getMethod(id: string): McpMethod | undefined {
    return mcpConfig.methods.find(method => method.id === id);
  }
  
  /**
   * Create a URL for an MCP method
   * @param endpointUrl Base MCP endpoint URL
   * @param methodId Method ID to call
   * @returns Full URL for the MCP method
   */
  export function createMethodUrl(endpointUrl: string, methodId: string): string {
    return `${endpointUrl}/rpc/${methodId}`;
  }
  
  export default {
    config: mcpConfig,
    getEndpoint,
    getDefaultEndpoint,
    getMethod,
    createMethodUrl
  };