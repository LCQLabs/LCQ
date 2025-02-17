import { PublicKey } from '@solana/web3.js';
import { McpClient } from '../mcp/client';
import { SolanaNetwork } from '../../config/solana-config';

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
 * Program IDL (Interface Definition Language) information
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
 * Utility class for Solana program operations via MCP
 */
export class ProgramUtils {
  private mcpClient: McpClient;
  
  constructor(mcpClient: McpClient) {
    this.mcpClient = mcpClient;
  }
  
  /**
   * Validate a program address
   * @param programId Program ID to validate
   * @returns True if the program ID is valid
   */
  public isValidProgramId(programId: string): boolean {
    try {
      new PublicKey(programId);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get program information
   * @param programId Program ID
   * @param network Solana network
   * @returns Program information
   */
  public async getProgramInfo(
    programId: string,
    network: SolanaNetwork = 'mainnet-beta'
  ): Promise<ProgramInfo> {
    if (!this.isValidProgramId(programId)) {
      throw new Error(`Invalid program ID: ${programId}`);
    }
    
    // Get basic account info
    const result = await this.mcpClient.getProgramData(programId);
    
    if (!result) {
      throw new Error(`Program not found: ${programId}`);
    }
    
    // Check if it's executable
    if (!result.executable) {
      throw new Error(`Not a program account: ${programId}`);
    }
    
    // Get program data account (if available)
    let programData: string | undefined;
    let upgradeAuthority: string | undefined;
    
    if (result.data && result.data.program) {
      programData = result.data.program.programdataAddress;
      
      // Try to get upgrade authority
      try {
        const programDataInfo = await this.mcpClient.getAccountInfo(programData);
        if (programDataInfo.data?.parsed?.info?.upgradeAuthority) {
          upgradeAuthority = programDataInfo.data.parsed.info.upgradeAuthority;
        }
      } catch (error) {
        // Ignore errors when fetching upgrade authority
        console.error('Failed to get program data info:', error);
      }
    }
    
    return {
      address: programId,
      programData,
      upgradeAuthority,
      dataSize: result.data?.length || 0,
      executable: result.executable,
      lamports: result.lamports,
      verified: false // This would need to be checked against a registry
    };
  }
  
  /**
   * Get accounts owned by a program
   * @param programId Program ID
   * @param limit Maximum number of accounts to fetch (defaults to 100)
   * @param encoding Data encoding format
   * @returns Program accounts
   */
  public async getProgramAccounts(
    programId: string,
    limit: number = 100,
    encoding: 'base64' | 'base58' | 'jsonParsed' = 'jsonParsed'
  ): Promise<ProgramAccount[]> {
    if (!this.isValidProgramId(programId)) {
      throw new Error(`Invalid program ID: ${programId}`);
    }
    
    const result = await this.mcpClient.execute('getProgramAccounts', {
      programId,
      config: {
        encoding,
        limit
      }
    });
    
    if (!result) {
      return [];
    }
    
    return result;
  }
  
  /**
   * Get program IDL if available
   * @param programId Program ID
   * @returns Program IDL or null if not available
   */
  public async getProgramIdl(programId: string): Promise<ProgramIdl | null> {
    if (!this.isValidProgramId(programId)) {
      throw new Error(`Invalid program ID: ${programId}`);
    }
    
    try {
      const result = await this.mcpClient.execute('getProgramIdl', { programId });
      return result;
    } catch (error) {
      // IDL might not be available for all programs
      return null;
    }
  }
  
  /**
   * Check if a program is upgradeable (BPF upgradeable loader)
   * @param programId Program ID
   * @returns True if the program is upgradeable
   */
  public async isUpgradeable(programId: string): Promise<boolean> {
    const info = await this.getProgramInfo(programId);
    return !!info.programData && !!info.upgradeAuthority;
  }
  
  /**
   * Check if a program is immutable (has no upgrade authority)
   * @param programId Program ID
   * @returns True if the program is immutable
   */
  public async isImmutable(programId: string): Promise<boolean> {
    const info = await this.getProgramInfo(programId);
    return !!info.programData && !info.upgradeAuthority;
  }
  
  /**
   * Get program size in KB
   * @param programId Program ID
   * @returns Program size in KB
   */
  public async getProgramSize(programId: string): Promise<number> {
    const info = await this.getProgramInfo(programId);
    return Math.round(info.dataSize / 1024 * 100) / 100; // Convert to KB with 2 decimal places
  }
  
  /**
   * Get explorer URL for a program
   * @param programId Program ID
   * @param network Solana network
   * @returns Explorer URL
   */
  public getExplorerUrl(programId: string, network: SolanaNetwork = 'mainnet-beta'): string {
    if (!this.isValidProgramId(programId)) {
      throw new Error(`Invalid program ID: ${programId}`);
    }
    
    const baseUrl = 'https://explorer.solana.com';
    const path = `/address/${programId}`;
    const query = network !== 'mainnet-beta' ? `?cluster=${network}` : '';
    
    return `${baseUrl}${path}${query}`;
  }
  
  /**
   * Get deployment cost estimate for a program
   * @param programSize Program size in bytes
   * @returns Estimated cost in SOL
   */
  public static estimateDeploymentCost(programSize: number): number {
    // Calculate rent exempt minimum
    const rentExemptMinimum = (programSize + 128) * 0.00000696;
    
    // Add transaction fee (estimate)
    const transactionFee = 0.000005;
    
    return rentExemptMinimum + transactionFee;
  }
  
  /**
   * Get known program name if available
   * @param programId Program ID
   * @returns Program name or null if unknown
   */
  public static getKnownProgramName(programId: string): string | null {
    const knownPrograms: Record<string, string> = {
      '11111111111111111111111111111111': 'System Program',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token Account Program',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Token Metadata Program',
      'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter Aggregator v6',
      'ComputeBudget111111111111111111111111111111': 'Compute Budget Program'
    };
    
    return knownPrograms[programId] || null;
  }
}

export default ProgramUtils;