/**
 * Type definitions for Model Context Protocol (MCP)
 */

/**
 * MCP Endpoint configuration
 */
export interface McpEndpoint {
    id: string;
    name: string;
    url: string;
    description: string;
    isDefault?: boolean;
  }
  
  /**
   * MCP Method definition
   */
  export interface McpMethod {
    id: string;
    name: string;
    description: string;
    requiresApiKey: boolean;
    rateLimitPerMinute: number;
  }
  
  /**
   * MCP Configuration
   */
  export interface McpConfig {
    endpoints: McpEndpoint[];
    methods: McpMethod[];
    defaultTimeout: number;
    retryAttempts: number;
    rateLimitPerMinute: number;
  }
  
  /**
   * MCP Request structure
   */
  export interface McpRequest {
    method: string;
    params: any;
    id: string;
    metadata: {
      apiKey: string;
      timestamp: number;
      clientId?: string;
      clientVersion?: string;
    };
  }
  
  /**
   * MCP Response structure
   */
  export interface McpResponse {
    result?: any;
    error?: {
      code: number;
      message: string;
      data?: any;
    };
    id: string;
    metadata?: {
      processingTime?: number;
      rateLimit?: {
        remaining: number;
        reset: number;
        limit: number;
      };
    };
  }
  
  /**
   * MCP Client configuration options
   */
  export interface McpClientOptions {
    timeout?: number;
    retryAttempts?: number;
    debug?: boolean;
    clientId?: string;
    clientVersion?: string;
  }
  
  /**
   * MCP Error types
   */
  export enum McpErrorType {
    REQUEST = 'request',
    CONNECTION = 'connection',
    TIMEOUT = 'timeout',
    RESPONSE = 'response',
    RATE_LIMIT = 'rate_limit',
    AUTH = 'auth',
    UNKNOWN = 'unknown'
  }
  
  /**
   * MCP Error interface
   */
  export interface McpErrorDetails {
    type: McpErrorType;
    message: string;
    statusCode?: number;
    retryAfter?: number;
    requestId?: string;
    data?: any;
  }
  
  /**
   * MCP Account Information
   */
  export interface McpAccountInfo {
    address: string;
    lamports: number;
    owner: string;
    executable: boolean;
    rentEpoch: number;
    data: string | any; // Can be encoded or parsed depending on encoding
    encoding: 'base58' | 'base64' | 'jsonParsed';
  }
  
  /**
   * MCP Token Account
   */
  export interface McpTokenAccount {
    address: string;
    programId: string;
    mint: string;
    owner: string;
    amount: string; // Token amount as string due to potential large numbers
    decimals: number;
    delegateOption: boolean;
    delegate?: string;
    state: 'initialized' | 'frozen' | 'uninitialized';
    isNative: boolean;
  }
  
  /**
   * MCP Transaction
   */
  export interface McpTransaction {
    slot: number;
    transaction: {
      signatures: string[];
      message: any;
    };
    meta: {
      fee: number;
      preBalances: number[];
      postBalances: number[];
      logMessages: string[];
      status: {
        Ok: null | any;
        Err: any;
      };
    };
    blockTime: number;
  }
  
  /**
   * MCP Health status
   */
  export interface McpHealth {
    status: 'ok' | 'error' | 'degraded';
    message?: string;
    uptime: number;
    timestamp: number;
    solana: {
      connected: boolean;
      slot: number;
      rpcLatency: number;
    };
  }
  
  /**
   * MCP Version information
   */
  export interface McpVersion {
    version: string;
    buildDate: string;
    commit: string;
    solanaRpcVersion: string;
  }
  
  /**
   * MCP Rate Limit Status
   */
  export interface McpRateLimitStatus {
    methodId: string;
    remaining: number;
    reset: number;
    limit: number;
    timestamp: number;
  }
  
  /**
   * MCP Rate Limit State
   */
  export type McpRateLimitState = Record<string, {
    count: number;
    resetTime: number;
  }>;
  
  /**
   * MCP Retry Strategy
   */
  export interface McpRetryStrategy {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    shouldRetry: (error: Error, attempt: number) => boolean;
    getDelay: (attempt: number) => number | null;
  }
  
  /**
   * MCP Client interface
   */
  export interface IMcpClient {
    execute(methodId: string, params: any): Promise<any>;
    setEndpoint(endpointId: string): void;
    setApiKey(apiKey: string): void;
    getNetworkStatus(): Promise<any>;
    getClusterStatus(cluster: string): Promise<any>;
    getAccountInfo(address: string, encoding?: 'base64' | 'base58' | 'jsonParsed'): Promise<any>;
    getProgramData(programId: string, encoding?: 'base64' | 'base58' | 'jsonParsed'): Promise<any>;
    getTransaction(signature: string): Promise<any>;
    getTokenAccounts(owner: string): Promise<any>;
    getSignaturesForAddress(address: string, limit?: number): Promise<any>;
    getVersion(): Promise<any>;
  }
  
  /**
   * MCP Access Context (for authentication and configuration)
   */
  export interface McpAccessContext {
    apiKey: string;
    endpointId: string;
    clientId?: string;
    clientVersion?: string;
  }
  
  /**
   * MCP Connection Status
   */
  export type McpConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';
  
  /**
   * MCP Connection Event
   */
  export type McpConnectionEvent = 'connect' | 'disconnect' | 'error' | 'rate_limit';
  
  /**
   * MCP Usage Statistics
   */
  export interface McpUsageStats {
    totalRequests: number;
    totalErrors: number;
    methodCounts: Record<string, number>;
    averageResponseTime: number;
    rateLimited: number;
    lastUsed: string;
  }
  
  /**
   * MCP Log Level
   */
  export type McpLogLevel = 'debug' | 'info' | 'warn' | 'error';
  
  /**
   * MCP Log Entry
   */
  export interface McpLogEntry {
    level: McpLogLevel;
    message: string;
    timestamp: string;
    data?: any;
    requestId?: string;
    methodId?: string;
  }