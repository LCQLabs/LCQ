import { PublicKey } from '@solana/web3.js';
import { McpClient } from '../mcp/client';
import { SolanaNetwork } from '../../config/solana-config';

/**
 * Account information with parsed token data
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
 * Account balance information
 */
export interface BalanceInfo {
  address: string;
  lamports: number;
  solBalance: number;
  tokens: TokenAccountInfo[];
  totalValueUsd?: number;
}

/**
 * Utility class for Solana account operations via MCP
 */
export class AccountUtils {
  private mcpClient: McpClient;
  
  constructor(mcpClient: McpClient) {
    this.mcpClient = mcpClient;
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
   * Get account information
   * @param address Account address
   * @param encoding Data encoding format
   * @returns Account information
   */
  public async getAccountInfo(
    address: string,
    encoding: 'base64' | 'base58' | 'jsonParsed' = 'jsonParsed'
  ): Promise<AccountInfo> {
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid Solana address: ${address}`);
    }
    
    const result = await this.mcpClient.getAccountInfo(address, encoding);
    
    return {
      address,
      owner: result.owner,
      lamports: result.lamports,
      executable: result.executable,
      rentEpoch: result.rentEpoch,
      data: result.data
    };
  }
  
  /**
   * Get SOL balance for an account
   * @param address Account address
   * @returns SOL balance in lamports
   */
  public async getBalance(address: string): Promise<number> {
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid Solana address: ${address}`);
    }
    
    const result = await this.mcpClient.execute('getBalance', { address });
    return result.value;
  }
  
  /**
   * Get all token accounts owned by a wallet
   * @param ownerAddress Wallet address
   * @returns Array of token account information
   */
  public async getTokenAccounts(ownerAddress: string): Promise<TokenAccountInfo[]> {
    if (!this.isValidAddress(ownerAddress)) {
      throw new Error(`Invalid Solana address: ${ownerAddress}`);
    }
    
    const result = await this.mcpClient.getTokenAccounts(ownerAddress);
    
    if (!result?.value) {
      return [];
    }
    
    return result.value.map((item: any) => {
      const accountInfo = item.account.data.parsed.info;
      const tokenAmount = accountInfo.tokenAmount;
      
      return {
        address: item.pubkey,
        mint: accountInfo.mint,
        owner: accountInfo.owner,
        amount: tokenAmount.amount,
        decimals: tokenAmount.decimals,
        uiAmount: tokenAmount.uiAmount,
        tokenName: accountInfo.tokenName,
        tokenSymbol: accountInfo.tokenSymbol
      };
    });
  }
  
  /**
   * Get complete balance information for an account (SOL + tokens)
   * @param address Account address
   * @param includeTokenMetadata Whether to include token metadata (name, symbol)
   * @returns Complete balance information
   */
  public async getAccountBalances(
    address: string,
    includeTokenMetadata: boolean = true
  ): Promise<BalanceInfo> {
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid Solana address: ${address}`);
    }
    
    // Get SOL balance
    const lamports = await this.getBalance(address);
    const solBalance = lamports / 1_000_000_000; // Convert lamports to SOL
    
    // Get token accounts
    const tokens = await this.getTokenAccounts(address);
    
    // If requested, fetch token metadata for tokens that don't have it
    if (includeTokenMetadata) {
      await this.enrichTokenMetadata(tokens);
    }
    
    return {
      address,
      lamports,
      solBalance,
      tokens
    };
  }
  
  /**
   * Enrich token accounts with metadata (name, symbol)
   * @param tokens Token accounts to enrich
   */
  private async enrichTokenMetadata(tokens: TokenAccountInfo[]): Promise<void> {
    const tokensNeedingMetadata = tokens.filter(token => !token.tokenName || !token.tokenSymbol);
    
    if (tokensNeedingMetadata.length === 0) {
      return;
    }
    
    // In a real implementation, this would fetch from a token list or registry
    // For demo purposes, we'll skip the actual implementation
    console.log(`Would fetch metadata for ${tokensNeedingMetadata.length} tokens`);
  }
  
  /**
   * Get account history (recent transactions)
   * @param address Account address
   * @param limit Maximum number of transactions to fetch
   * @returns Array of transaction signatures
   */
  public async getAccountHistory(address: string, limit: number = 10): Promise<string[]> {
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
   * Check if an account exists
   * @param address Account address
   * @returns True if the account exists
   */
  public async accountExists(address: string): Promise<boolean> {
    if (!this.isValidAddress(address)) {
      return false;
    }
    
    try {
      const balance = await this.getBalance(address);
      return balance > 0;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get explorer URL for an account
   * @param address Account address
   * @param network Solana network
   * @returns Explorer URL
   */
  public getExplorerUrl(address: string, network: SolanaNetwork = 'mainnet-beta'): string {
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid Solana address: ${address}`);
    }
    
    const baseUrl = network === 'mainnet-beta' 
      ? 'https://explorer.solana.com/address/' 
      : `https://explorer.solana.com/address/${address}?cluster=${network}`;
    
    return `${baseUrl}/${address}`;
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

export default AccountUtils;