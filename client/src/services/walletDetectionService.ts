/**
 * Wallet Detection Service
 * Detects available Casper wallet providers and their capabilities
 */

export interface WalletProvider {
  name: string;
  installed: boolean;
  type: 'extension' | 'web';
  icon?: string;
  url?: string;
}

export interface WalletStatus {
  hasWallet: boolean;
  providers: WalletProvider[];
  primaryProvider?: WalletProvider;
}

/**
 * Check if Casper Wallet extension is available
 */
export const isCasperWalletInstalled = (): boolean => {
  return (window as any).casperWalletProvider !== undefined;
};

/**
 * Check if CSPR.click is available
 */
export const isCsprClickInstalled = (): boolean => {
  return (window as any).CasperWalletProvider !== undefined;
};

/**
 * Get all available wallet providers
 */
export const getAvailableProviders = (): WalletProvider[] => {
  const providers: WalletProvider[] = [];

  if (isCasperWalletInstalled()) {
    providers.push({
      name: 'Casper Wallet',
      installed: true,
      type: 'extension',
      url: 'https://chrome.google.com/webstore/detail/casper-wallet/abkahkcbhngaebpchnke02e1b3d51b3d',
    });
  }

  if (isCsprClickInstalled()) {
    providers.push({
      name: 'CSPR.click',
      installed: true,
      type: 'web',
      url: 'https://cspr.click',
    });
  }

  // Always include recommended providers even if not installed
  if (!isCasperWalletInstalled()) {
    providers.push({
      name: 'Casper Wallet',
      installed: false,
      type: 'extension',
      url: 'https://chrome.google.com/webstore/detail/casper-wallet/abkahkcbhngaebpchnke02e1b3d51b3d',
    });
  }

  return providers;
};

/**
 * Get wallet status
 */
export const getWalletStatus = (): WalletStatus => {
  const providers = getAvailableProviders();
  const installedProviders = providers.filter(p => p.installed);

  return {
    hasWallet: installedProviders.length > 0,
    providers,
    primaryProvider: installedProviders[0],
  };
};

/**
 * Listen for wallet provider changes
 */
export const onWalletProviderChange = (callback: (status: WalletStatus) => void): (() => void) => {
  const checkInterval = setInterval(() => {
    const status = getWalletStatus();
    callback(status);
  }, 1000);

  // Also listen for window load event
  const handleLoad = () => {
    const status = getWalletStatus();
    callback(status);
  };

  window.addEventListener('load', handleLoad);

  return () => {
    clearInterval(checkInterval);
    window.removeEventListener('load', handleLoad);
  };
};

/**
 * Get wallet installation URL
 */
export const getWalletInstallUrl = (provider: string = 'casper-wallet'): string => {
  const urls: Record<string, string> = {
    'casper-wallet': 'https://chrome.google.com/webstore/detail/casper-wallet/abkahkcbhngaebpchnke02e1b3d51b3d',
    'cspr-click': 'https://cspr.click',
  };
  return urls[provider] || urls['casper-wallet'];
};

/**
 * Get wallet connection instructions
 */
export const getWalletInstructions = (): string => {
  return `
To connect your wallet:
1. Install the Casper Wallet extension from Chrome Web Store
2. Create or import your Casper account
3. Return to this page and click "Connect Wallet"
4. Approve the connection request in your wallet

For more help, visit: https://casper.network/
  `.trim();
};

/**
 * Check wallet connection status
 */
export const checkWalletConnection = async (): Promise<boolean> => {
  try {
    const casperWallet = (window as any).casperWalletProvider;
    if (casperWallet && typeof casperWallet.isConnected === 'function') {
      return await casperWallet.isConnected();
    }
    return false;
  } catch (error) {
    console.warn('Failed to check wallet connection:', error);
    return false;
  }
};

/**
 * Request wallet connection with retry logic
 */
export const requestWalletConnection = async (maxRetries: number = 3): Promise<string | null> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const casperWallet = (window as any).casperWalletProvider;
      if (casperWallet && typeof casperWallet.requestConnection === 'function') {
        const publicKey = await casperWallet.requestConnection();
        return publicKey;
      }

      const csprClick = (window as any).CasperWalletProvider;
      if (csprClick && typeof csprClick.connect === 'function') {
        const publicKey = await csprClick.connect();
        return publicKey;
      }

      throw new Error('No wallet provider found');
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError || new Error('Failed to connect wallet after retries');
};

/**
 * Get wallet network
 */
export const getWalletNetwork = async (): Promise<'testnet' | 'mainnet'> => {
  try {
    const casperWallet = (window as any).casperWalletProvider;
    if (casperWallet && typeof casperWallet.getNetwork === 'function') {
      const network = await casperWallet.getNetwork();
      return network === 'mainnet' ? 'mainnet' : 'testnet';
    }
    return 'testnet';
  } catch (error) {
    console.warn('Failed to get wallet network:', error);
    return 'testnet';
  }
};
