/**
 * Validation utility functions for LCQ application
 */

import { PublicKey } from '@solana/web3.js';

/**
 * Validate a Solana public key
 * @param address Address to validate
 * @returns True if address is valid
 */
export function validateSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate a Solana transaction signature
 * @param signature Transaction signature to validate
 * @returns True if signature format is valid
 */
export function validateTransactionSignature(signature: string): boolean {
  // Basic format validation - 88 character base58 string
  return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(signature);
}

/**
 * Validate a program ID
 * @param programId Program ID to validate
 * @returns True if program ID is valid
 */
export function validateProgramId(programId: string): boolean {
  return validateSolanaAddress(programId);
}

/**
 * Validate a token mint address
 * @param mintAddress Token mint address
 * @returns True if mint address is valid
 */
export function validateMintAddress(mintAddress: string): boolean {
  return validateSolanaAddress(mintAddress);
}

/**
 * Validate an email address
 * @param email Email address to validate
 * @returns True if email format is valid
 */
export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate an API key format
 * @param apiKey API key to validate
 * @returns True if API key format is valid
 */
export function validateApiKey(apiKey: string): boolean {
  // Generic API key format (alphanumeric with dashes, 32+ chars)
  return /^[a-zA-Z0-9\-_]{32,}$/.test(apiKey);
}

/**
 * Validate URL format
 * @param url URL to validate
 * @returns True if URL format is valid
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate RPC endpoint URL
 * @param url RPC endpoint URL to validate
 * @param requireHttps Whether HTTPS is required
 * @returns True if RPC URL format is valid
 */
export function validateRpcUrl(url: string, requireHttps = true): boolean {
  try {
    const parsedUrl = new URL(url);
    if (requireHttps && parsedUrl.protocol !== 'https:') {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate SOL amount (must be positive and have valid precision)
 * @param amount SOL amount to validate
 * @returns True if amount is valid
 */
export function validateSolAmount(amount: number | string): boolean {
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(numericAmount)) return false;
  
  // Check if it's positive
  if (numericAmount <= 0) return false;
  
  // Check precision (SOL has 9 decimals)
  const stringAmount = numericAmount.toString();
  const decimalPart = stringAmount.includes('.') ? stringAmount.split('.')[1] : '';
  
  return decimalPart.length <= 9;
}

/**
 * Validate token amount with given decimals
 * @param amount Token amount to validate
 * @param decimals Token decimals
 * @returns True if amount is valid
 */
export function validateTokenAmount(amount: number | string, decimals: number): boolean {
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(numericAmount)) return false;
  
  // Check if it's positive
  if (numericAmount < 0) return false;
  
  // Check precision based on token decimals
  const stringAmount = numericAmount.toString();
  const decimalPart = stringAmount.includes('.') ? stringAmount.split('.')[1] : '';
  
  return decimalPart.length <= decimals;
}

/**
 * Validate a configuration object against a schema
 * @param config Configuration object to validate
 * @param schema Schema defining required fields and types
 * @param throwOnError Whether to throw an error for invalid config
 * @returns Validation result with errors if any
 */
export function validateConfig(
  config: Record<string, any>,
  schema: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    validator?: (value: any) => boolean;
  }>,
  throwOnError = false
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check all schema fields
  for (const [field, rules] of Object.entries(schema)) {
    // Check if required field is missing
    if (rules.required && (config[field] === undefined || config[field] === null)) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }
    
    // Skip validation if field is not present and not required
    if (config[field] === undefined || config[field] === null) {
      continue;
    }
    
    // Check type
    const valueType = Array.isArray(config[field]) ? 'array' : typeof config[field];
    if (valueType !== rules.type) {
      errors.push(`Field ${field} should be of type ${rules.type}, got ${valueType}`);
    }
    
    // Run custom validator if provided
    if (rules.validator && !rules.validator(config[field])) {
      errors.push(`Field ${field} failed custom validation`);
    }
  }
  
  const valid = errors.length === 0;
  
  if (!valid && throwOnError) {
    throw new Error(`Config validation failed: ${errors.join(', ')}`);
  }
  
  return { valid, errors };
}

/**
 * Validate agent options for specific agent types
 * @param agentType Agent type
 * @param options Agent options
 * @returns Validation result with errors if any
 */
export function validateAgentOptions(
  agentType: string,
  options: Record<string, any>
): { valid: boolean; errors: string[] } {
  // Define schemas for different agent types
  const schemas: Record<string, Record<string, any>> = {
    'transaction-optimizer': {
      historyDepth: {
        type: 'number',
        required: false,
        validator: (v: number) => v > 0 && v <= 10000
      },
      updateFrequency: {
        type: 'number',
        required: false,
        validator: (v: number) => v >= 10 && v <= 3600
      },
      priorityLevels: {
        type: 'object',
        required: false
      }
    },
    'program-deployment': {
      environments: {
        type: 'array',
        required: false
      },
      defaultEnvironment: {
        type: 'string',
        required: false,
        validator: (v: string) => ['devnet', 'testnet', 'mainnet-beta'].includes(v)
      },
      cacheDeployments: {
        type: 'boolean',
        required: false
      }
    },
    'account-analyzer': {
      analysisDepth: {
        type: 'number',
        required: false,
        validator: (v: number) => v > 0 && v <= 365
      },
      tokenPriceSource: {
        type: 'string',
        required: false
      },
      saveAccountHistory: {
        type: 'boolean',
        required: false
      }
    },
    'smart-contract-auditor': {
      auditDepth: {
        type: 'string',
        required: false,
        validator: (v: string) => ['basic', 'standard', 'deep'].includes(v)
      },
      includeBestPractices: {
        type: 'boolean',
        required: false
      },
      includeOptimizations: {
        type: 'boolean',
        required: false
      },
      saveAuditHistory: {
        type: 'boolean',
        required: false
      }
    },
    'data-scraper': {
      maxDataPoints: {
        type: 'number',
        required: false,
        validator: (v: number) => v > 0 && v <= 100000
      },
      exportFormats: {
        type: 'array',
        required: false
      },
      defaultExportFormat: {
        type: 'string',
        required: false,
        validator: (v: string) => ['csv', 'json'].includes(v)
      },
      saveQueries: {
        type: 'boolean',
        required: false
      }
    }
  };
  
  // Get schema for the specified agent type
  const schema = schemas[agentType];
  
  // If no schema found, return error
  if (!schema) {
    return {
      valid: false,
      errors: [`Unknown agent type: ${agentType}`]
    };
  }
  
  // Validate options against schema
  return validateConfig(options, schema);
}

/**
 * Validate an MCP configuration
 * @param config MCP configuration to validate
 * @returns Validation result with errors if any
 */
export function validateMcpConfig(
  config: Record<string, any>
): { valid: boolean; errors: string[] } {
  const schema = {
    apiKey: {
      type: 'string',
      required: true,
      validator: validateApiKey
    },
    endpointId: {
      type: 'string',
      required: false
    },
    timeout: {
      type: 'number',
      required: false,
      validator: (v: number) => v >= 1000 && v <= 60000
    },
    retryAttempts: {
      type: 'number',
      required: false,
      validator: (v: number) => v >= 0 && v <= 10
    },
    debug: {
      type: 'boolean',
      required: false
    }
  };
  
  return validateConfig(config, schema);
}

/**
 * Validate Solana RPC configuration
 * @param config RPC configuration to validate
 * @returns Validation result with errors if any
 */
export function validateRpcConfig(
  config: Record<string, any>
): { valid: boolean; errors: string[] } {
  const schema = {
    url: {
      type: 'string',
      required: true,
      validator: (v: string) => validateRpcUrl(v)
    },
    commitment: {
      type: 'string',
      required: false,
      validator: (v: string) => ['processed', 'confirmed', 'finalized'].includes(v)
    },
    timeout: {
      type: 'number',
      required: false,
      validator: (v: number) => v >= 1000 && v <= 120000
    },
    disableRetryOnRateLimit: {
      type: 'boolean',
      required: false
    }
  };
  
  return validateConfig(config, schema);
}

/**
 * Validate batch transaction options
 * @param options Batch options to validate
 * @returns Validation result with errors if any
 */
export function validateBatchOptions(
  options: Record<string, any>
): { valid: boolean; errors: string[] } {
  const schema = {
    maxTransactionsPerBatch: {
      type: 'number',
      required: false,
      validator: (v: number) => v > 0 && v <= 100
    },
    maxUnitsPerBatch: {
      type: 'number',
      required: false,
      validator: (v: number) => v > 0 && v <= 1400000
    },
    priorityFee: {
      type: 'number',
      required: false,
      validator: (v: number) => v >= 0
    },
    commitment: {
      type: 'string',
      required: false,
      validator: (v: string) => ['processed', 'confirmed', 'finalized'].includes(v)
    },
    maxRetries: {
      type: 'number',
      required: false,
      validator: (v: number) => v >= 0 && v <= 10
    }
  };
  
  return validateConfig(config, schema);
}

export default {
  validateSolanaAddress,
  validateTransactionSignature,
  validateProgramId,
  validateMintAddress,
  validateEmail,
  validateApiKey,
  validateUrl,
  validateRpcUrl,
  validateSolAmount,
  validateTokenAmount,
  validateConfig,
  validateAgentOptions,
  validateMcpConfig,
  validateRpcConfig,
  validateBatchOptions
};