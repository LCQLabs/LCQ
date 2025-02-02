import {
    McpError,
    McpRequestError,
    McpConnectionError,
    McpResponseError,
    McpRateLimitError,
    McpAuthError,
    McpResponse
  } from './models';
  
  /**
   * Format an MCP request with required metadata
   * @param params Request parameters
   * @param apiKey API key for authentication
   * @param clientId Optional client identifier
   * @param clientVersion Optional client version
   * @returns Formatted request object
   */
  export function formatMcpRequest(
    params: any,
    apiKey: string,
    clientId?: string,
    clientVersion?: string
  ): any {
    return {
      params,
      id: generateRequestId(),
      metadata: {
        apiKey,
        timestamp: Date.now(),
        ...(clientId ? { clientId } : {}),
        ...(clientVersion ? { clientVersion } : {})
      }
    };
  }
  
  /**
   * Generate a unique request ID
   * @returns Unique request ID
   */
  export function generateRequestId(): string {
    return `lcq-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Validate an MCP method response structure
   * @param response Raw response from MCP
   * @param methodId Method that was called
   * @returns Validated response data
   */
  export function validateMethodResponse(response: any, methodId: string): any {
    // Check if response exists
    if (!response) {
      throw new McpResponseError(`Empty response from MCP method: ${methodId}`);
    }
  
    // Check for error field in response
    if (response.error) {
      throw new McpResponseError(
        `MCP error in method ${methodId}: ${response.error.message || 'Unknown error'}`,
        response.error.code || 0
      );
    }
  
    // Check if result field exists
    if (response.result === undefined) {
      throw new McpResponseError(`Missing result in MCP response for method: ${methodId}`);
    }
  
    return response.result;
  }
  
  /**
   * Parse and classify MCP errors for better handling
   * @param error Raw error object
   * @returns Classified MCP error
   */
  export function handleMcpError(error: any): McpError {
    // Already an MCP error, just return it
    if (error instanceof McpError) {
      return error;
    }
  
    // Network errors
    if (error instanceof TypeError && error.message.includes('network')) {
      return new McpConnectionError(`Network error connecting to MCP: ${error.message}`);
    }
  
    // Handle fetch response errors
    if (error.name === 'FetchError' || error.message?.includes('fetch')) {
      return new McpConnectionError(`Failed to connect to MCP: ${error.message}`);
    }
  
    // Parse JSON response errors
    if (error.name === 'SyntaxError' && error.message?.includes('JSON')) {
      return new McpResponseError(`Invalid JSON response from MCP: ${error.message}`);
    }
  
    // Parse HTTP status code errors
    if (error.status || error.statusCode) {
      const status = error.status || error.statusCode;
      
      // Authentication errors
      if (status === 401 || status === 403) {
        return new McpAuthError(`Authentication failed: ${error.message || 'Invalid API key'}`);
      }
      
      // Rate limit errors
      if (status === 429) {
        const retryAfter = error.headers?.get?.('retry-after') 
          ? parseInt(error.headers.get('retry-after')) 
          : undefined;
          
        return new McpRateLimitError(
          `MCP rate limit exceeded: ${error.message || 'Too many requests'}`,
          retryAfter
        );
      }
      
      // General HTTP errors
      return new McpResponseError(
        `MCP HTTP error ${status}: ${error.message || 'Unknown error'}`, 
        status
      );
    }
  
    // Default to generic MCP error
    return new McpError(`MCP error: ${error.message || 'Unknown error'}`);
  }
  
  /**
   * Check if current rate limits allow executing a method
   * @param methodId Method to check
   * @param rateState Current rate limit state
   * @returns Whether the method can be executed
   */
  export function checkRateLimit(
    methodId: string,
    rateState: Record<string, { count: number, resetTime: number }>
  ): boolean {
    const now = Date.now();
    const method = rateState[methodId];
    
    // If no rate state for this method or reset time has passed, allow execution
    if (!method || now > method.resetTime) {
      return true;
    }
    
    // Check if under the rate limit
    return method.count < 60; // Default limit, should be configurable
  }
  
  /**
   * Update rate limit state after executing a method
   * @param methodId Method that was executed
   * @param rateState Current rate limit state
   * @param response MCP response with rate limit information
   * @returns Updated rate limit state
   */
  export function updateRateLimit(
    methodId: string,
    rateState: Record<string, { count: number, resetTime: number }>,
    response: McpResponse
  ): Record<string, { count: number, resetTime: number }> {
    // Create a copy of the state
    const newState = { ...rateState };
    
    // If response has rate limit info, use it
    if (response.metadata?.rateLimit) {
      const { remaining, reset, limit } = response.metadata.rateLimit;
      newState[methodId] = {
        count: limit - remaining,
        resetTime: reset * 1000 // Convert to milliseconds
      };
      return newState;
    }
    
    // Otherwise, increment the count
    if (!newState[methodId]) {
      // Initialize if not exists with a 1 minute window
      newState[methodId] = {
        count: 1,
        resetTime: Date.now() + 60000
      };
    } else {
      // Increment existing count
      newState[methodId].count += 1;
    }
    
    return newState;
  }
  
  /**
   * Retry strategy with exponential backoff
   * @param attempt Current attempt number (1-indexed)
   * @param maxAttempts Maximum number of attempts
   * @param baseDelay Base delay in milliseconds
   * @param maxDelay Maximum delay in milliseconds
   * @returns Delay in milliseconds, or null if no more retries
   */
  export function getRetryDelay(
    attempt: number,
    maxAttempts: number,
    baseDelay: number = 1000,
    maxDelay: number = 30000
  ): number | null {
    if (attempt >= maxAttempts) {
      return null;
    }
    
    // Exponential backoff with jitter
    const delay = Math.min(
      baseDelay * Math.pow(2, attempt),
      maxDelay
    );
    
    // Add jitter (±20%)
    const jitter = delay * 0.2 * (Math.random() * 2 - 1);
    
    return Math.max(0, Math.floor(delay + jitter));
  }
  
  export default {
    formatMcpRequest,
    generateRequestId,
    validateMethodResponse,
    handleMcpError,
    checkRateLimit,
    updateRateLimit,
    getRetryDelay
  };