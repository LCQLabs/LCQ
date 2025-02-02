import { mcpConfig, getDefaultEndpoint, getEndpoint, getMethod, createMethodUrl } from '../../config/mcp-config';
import { McpRequestError, McpResponseError, McpTimeoutError } from './models';
import { handleMcpError, validateMethodResponse, formatMcpRequest } from './utils';

/**
 * Client for interacting with Model Context Protocol (MCP)
 */
export class McpClient {
  private apiKey: string;
  private endpointId: string;
  private options: {
    timeout: number;
    retryAttempts: number;
    debug: boolean;
  };

  /**
   * Create a new MCP client
   * @param apiKey MCP API key
   * @param endpointId Endpoint ID (defaults to the configured default)
   * @param options Client options
   */
  constructor(
    apiKey: string,
    endpointId?: string,
    options?: {
      timeout?: number;
      retryAttempts?: number;
      debug?: boolean;
    }
  ) {
    this.apiKey = apiKey;
    this.endpointId = endpointId || getDefaultEndpoint().id;
    this.options = {
      timeout: options?.timeout || mcpConfig.defaultTimeout,
      retryAttempts: options?.retryAttempts || mcpConfig.retryAttempts,
      debug: options?.debug || false
    };
  }

  /**
   * Execute an MCP method
   * @param methodId Method ID to execute
   * @param params Method parameters
   * @returns Method response data
   */
  public async execute(methodId: string, params: any): Promise<any> {
    const method = getMethod(methodId);
    if (!method) {
      throw new McpRequestError(`Unknown MCP method: ${methodId}`);
    }

    const endpoint = getEndpoint(this.endpointId) || getDefaultEndpoint();
    const url = createMethodUrl(endpoint.url, methodId);

    // Format the request with required metadata
    const request = formatMcpRequest(params, this.apiKey);

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < this.options.retryAttempts) {
      attempt++;
      
      try {
        if (this.options.debug) {
          console.debug(`MCP Request (${attempt}/${this.options.retryAttempts}):`, {
            method: methodId,
            url,
            params: { ...request, apiKey: '***' } // Mask the API key in logs
          });
        }

        // Execute the request with timeout
        const response = await this.executeWithTimeout(url, request);
        
        // Validate the response structure
        const validatedResponse = validateMethodResponse(response, methodId);
        
        if (this.options.debug) {
          console.debug('MCP Response:', validatedResponse);
        }

        return validatedResponse;
      } catch (error: any) {
        lastError = error;
        
        // Check if this error is retryable
        if (!this.isRetryableError(error) || attempt >= this.options.retryAttempts) {
          break;
        }
        
        // Wait before retry using exponential backoff
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }

    // If we reach here, all attempts failed
    throw handleMcpError(lastError || new Error('Unknown MCP error'));
  }

  /**
   * Execute request with timeout
   * @param url API endpoint URL
   * @param request Request payload
   * @returns Response data
   */
  private async executeWithTimeout(url: string, request: any): Promise<any> {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new McpTimeoutError(`MCP request timed out after ${this.options.timeout}ms`));
      }, this.options.timeout);
    });

    // Create the fetch promise
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    }).then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new McpResponseError(
          `MCP responded with status ${response.status}: ${errorText}`,
          response.status
        );
      }
      return response.json();
    });

    // Race the fetch against the timeout
    return Promise.race([fetchPromise, timeoutPromise]);
  }

  /**
   * Check if an error is retryable
   * @param error The error to check
   * @returns True if the error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Network errors are retryable
    if (error instanceof TypeError && error.message.includes('network')) {
      return true;
    }

    // Timeout errors are retryable
    if (error instanceof McpTimeoutError) {
      return true;
    }

    // Some HTTP status codes are retryable
    if (error instanceof McpResponseError) {
      const retryableCodes = [408, 429, 500, 502, 503, 504];
      return retryableCodes.includes(error.statusCode);
    }

    return false;
  }

  /**
   * Change the endpoint used by this client
   * @param endpointId New endpoint ID
   */
  public setEndpoint(endpointId: string): void {
    const endpoint = getEndpoint(endpointId);
    if (!endpoint) {
      throw new Error(`Unknown MCP endpoint: ${endpointId}`);
    }
    this.endpointId = endpointId;
  }

  /**
   * Update the API key used by this client
   * @param apiKey New API key
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Get the network status from MCP
   * @returns Network status information
   */
  public async getNetworkStatus(): Promise<any> {
    return this.execute('getHealth', {});
  }

  /**
   * Get cluster status for a specific network
   * @param cluster Network cluster (mainnet-beta, testnet, devnet)
   * @returns Cluster status information
   */
  public async getClusterStatus(cluster: string): Promise<any> {
    return this.execute('getClusterNodes', { cluster });
  }

  /**
   * Get account information
   * @param address Account address
   * @param encoding Response encoding (default: 'base64')
   * @returns Account information
   */
  public async getAccountInfo(
    address: string, 
    encoding: 'base64' | 'base58' | 'jsonParsed' = 'jsonParsed'
  ): Promise<any> {
    return this.execute('getAccountInfo', { address, encoding });
  }

  /**
   * Get program account data
   * @param programId Program ID
   * @param encoding Response encoding (default: 'base64')
   * @returns Program data
   */
  public async getProgramData(
    programId: string,
    encoding: 'base64' | 'base58' | 'jsonParsed' = 'jsonParsed'
  ): Promise<any> {
    return this.execute('getAccountInfo', { address: programId, encoding });
  }

  /**
   * Get transaction data
   * @param signature Transaction signature
   * @returns Transaction data
   */
  public async getTransaction(signature: string): Promise<any> {
    return this.execute('getTransaction', { signature });
  }

  /**
   * Get token accounts for a wallet address
   * @param owner Wallet address
   * @returns Token accounts
   */
  public async getTokenAccounts(owner: string): Promise<any> {
    return this.execute('getTokenAccounts', { owner });
  }

  /**
   * Get recent transaction signatures for an address
   * @param address Account address
   * @param limit Maximum number of signatures to return (default: 10)
   * @returns Transaction signatures
   */
  public async getSignaturesForAddress(address: string, limit: number = 10): Promise<any> {
    return this.execute('getSignaturesForAddress', { address, limit });
  }

  /**
   * Get version information for the MCP service
   * @returns Version information
   */
  public async getVersion(): Promise<any> {
    return this.execute('getVersion', {});
  }
}

export default McpClient;