import { NOWNODES_CASPER_RPC_URL } from '../utils/nownodes';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  deployHash: string;
  isReal: boolean;
  blockNumber?: number;
}

// Local storage key for transactions
const TRANSACTIONS_KEY = 'omniyield_transactions';

// Fetch transaction status from NOWNODES
const fetchTransactionStatus = async (deployHash: string): Promise<'pending' | 'confirmed' | 'failed'> => {
  try {
    const response = await fetch(NOWNODES_CASPER_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '124d260-d51a-47f1-8bc0-ed8a97a64a3e',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'info_get_deploy',
        params: [deployHash],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.warn('Deploy not found, assuming pending:', data.error);
      return 'pending';
    }

    if (data.result?.execution_results) {
      const execution = data.result.execution_results[0];
      if (execution?.result?.Success) {
        return 'confirmed';
      } else if (execution?.result?.Failure) {
        return 'failed';
      }
    }

    return 'pending';
  } catch (error) {
    console.warn('Failed to fetch transaction status:', error);
    return 'pending'; // Default to pending on error
  }
};

// Get all transactions for a wallet
export const getTransactions = async (walletPublicKey: string): Promise<Transaction[]> => {
  try {
    // Get stored transactions
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions: Transaction[] = stored ? JSON.parse(stored) : [];

    // Filter by wallet
    const walletTransactions = transactions.filter(tx => 
      tx.deployHash.includes(walletPublicKey.slice(0, 10))
    );

    // Update status of pending transactions
    const updated = await Promise.all(
      walletTransactions.map(async (tx) => {
        if (tx.status === 'pending' && tx.isReal) {
          const newStatus = await fetchTransactionStatus(tx.deployHash);
          return { ...tx, status: newStatus };
        }
        return tx;
      })
    );

    // Save updated transactions
    if (updated.some(tx => tx.status !== walletTransactions.find(w => w.id === tx.id)?.status)) {
      const allTransactions = [
        ...transactions.filter(tx => !walletTransactions.find(w => w.id === tx.id)),
        ...updated,
      ];
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
    }

    return updated;
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return [];
  }
};

// Add a new transaction
export const addTransaction = async (
  type: 'deposit' | 'withdraw',
  amount: string,
  deployHash: string,
  isReal: boolean = false
): Promise<Transaction> => {
  try {
    const transaction: Transaction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount,
      timestamp: Date.now(),
      status: isReal ? 'pending' : 'confirmed',
      deployHash,
      isReal,
    };

    // Get existing transactions
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions: Transaction[] = stored ? JSON.parse(stored) : [];

    // Add new transaction
    transactions.push(transaction);

    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.shift();
    }

    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

    // If real transaction, verify status periodically
    if (isReal) {
      verifyTransactionStatus(transaction.id, deployHash);
    }

    return transaction;
  } catch (error) {
    console.error('Failed to add transaction:', error);
    throw error;
  }
};

// Verify transaction status periodically
const verifyTransactionStatus = async (transactionId: string, deployHash: string) => {
  let attempts = 0;
  const maxAttempts = 60; // Check for up to 5 minutes (every 5 seconds)

  const checkStatus = async () => {
    try {
      const status = await fetchTransactionStatus(deployHash);
      
      if (status !== 'pending' || attempts >= maxAttempts) {
        // Update transaction status
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        const transactions: Transaction[] = stored ? JSON.parse(stored) : [];
        
        const index = transactions.findIndex(tx => tx.id === transactionId);
        if (index !== -1) {
          transactions[index].status = status;
          localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
        }
        
        return;
      }

      attempts++;
      // Check again in 5 seconds
      setTimeout(checkStatus, 5000);
    } catch (error) {
      console.error('Error verifying transaction status:', error);
    }
  };

  checkStatus();
};

// Clear transaction history
export const clearTransactionHistory = (): void => {
  localStorage.removeItem(TRANSACTIONS_KEY);
};

// Export transactions as CSV
export const exportTransactions = (transactions: Transaction[]): string => {
  const headers = ['ID', 'Type', 'Amount', 'Timestamp', 'Status', 'Deploy Hash'];
  const rows = transactions.map(tx => [
    tx.id,
    tx.type,
    tx.amount,
    new Date(tx.timestamp).toISOString(),
    tx.status,
    tx.deployHash,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
};
