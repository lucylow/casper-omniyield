import { toast } from 'sonner';

export enum ErrorType {
  WALLET_CONNECTION = 'WALLET_CONNECTION',
  API_ERROR = 'API_ERROR',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorLog {
  id: string;
  type: ErrorType;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  stack?: string;
}

class ErrorHandler {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;
  private readonly LOGS_KEY = 'omniyield_error_logs';

  constructor() {
    this.loadLogs();
  }

  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(this.LOGS_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load error logs:', error);
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(this.logs.slice(-this.maxLogs)));
    } catch (error) {
      console.warn('Failed to save error logs:', error);
    }
  }

  /**
   * Handle and log errors with automatic fallback suggestions
   */
  public handle(
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, any>,
    showToast: boolean = true
  ): void {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;

    const errorLog: ErrorLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: Date.now(),
      context,
      stack,
    };

    this.logs.push(errorLog);
    this.saveLogs();

    console.error(`[${type}]`, message, context);

    if (showToast) {
      this.showErrorToast(type, message);
    }
  }

  /**
   * Handle API errors with fallback strategy
   */
  public handleApiError(
    error: any,
    fallbackAction?: () => void,
    context?: Record<string, any>
  ): void {
    let errorType = ErrorType.API_ERROR;
    let message = 'Failed to fetch data from API';

    if (error instanceof TypeError) {
      errorType = ErrorType.NETWORK_ERROR;
      message = 'Network error - please check your connection';
    } else if (error?.status === 401) {
      errorType = ErrorType.WALLET_CONNECTION;
      message = 'Authentication failed - please reconnect your wallet';
    } else if (error?.status === 429) {
      message = 'Rate limit exceeded - please try again later';
    } else if (error?.message) {
      message = error.message;
    }

    this.handle(message, errorType, { ...context, originalError: error });

    if (fallbackAction) {
      console.log('Executing fallback action');
      fallbackAction();
    }
  }

  /**
   * Handle wallet connection errors
   */
  public handleWalletError(error: any, context?: Record<string, any>): void {
    let message = 'Failed to connect wallet';

    if (error?.message?.includes('not installed')) {
      message = 'Casper Wallet extension not found. Please install it to continue.';
    } else if (error?.message?.includes('user rejected')) {
      message = 'Connection request was rejected. Please try again.';
    } else if (error?.message) {
      message = error.message;
    }

    this.handle(message, ErrorType.WALLET_CONNECTION, context);
  }

  /**
   * Handle transaction errors
   */
  public handleTransactionError(error: any, context?: Record<string, any>): void {
    let message = 'Transaction failed';

    if (error?.message?.includes('insufficient')) {
      message = 'Insufficient balance to complete this transaction';
    } else if (error?.message?.includes('timeout')) {
      message = 'Transaction timed out. Please try again.';
    } else if (error?.message?.includes('rejected')) {
      message = 'Transaction was rejected by the network';
    } else if (error?.message) {
      message = error.message;
    }

    this.handle(message, ErrorType.TRANSACTION_FAILED, context);
  }

  /**
   * Show appropriate error toast based on error type
   */
  private showErrorToast(type: ErrorType, message: string): void {
    const toastMessage = this.getToastMessage(type, message);
    toast.error(toastMessage);
  }

  /**
   * Get user-friendly error message
   */
  private getToastMessage(type: ErrorType, message: string): string {
    switch (type) {
      case ErrorType.WALLET_CONNECTION:
        return `Wallet Error: ${message}`;
      case ErrorType.API_ERROR:
        return `API Error: Using cached data. ${message}`;
      case ErrorType.TRANSACTION_FAILED:
        return `Transaction Error: ${message}`;
      case ErrorType.INSUFFICIENT_BALANCE:
        return 'Insufficient balance. Please deposit more CSPR.';
      case ErrorType.NETWORK_ERROR:
        return 'Network error. Please check your connection.';
      default:
        return `Error: ${message}`;
    }
  }

  /**
   * Get all error logs
   */
  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by type
   */
  public getLogsByType(type: ErrorType): ErrorLog[] {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(this.LOGS_KEY);
  }

  /**
   * Export logs as JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error statistics
   */
  public getStatistics(): Record<ErrorType, number> {
    const stats: Record<ErrorType, number> = {
      [ErrorType.WALLET_CONNECTION]: 0,
      [ErrorType.API_ERROR]: 0,
      [ErrorType.TRANSACTION_FAILED]: 0,
      [ErrorType.INSUFFICIENT_BALANCE]: 0,
      [ErrorType.NETWORK_ERROR]: 0,
      [ErrorType.UNKNOWN]: 0,
    };

    this.logs.forEach(log => {
      stats[log.type]++;
    });

    return stats;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
