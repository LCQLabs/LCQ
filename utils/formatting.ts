/**
 * Formatting utility functions for LCQ application
 */

import { TransactionInfo, TokenTransferInfo, SolTransferInfo } from '../types/solana';

/**
 * Format a Solana public key for display
 * @param address Full Solana address
 * @param prefixLength Number of characters to show at start
 * @param suffixLength Number of characters to show at end
 * @returns Formatted address string with ellipsis
 */
export function formatAddress(
  address: string,
  prefixLength = 4,
  suffixLength = 4
): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);
  
  return `${prefix}...${suffix}`;
}

/**
 * Format SOL amount with appropriate precision
 * @param lamports Amount in lamports
 * @param precision Number of decimal places
 * @returns Formatted SOL amount as string
 */
export function formatSol(lamports: number, precision = 4): string {
  const sol = lamports / 1_000_000_000;
  return sol.toLocaleString(undefined, {
    minimumFractionDigits: Math.min(precision, 9),
    maximumFractionDigits: Math.min(precision, 9)
  });
}

/**
 * Format token amount with appropriate precision
 * @param amount Raw token amount (string or number)
 * @param decimals Token decimals
 * @param precision Maximum decimal places to display
 * @returns Formatted token amount as string
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number,
  precision = 4
): string {
  // Convert string amount to number
  const rawAmount = typeof amount === 'string' ? Number(amount) : amount;
  
  // Handle potential NaN
  if (isNaN(rawAmount)) return '0';
  
  // Calculate actual token amount
  const tokenAmount = rawAmount / Math.pow(10, decimals);
  
  // Format with appropriate precision
  return tokenAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(precision, decimals)
  });
}

/**
 * Format USD value
 * @param value USD value
 * @param precision Number of decimal places
 * @returns Formatted USD amount as string
 */
export function formatUsd(value: number, precision = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  
  // Format based on value size
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}M`;
  } else if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}K`;
  }
  
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: Math.min(precision, 2),
    maximumFractionDigits: Math.min(precision, 6)
  })}`;
}

/**
 * Format percentage value
 * @param value Percentage value (0-100)
 * @param precision Number of decimal places
 * @returns Formatted percentage as string
 */
export function formatPercentage(value: number, precision = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision
  })}%`;
}

/**
 * Format transaction signature for display
 * @param signature Transaction signature
 * @param prefixLength Number of characters to show at start
 * @param suffixLength Number of characters to show at end
 * @returns Formatted signature with ellipsis
 */
export function formatSignature(
  signature: string,
  prefixLength = 4,
  suffixLength = 4
): string {
  return formatAddress(signature, prefixLength, suffixLength);
}

/**
 * Format date to locale string
 * @param timestamp Unix timestamp (seconds or milliseconds)
 * @param includeTime Whether to include time
 * @returns Formatted date string
 */
export function formatDate(timestamp: number, includeTime = true): string {
  // Ensure timestamp is in milliseconds
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
  const date = new Date(ms);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  
  return date.toLocaleDateString(undefined, options);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param timestamp Unix timestamp (seconds or milliseconds)
 * @returns Human-readable relative time
 */
export function formatRelativeTime(timestamp: number): string {
  // Ensure timestamp is in milliseconds
  const ms = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
  const now = Date.now();
  const diffMs = now - ms;
  
  // Convert to seconds
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds < 60) {
    return diffSeconds <= 5 ? 'just now' : `${diffSeconds} seconds ago`;
  }
  
  // Convert to minutes
  const diffMinutes = Math.floor(diffSeconds / 60);
  
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Convert to hours
  const diffHours = Math.floor(diffMinutes / 60);
  
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Convert to days
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Convert to months
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  // Convert to years
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Format file size
 * @param bytes Size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size (e.g., "1.5 KB")
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format transaction summary
 * @param transaction Transaction info
 * @returns Human-readable summary of the transaction
 */
export function formatTransactionSummary(transaction: TransactionInfo): string {
  // Count SOL transfers
  const solTransfers = transaction.solTransfers.length;
  
  // Count token transfers
  const tokenTransfers = transaction.tokenTransfers.length;
  
  // Count program invocations
  const programCount = transaction.programInvocations.length;
  
  // Build summary
  const parts = [];
  
  if (solTransfers > 0) {
    const totalSol = transaction.solTransfers.reduce((sum, t) => sum + t.solAmount, 0);
    parts.push(`${solTransfers} SOL transfer${solTransfers > 1 ? 's' : ''} (${formatSol(totalSol * 1_000_000_000)} SOL)`);
  }
  
  if (tokenTransfers > 0) {
    parts.push(`${tokenTransfers} token transfer${tokenTransfers > 1 ? 's' : ''}`);
  }
  
  if (programCount > 0) {
    parts.push(`${programCount} program${programCount > 1 ? 's' : ''} involved`);
  }
  
  // Add status
  const statusText = transaction.status === 'success' ? 'Successful' : 'Failed';
  
  // Add timestamp
  const timeText = formatRelativeTime(transaction.blockTime);
  
  return `${statusText} transaction ${parts.join(', ')} (${timeText})`;
}

/**
 * Format token transfer for display
 * @param transfer Token transfer info
 * @returns Human-readable token transfer description
 */
export function formatTokenTransfer(transfer: TokenTransferInfo): string {
  const amount = formatTokenAmount(transfer.amount, transfer.decimals);
  const symbol = transfer.tokenSymbol || 'tokens';
  const from = formatAddress(transfer.fromAddress);
  const to = formatAddress(transfer.toAddress);
  
  return `${amount} ${symbol} from ${from} to ${to}`;
}

/**
 * Format SOL transfer for display
 * @param transfer SOL transfer info
 * @returns Human-readable SOL transfer description
 */
export function formatSolTransfer(transfer: SolTransferInfo): string {
  const amount = formatSol(transfer.lamports);
  const from = formatAddress(transfer.fromAddress);
  const to = formatAddress(transfer.toAddress);
  
  return `${amount} SOL from ${from} to ${to}`;
}

/**
 * Format number with appropriate suffix (K, M, B, T)
 * @param value Numeric value
 * @param precision Number of decimal places
 * @returns Formatted number with suffix
 */
export function formatCompactNumber(value: number, precision = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (abs >= 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000_000).toFixed(precision)}T`;
  }
  
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(precision)}B`;
  }
  
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(precision)}M`;
  }
  
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(precision)}K`;
  }
  
  return value.toFixed(precision);
}

/**
 * Format time duration in seconds to human-readable format
 * @param seconds Duration in seconds
 * @returns Formatted time string (e.g., "2h 30m")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ${minutes % 60}m`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export default {
  formatAddress,
  formatSol,
  formatTokenAmount,
  formatUsd,
  formatPercentage,
  formatSignature,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatTransactionSummary,
  formatTokenTransfer,
  formatSolTransfer,
  formatCompactNumber,
  formatDuration
};