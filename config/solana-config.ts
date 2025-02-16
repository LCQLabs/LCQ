/**
 * Solana configuration settings for the LCQ application
 * Defines network endpoints, commitment levels, and other Solana-specific settings
 */

export type SolanaNetwork = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet' | 'custom';
export type CommitmentLevel = 'processed' | 'confirmed' | 'finalized';

export interface RpcEndpoint {
  id: string;
  name: string;
  url: string;
  network: SolanaNetwork;
  isDefault?: boolean;
}

export interface NetworkConfig {
  id: SolanaNetwork;
  name: string;
  description: string;
  defaultEndpoint: string; // ID of the default endpoint for this network
  explorerUrl: string;
  tokenListUrl?: string;
}

export interface SolanaConfig {
  networks: NetworkConfig[];
  endpoints: RpcEndpoint[];
  defaultNetwork: SolanaNetwork;
  defaultCommitment: CommitmentLevel;
  transactionTimeout: number; // in milliseconds
  defaultPriorityFee: number; // in microlamports
  maxRetries: number;
}

// Define RPC endpoints
const rpcEndpoints: RpcEndpoint[] = [
  // Mainnet endpoints
  {
    id: 'mainnet-lcq',
    name: 'LCQ Mainnet RPC',
    url: 'https://mainnet.rpc.lcq.gg',
    network: 'mainnet-beta',
    isDefault: true
  },
  {
    id: 'mainnet-solana',
    name: 'Solana Mainnet RPC',
    url: 'https://api.mainnet-beta.solana.com',
    network: 'mainnet-beta'
  },
  {
    id: 'mainnet-helius',
    name: 'Helius Mainnet RPC',
    url: 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY',
    network: 'mainnet-beta'
  },
  
  // Testnet endpoints
  {
    id: 'testnet-lcq',
    name: 'LCQ Testnet RPC',
    url: 'https://testnet.rpc.lcq.gg',
    network: 'testnet',
    isDefault: true
  },
  {
    id: 'testnet-solana',
    name: 'Solana Testnet RPC',
    url: 'https://api.testnet.solana.com',
    network: 'testnet'
  },
  
  // Devnet endpoints
  {
    id: 'devnet-lcq',
    name: 'LCQ Devnet RPC',
    url: 'https://devnet.rpc.lcq.gg',
    network: 'devnet',
    isDefault: true
  },
  {
    id: 'devnet-solana',
    name: 'Solana Devnet RPC',
    url: 'https://api.devnet.solana.com',
    network: 'devnet'
  },
  
  // Localnet endpoint
  {
    id: 'localnet',
    name: 'Local Validator',
    url: 'http://localhost:8899',
    network: 'localnet',
    isDefault: true
  },
  
  // Custom endpoint placeholder
  {
    id: 'custom',
    name: 'Custom RPC Endpoint',
    url: '',
    network: 'custom',
    isDefault: true
  }
];

// Define network configurations
const networkConfigs: NetworkConfig[] = [
  {
    id: 'mainnet-beta',
    name: 'Mainnet Beta',
    description: 'Solana\'s main production network',
    defaultEndpoint: 'mainnet-lcq',
    explorerUrl: 'https://explorer.solana.com',
    tokenListUrl: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json'
  },
  {
    id: 'testnet',
    name: 'Testnet',
    description: 'Solana\'s testnet environment',
    defaultEndpoint: 'testnet-lcq',
    explorerUrl: 'https://explorer.solana.com/?cluster=testnet'
  },
  {
    id: 'devnet',
    name: 'Devnet',
    description: 'Solana\'s development network',
    defaultEndpoint: 'devnet-lcq',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    tokenListUrl: 'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json'
  },
  {
    id: 'localnet',
    name: 'Localnet',
    description: 'Local Solana validator for development',
    defaultEndpoint: 'localnet',
    explorerUrl: ''
  },
  {
    id: 'custom',
    name: 'Custom Network',
    description: 'Custom Solana network configuration',
    defaultEndpoint: 'custom',
    explorerUrl: ''
  }
];

// Solana configuration
export const solanaConfig: SolanaConfig = {
  networks: networkConfigs,
  endpoints: rpcEndpoints,
  defaultNetwork: 'mainnet-beta',
  defaultCommitment: 'confirmed',
  transactionTimeout: 60000, // 60 seconds
  defaultPriorityFee: 1000, // 1000 micro-lamports
  maxRetries: 3
};

/**
 * Get network configuration by ID
 * @param networkId Network ID
 * @returns Network configuration or undefined if not found
 */
export function getNetworkConfig(networkId: SolanaNetwork): NetworkConfig | undefined {
  return solanaConfig.networks.find(network => network.id === networkId);
}

/**
 * Get RPC endpoint by ID
 * @param endpointId Endpoint ID
 * @returns RPC endpoint configuration or undefined if not found
 */
export function getEndpoint(endpointId: string): RpcEndpoint | undefined {
  return solanaConfig.endpoints.find(endpoint => endpoint.id === endpointId);
}

/**
 * Get default endpoint for a network
 * @param networkId Network ID
 * @returns Default RPC endpoint for the network
 */
export function getDefaultEndpoint(networkId: SolanaNetwork): RpcEndpoint | undefined {
  const network = getNetworkConfig(networkId);
  if (!network) return undefined;
  
  const defaultEndpoint = solanaConfig.endpoints.find(
    endpoint => endpoint.id === network.defaultEndpoint
  );
  
  return defaultEndpoint || solanaConfig.endpoints.find(
    endpoint => endpoint.network === networkId && endpoint.isDefault
  );
}

/**
 * Get explorer URL for a transaction
 * @param signature Transaction signature
 * @param networkId Network ID
 * @returns Full explorer URL for the transaction
 */
export function getExplorerUrl(signature: string, networkId?: SolanaNetwork): string {
  const network = getNetworkConfig(networkId || solanaConfig.defaultNetwork);
  if (!network || !network.explorerUrl) return '';
  
  return `${network.explorerUrl}/tx/${signature}`;
}

/**
 * Get explorer URL for an address
 * @param address Account address
 * @param networkId Network ID
 * @returns Full explorer URL for the address
 */
export function getAddressExplorerUrl(address: string, networkId?: SolanaNetwork): string {
  const network = getNetworkConfig(networkId || solanaConfig.defaultNetwork);
  if (!network || !network.explorerUrl) return '';
  
  return `${network.explorerUrl}/address/${address}`;
}

/**
 * Create connection options with default settings
 * @param commitment Optional commitment level (defaults to config default)
 * @returns Connection options object
 */
export function createConnectionOptions(commitment?: CommitmentLevel) {
  return {
    commitment: commitment || solanaConfig.defaultCommitment,
    confirmTransactionInitialTimeout: solanaConfig.transactionTimeout
  };
}

export default {
  config: solanaConfig,
  getNetworkConfig,
  getEndpoint,
  getDefaultEndpoint,
  getExplorerUrl,
  getAddressExplorerUrl,
  createConnectionOptions
};