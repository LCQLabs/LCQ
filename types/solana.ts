/**
 * Type definitions for Solana-related data structures
 */

/**
 * Solana network type
 */
export type SolanaNetwork = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet' | 'custom';

/**
 * Commitment level for Solana transactions
 */
export type CommitmentLevel = 'processed' | 'confirmed' | 'finalized';

/**
 * Network congestion level
 */
export type CongestionLevel = 'Low' | 'Medium' | 'High' | 'Very High';

/**
 * RPC endpoint configuration
 */
export interface RpcEndpoint {
  id: string;
  name: string;
  url: string;
  network: SolanaNetwork;
  isDefault?: boolean;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  id: SolanaNetwork;
  name: string;
  description: string;
  defaultEndpoint: string;
  explorerUrl: string;
  tokenListUrl?: string;
}

/**
 * Solana configuration
 */
export interface SolanaConfig {
  networks: NetworkConfig[];
  endpoints: RpcEndpoint[];
  defaultNetwork: SolanaNetwork;
  defaultCommitment: CommitmentLevel;
  transactionTimeout: number;
  defaultPriorityFee: number;
  maxRetries: number;
}

/**
 * Connection options
 */
export interface ConnectionOptions {
  commitment?: CommitmentLevel;
  confirmTransactionInitialTimeout?: number;
  preflightCommitment?: CommitmentLevel;
  disableRetryOnRateLimit?: boolean;
}

/**
 * Account information
 */
export interface AccountInfo {
  address: string;
  owner: string;
  lamports: number;
  executable: boolean;
  rentEpoch: number;
  data: any;
}

/**
 * Token account information
 */
export interface TokenAccountInfo {
  address: string;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  tokenName?: string;
  tokenSymbol?: string;
}

/**
 * Balance information
 */
export interface BalanceInfo {
  address: string;
  lamports: number;
  solBalance: number;
  tokens: TokenAccountInfo[];
  totalValueUsd?: number;
}

/**
 * Program information
 */
export interface ProgramInfo {
  address: string;
  programData?: string;
  upgradeAuthority?: string;
  lastDeployedSlot?: number;
  dataSize: number;
  executable: boolean;
  lamports: number;
  verified?: boolean;
}

/**
 * Program account information
 */
export interface ProgramAccount {
  pubkey: string;
  account: {
    lamports: number;
    owner: string;
    data: any;
    executable: boolean;
    rentEpoch: number;
  };
}

/**
 * Program IDL information
 */
export interface ProgramIdl {
  name: string;
  version: string;
  instructions: {
    name: string;
    accounts: { name: string; isMut: boolean; isSigner: boolean }[];
    args: { name: string; type: string }[];
  }[];
  accounts?: {
    name: string;
    type: {
      kind: string;
      fields: { name: string; type: string }[];
    };
  }[];
  events?: {
    name: string;
    fields: { name: string; type: string }[];
  }[];
  errors?: {
    code: number;
    name: string;
    msg?: string;
  }[];
}

/**
 * Transaction information
 */
export interface TransactionInfo {
  signature: string;
  slot: number;
  blockTime: number;
  fee: number;
  status: 'success' | 'failure' | 'unknown';
  error?: string;
  instructions: InstructionInfo[];
  signers: string[];
  programInvocations: string[];
  tokenTransfers: TokenTransferInfo[];
  solTransfers: SolTransferInfo[];
}

/**
 * Instruction information
 */
export interface InstructionInfo {
  programId: string;
  programName?: string;
  accounts: string[];
  data?: string;
  parsed?: any;
}

/**
 * Token transfer information
 */
export interface TokenTransferInfo {
  mint: string;
  tokenName?: string;
  tokenSymbol?: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  decimals: number;
  uiAmount: number;
}

/**
 * SOL transfer information
 */
export interface SolTransferInfo {
  fromAddress: string;
  toAddress: string;
  lamports: number;
  solAmount: number;
}

/**
 * Network status information
 */
export interface NetworkStatus {
  currentSlot: number;
  currentBlockTime: number;
  transactionsPerSecond: number;
  avgBlockTime: number;
  congestionLevel: CongestionLevel;
  baseFee: number;
  recommendedFee: number;
  epoch: number;
  epochProgress: number;
}

/**
 * Fee recommendation information
 */
export interface FeeRecommendation {
  baseFee: number;
  economyFee: number;
  standardFee: number;
  priorityFee: number;
  congestionLevel: CongestionLevel;
  estimatedConfirmationTimeEconomy: string;
  estimatedConfirmationTimeStandard: string;
  estimatedConfirmationTimePriority: string;
}

/**
 * Time window information for fee optimization
 */
export interface OptimalTimeWindow {
  startHour: number;
  endHour: number;
  congestionLevel: CongestionLevel;
  averageFee: number;
}

/**
 * NFT metadata
 */
export interface NftMetadata {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: {
    address: string;
    share: number;
    verified: boolean;
  }[];
  collection?: {
    key: string;
    verified: boolean;
  };
  image?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
  externalUrl?: string;
  collectionName?: string;
  description?: string;
}

/**
 * NFT collection information
 */
export interface NftCollectionInfo {
  address: string;
  name: string;
  symbol: string;
  itemCount: number;
  floorPrice?: number;
  totalVolume?: number;
  holderCount?: number;
  verified: boolean;
}

/**
 * Token information
 */
export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  extensions?: Record<string, any>;
}

/**
 * Token price information
 */
export interface TokenPrice {
  mint: string;
  symbol: string;
  price: number;
  volume24h?: number;
  marketCap?: number;
  change24h?: number;
  source: string;
  timestamp: number;
}

/**
 * Validator information
 */
export interface ValidatorInfo {
  nodePubkey: string;
  voteAccountPubkey: string;
  activatedStake: number;
  lastVote: number;
  commission: number;
  rootSlot: number;
  version?: string;
  delinquent: boolean;
}

/**
 * Epoch information
 */
export interface EpochInfo {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  blockHeight?: number;
  transactionCount?: number;
}

/**
 * Block information
 */
export interface BlockInfo {
  blockhash: string;
  previousBlockhash: string;
  parentSlot: number;
  transactions: TransactionInfo[];
  blockTime: number;
  blockHeight: number;
}

/**
 * Supply information
 */
export interface SupplyInfo {
  total: number;
  circulating: number;
  nonCirculating: number;
  nonCirculatingAccounts: string[];
}

/**
 * Transaction statistics
 */
export interface TransactionStats {
  numTransactions: number;
  numSuccessful: number;
  numFailed: number;
  tps: number;
  totalFees: number;
  averageFee: number;
}

/**
 * Transaction batch options
 */
export interface BatchOptions {
  maxTransactionsPerBatch?: number;
  maxUnitsPerBatch?: number;
  priorityFee?: number;
  commitment?: CommitmentLevel;
  maxRetries?: number;
}

/**
 * Program deployment options
 */
export interface DeploymentOptions {
  network: SolanaNetwork;
  keypairPath: string;
  programPath: string;
  bufferKeypairPath?: string;
  upgradeAuthority?: string;
  programId?: string;
  rpcUrl?: string;
}

/**
 * Deployment result
 */
export interface DeploymentResult {
  programId: string;
  signature: string;
  slot: number;
  success: boolean;
  error?: string;
  deploymentTime: number;
  network: SolanaNetwork;
}