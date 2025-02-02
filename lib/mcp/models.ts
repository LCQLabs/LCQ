/**
 * Model Context Protocol (MCP) types and error classes
 */

/**
 * Base MCP Error class
 */
export class McpError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'McpError';
    }
  }
  
  /**
   * Error for MCP request format issues
   */
  export class McpRequestError extends McpError {
    constructor(message: string) {
      super(message);
      this.name = 'McpRequestError';
    }
  }
  
  /**
   * Error for MCP connection issues
   */
  export class McpConnectionError extends McpError {
    constructor(message: string) {
      super(message);
      this.name = 'McpConnectionError';
    }
  }
  
  /**
   * Error for MCP timeout issues
   */
  export class McpTimeoutError extends McpError {
    constructor(message: string) {
      super(message);
      this.name = 'McpTimeoutError';
    }
  }
  
  /**
   * Error for MCP response issues
   */
  export class McpResponseError extends McpError {
    statusCode: number;
  
    constructor(message: string, statusCode: number = 0) {
      super(message);
      this.name = 'McpResponseError';
      this.statusCode = statusCode;
    }
  }
  
  /**
   * Error for MCP rate limit issues
   */
  export class McpRateLimitError extends McpResponseError {
    retryAfter?: number;
  
    constructor(message: string, retryAfter?: number) {
      super(message, 429);
      this.name = 'McpRateLimitError';
      this.retryAfter = retryAfter;
    }
  }
  
  /**
   * Error for MCP authentication issues
   */
  export class McpAuthError extends McpResponseError {
    constructor(message: string) {
      super(message, 401);
      this.name = 'McpAuthError';
    }
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
   * MCP Account Information structure
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
   * MCP Transaction structure
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
   * MCP Token Account structure
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
  
  export default {
    McpError,
    McpRequestError,
    McpConnectionError,
    McpTimeoutError,
    McpResponseError,
    McpRateLimitError,
    McpAuthError
  };