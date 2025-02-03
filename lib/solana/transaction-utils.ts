import { PublicKey } from '@solana/web3.js';
import { McpClient } from '../mcp/client';
import { SolanaNetwork } from '../../config/solana-config';
import { ProgramUtils } from './program-utils';

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
 * Network congestion level
 */
export type CongestionLevel = 'Low' | 'Medium' | 'High' | 'Very High';

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
 * Utility class for Solana transaction operations via MCP
 */
export class TransactionUtils {
  private mcpClient: McpClient;
  private programUtils: ProgramUtils;
  
  constructor(mcpClient: McpClient) {
    this.mcpClient = mcpClient;
    this.programUtils = new ProgramUtils(mcpClient);
  }
  
  /**
   * Validate a transaction signature
   * @param signature Transaction signature to validate
   * @returns True if the signature format is valid
   */
  public isValidSignature(signature: string): boolean {
    // Basic format check (not comprehensive)
    return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(signature);
  }
  
  /**
   * Validate a Solana address
   * @param address Address to validate
   * @returns True if the address is valid
   */
  public isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get transaction information
   * @param signature Transaction signature
   * @param includeTokenMetadata Whether to include token metadata (name, symbol)
   * @returns Transaction information
   */
  public async getTransaction(
    signature: string,
    includeTokenMetadata: boolean = true
  ): Promise<TransactionInfo> {
    if (!this.isValidSignature(signature)) {
      throw new Error(`Invalid transaction signature: ${signature}`);
    }
    
    const result = await this.mcpClient.getTransaction(signature);
    
    if (!result) {
      throw new Error(`Transaction not found: ${signature}`);
    }
    
    // Parse transaction data
    return this.parseTransactionData(result, includeTokenMetadata);
  }
  
  /**
   * Parse raw transaction data into a structured format
   * @param rawTx Raw transaction data from MCP
   * @param includeTokenMetadata Whether to include token metadata
   * @returns Structured transaction information
   */
  private async parseTransactionData(
    rawTx: any,
    includeTokenMetadata: boolean
  ): Promise<TransactionInfo> {
    // Extract basic transaction info
    const signature = rawTx.transaction.signatures[0];
    const slot = rawTx.slot;
    const blockTime = rawTx.blockTime;
    const fee = rawTx.meta.fee;
    const status = rawTx.meta.err ? 'failure' : 'success';
    const error = rawTx.meta.err ? JSON.stringify(rawTx.meta.err) : undefined;
    
    // Extract signers
    const signers = rawTx.transaction.signatures.map((sig: string) => {
      const index = rawTx.transaction.message.accountKeys.findIndex(
        (key: any, i: number) => rawTx.transaction.message.header.numRequiredSignatures > i
      );
      return index >= 0 ? rawTx.transaction.message.accountKeys[index] : 'unknown';
    });
    
    // Extract and parse instructions
    const instructions = this.parseInstructions(rawTx);
    
    // Extract program invocations
    const programInvocations = this.extractProgramInvocations(rawTx);
    
    // Extract token transfers
    const tokenTransfers = await this.extractTokenTransfers(rawTx, includeTokenMetadata);
    
    // Extract SOL transfers
    const solTransfers = this.extractSolTransfers(rawTx);
    
    return {
      signature,
      slot,
      blockTime,
      fee,
      status,
      error,
      instructions,
      signers,
      programInvocations,
      tokenTransfers,
      solTransfers
    };
  }
  
  /**
   * Parse instructions from transaction data
   * @param rawTx Raw transaction data
   * @returns Array of instruction information
   */
  private parseInstructions(rawTx: any): InstructionInfo[] {
    const instructions: InstructionInfo[] = [];
    
    // Process all instructions in the transaction
    if (rawTx.transaction.message.instructions) {
      for (const ix of rawTx.transaction.message.instructions) {
        const programIdIndex = ix.programIdIndex;
        const programId = rawTx.transaction.message.accountKeys[programIdIndex];
        
        // Get program name if known
        const programName = ProgramUtils.getKnownProgramName(programId);
        
        // Map account indices to addresses
        const accounts = ix.accounts.map(
          (idx: number) => rawTx.transaction.message.accountKeys[idx]
        );
        
        // Add basic instruction info
        const instruction: InstructionInfo = {
          programId,
          programName,
          accounts,
          data: ix.data
        };
        
        // Add parsed info if available
        if (ix.parsed) {
          instruction.parsed = ix.parsed;
        }
        
        instructions.push(instruction);
      }
    }
    
    // Also check for inner instructions
    if (rawTx.meta && rawTx.meta.innerInstructions) {
      // Process inner instructions (would be similar to above)
      // Not fully implemented for brevity
    }
    
    return instructions;
  }
  
  /**
   * Extract program invocations from transaction data
   * @param rawTx Raw transaction data
   * @returns Array of program IDs invoked
   */
  private extractProgramInvocations(rawTx: any): string[] {
    const programs = new Set<string>();
    
    // Add from main instructions
    if (rawTx.transaction.message.instructions) {
      for (const ix of rawTx.transaction.message.instructions) {
        const programIdIndex = ix.programIdIndex;
        const programId = rawTx.transaction.message.accountKeys[programIdIndex];
        programs.add(programId);
      }
    }
    
    // Add from inner instructions
    if (rawTx.meta && rawTx.meta.innerInstructions) {
      for (const innerIx of rawTx.meta.innerInstructions) {
        for (const ix of innerIx.instructions) {
          const programIdIndex = ix.programIdIndex;
          const programId = rawTx.transaction.message.accountKeys[programIdIndex];
          programs.add(programId);
        }
      }
    }
    
    return Array.from(programs);
  }
  
  /**
   * Extract token transfers from transaction data
   * @param rawTx Raw transaction data
   * @param includeTokenMetadata Whether to include token metadata
   * @returns Array of token transfer information
   */
  private async extractTokenTransfers(
    rawTx: any,
    includeTokenMetadata: boolean
  ): Promise<TokenTransferInfo[]> {
    const transfers: TokenTransferInfo[] = [];
    
    // For brevity, this is a simplified implementation
    // A real implementation would need to parse SPL Token instructions
    // and track pre/post token balances
    
    // Check for token balance changes
    if (rawTx.meta && rawTx.meta.preTokenBalances && rawTx.meta.postTokenBalances) {
      const preBalances = rawTx.meta.preTokenBalances;
      const postBalances = rawTx.meta.postTokenBalances;
      
      // Map by account index and mint for easy comparison
      const preMap = new Map<string, any>();
      for (const balance of preBalances) {
        preMap.set(`${balance.accountIndex}-${balance.mint}`, balance);
      }
      
      // Check for balance changes
      for (const postBalance of postBalances) {
        const key = `${postBalance.accountIndex}-${postBalance.mint}`;
        const preBalance = preMap.get(key);
        
        if (preBalance) {
          const preAmount = BigInt(preBalance.uiTokenAmount.amount);
          const postAmount = BigInt(postBalance.uiTokenAmount.amount);
          
          if (postAmount > preAmount) {
            // This account received tokens
            // Find sender (would require more analysis in real implementation)
            const fromAddress = 'unknown'; // Simplified
            
            transfers.push({
              mint: postBalance.mint,
              tokenName: postBalance.uiTokenAmount.tokenName,
              tokenSymbol: postBalance.uiTokenAmount.tokenSymbol,
              fromAddress,
              toAddress: rawTx.transaction.message.accountKeys[postBalance.accountIndex],
              amount: (postAmount - preAmount).toString(),
              decimals: postBalance.uiTokenAmount.decimals,
              uiAmount: Number(postAmount - preAmount) / Math.pow(10, postBalance.uiTokenAmount.decimals)
            });
          }
        }
      }
    }
    
    // Enrich with token metadata if requested and not available
    if (includeTokenMetadata) {
      // This would fetch token metadata for mints that don't have it
      // Not implemented for brevity
    }
    
    return transfers;
  }
  
  /**
   * Extract SOL transfers from transaction data
   * @param rawTx Raw transaction data
   * @returns Array of SOL transfer information
   */
  private extractSolTransfers(rawTx: any): SolTransferInfo[] {
    const transfers: SolTransferInfo[] = [];
    
    // Look for system program transfers
    if (rawTx.transaction.message.instructions) {
      for (const ix of rawTx.transaction.message.instructions) {
        const programIdIndex = ix.programIdIndex;
        const programId = rawTx.transaction.message.accountKeys[programIdIndex];
        
        // Check if it's the system program
        if (programId === '11111111111111111111111111111111') {
          // Check if instruction is parsed
          if (ix.parsed && ix.parsed.type === 'transfer') {
            transfers.push({
              fromAddress: ix.parsed.info.source,
              toAddress: ix.parsed.info.destination,
              lamports: ix.parsed.info.lamports,
              solAmount: ix.parsed.info.lamports / 1_000_000_000
            });
          }
        }
      }
    }
    
    // Also check inner instructions
    if (rawTx.meta && rawTx.meta.innerInstructions) {
      // Similar to above, not fully implemented for brevity
    }
    
    return transfers;
  }
  
  /**
   * Get recent transactions for an account
   * @param address Account address
   * @param limit Maximum number of transactions to fetch
   * @returns Array of transaction signatures
   */
  public async getAccountTransactions(
    address: string,
    limit: number = 10
  ): Promise<string[]> {
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid Solana address: ${address}`);
    }
    
    const result = await this.mcpClient.getSignaturesForAddress(address, limit);
    
    if (!result) {
      return [];
    }
    
    return result.map((item: any) => item.signature);
  }
  
  /**
   * Get explorer URL for a transaction
   * @param signature Transaction signature
   * @param network Solana network
   * @returns Explorer URL
   */
  public getExplorerUrl(
    signature: string,
    network: SolanaNetwork = 'mainnet-beta'
  ): string {
    if (!this.isValidSignature(signature)) {
      throw new Error(`Invalid transaction signature: ${signature}`);
    }
    
    const baseUrl = 'https://explorer.solana.com';
    const path = `/tx/${signature}`;
    const query = network !== 'mainnet-beta' ? `?cluster=${network}` : '';
    
    return `${baseUrl}${path}${query}`;
  }
  
  /**
   * Get current network status
   * @param network Solana network
   * @returns Network status information
   */
  public async getNetworkStatus(network: SolanaNetwork = 'mainnet-beta'): Promise<NetworkStatus> {
    // This would call MCP to get real network data
    // For demo purposes, simulating status data
    
    const simulatedStatus: NetworkStatus = {
      currentSlot: 200000000 + Math.floor(Math.random() * 1000000),
      currentBlockTime: Date.now() / 1000,
      transactionsPerSecond: 1500 + Math.floor(Math.random() * 1000),
      avgBlockTime: 0.4 + (Math.random() * 0.2),
      congestionLevel: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 3)] as CongestionLevel,
      baseFee: 0.000005,
      recommendedFee: 0.000007,
      epoch: 420 + Math.floor(Math.random() * 10),
      epochProgress: Math.random() * 100
    };
    
    return simulatedStatus;
  }
  
  /**
   * Get fee recommendations based on current network conditions
   * @param network Solana network
   * @returns Fee recommendation information
   */
  public async getFeeRecommendations(network: SolanaNetwork = 'mainnet-beta'): Promise<FeeRecommendation> {
    const status = await this.getNetworkStatus(network);
    
    // Calculate different fee levels based on congestion
    const baseFee = status.baseFee;
    
    // Multipliers based on congestion
    const multipliers: Record<CongestionLevel, number> = {
      'Low': 1.1,
      'Medium': 1.5,
      'High': 2.0,
      'Very High': 3.0
    };
    
    const multiplier = multipliers[status.congestionLevel];
    
    // Calculate confirmation times based on congestion
    const confirmationTimes: Record<CongestionLevel, Record<string, string>> = {
      'Low': {
        economy: '10-20 seconds',
        standard: '5-10 seconds',
        priority: '2-5 seconds'
      },
      'Medium': {
        economy: '30-60 seconds',
        standard: '10-20 seconds',
        priority: '5-10 seconds'
      },
      'High': {
        economy: '1-2 minutes',
        standard: '30-45 seconds',
        priority: '10-15 seconds'
      },
      'Very High': {
        economy: '3-5 minutes',
        standard: '1-2 minutes',
        priority: '20-40 seconds'
      }
    };
    
    return {
      baseFee,
      economyFee: baseFee,
      standardFee: baseFee * multiplier,
      priorityFee: baseFee * multiplier * 1.5,
      congestionLevel: status.congestionLevel,
      estimatedConfirmationTimeEconomy: confirmationTimes[status.congestionLevel].economy,
      estimatedConfirmationTimeStandard: confirmationTimes[status.congestionLevel].standard,
      estimatedConfirmationTimePriority: confirmationTimes[status.congestionLevel].priority
    };
  }
  
  /**
   * Get optimal time windows for transactions based on historical data
   * @param hoursAhead Hours ahead to look for optimal times
   * @returns Array of optimal time windows
   */
  public async getOptimalTimeWindows(hoursAhead: number = 24): Promise<OptimalTimeWindow[]> {
    // This would analyze historical fee data
    // For demo purposes, simulating some optimal windows
    const optimalWindows: OptimalTimeWindow[] = [
      {
        startHour: 3,
        endHour: 5,
        congestionLevel: 'Low',
        averageFee: 0.000005
      },
      {
        startHour: 10,
        endHour: 11,
        congestionLevel: 'Low',
        averageFee: 0.0000055
      },
      {
        startHour: 22,
        endHour: 23,
        congestionLevel: 'Low',
        averageFee: 0.000006
      }
    ];
    
    return optimalWindows;
  }
  
  /**
   * Calculate compute unit limit for a transaction based on its complexity
   * @param instructionCount Number of instructions
   * @param accountCount Number of accounts
   * @param isComplex Whether the transaction has complex logic
   * @returns Recommended compute unit limit
   */
  public calculateComputeUnitLimit(
    instructionCount: number,
    accountCount: number,
    isComplex: boolean = false
  ): number {
    // Base compute units
    const baseUnits = 200_000;
    
    // Add units for instructions
    const instructionUnits = instructionCount * 20_000;
    
    // Add units for accounts
    const accountUnits = accountCount * 5_000;
    
    // Add complexity buffer
    const complexityBuffer = isComplex ? 200_000 : 0;
    
    // Calculate total with a safety margin
    const totalUnits = baseUnits + instructionUnits + accountUnits + complexityBuffer;
    const withSafetyMargin = Math.ceil(totalUnits * 1.2);
    
    // Cap at maximum allowed compute units
    return Math.min(withSafetyMargin, 1_400_000);
  }
  
  /**
   * Calculate optimal batch size for multiple transactions
   * @param transactionCount Total number of transactions
   * @param computeUnitsPerTx Estimated compute units per transaction
   * @returns Optimal batch size and savings estimate
   */
  public calculateOptimalBatchSize(
    transactionCount: number,
    computeUnitsPerTx: number = 200_000
  ): { batchSize: number, estimatedSavings: number } {
    if (transactionCount <= 1) {
      return { batchSize: 1, estimatedSavings: 0 };
    }
    
    // Base transaction overhead
    const txOverhead = 0.000005; // SOL
    
    // Calculate cost of individual transactions
    const individualCost = transactionCount * txOverhead;
    
    // Calculate maximum instructions per transaction based on compute limit
    const maxInstructionsPerTx = Math.floor(1_400_000 / computeUnitsPerTx);
    
    // Calculate optimal batch size (capped by compute limit)
    const rawBatchSize = Math.min(transactionCount, maxInstructionsPerTx);
    
    // Round to a reasonable batch size
    let batchSize = rawBatchSize;
    if (transactionCount > maxInstructionsPerTx) {
      // If we can't fit all in one batch, use optimal batching
      const batchCount = Math.ceil(transactionCount / maxInstructionsPerTx);
      batchSize = Math.ceil(transactionCount / batchCount);
    }
    
    // Calculate batched cost
    const batchCount = Math.ceil(transactionCount / batchSize);
    const batchedCost = batchCount * txOverhead;
    
    // Calculate savings
    const savedCost = individualCost - batchedCost;
    const savingsPercent = (savedCost / individualCost) * 100;
    
    return {
      batchSize,
      estimatedSavings: Math.round(savingsPercent)
    };
  }
  
  /**
   * Convert lamports to SOL
   * @param lamports Amount in lamports
   * @returns Amount in SOL
   */
  public static lamportsToSol(lamports: number): number {
    return lamports / 1_000_000_000;
  }
  
  /**
   * Convert SOL to lamports
   * @param sol Amount in SOL
   * @returns Amount in lamports
   */
  public static solToLamports(sol: number): number {
    return Math.floor(sol * 1_000_000_000);
  }
}

export default TransactionUtils;