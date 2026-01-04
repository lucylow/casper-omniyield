/**
 * CSPR.cloud Integration Service
 * Handles authentication, real-time event streaming, and deploy information
 */

import { toast } from 'sonner';

// Configuration from provided keys
const CSPR_CLOUD_CONFIG = {
  // Cloud Key
  cloudKey: '019b7b71-1b08-7051-8e3d-877bb22c93a0',
  
  // CSPR.click OAuth
  csprClickAppId: '430c8ec8-052f-499e-9298-2d3cc6ea',
  csprClickKey: '7d1a1b9791344636a93e1c1b9cf87a7e',
  domain: 'https://casperdash-gpqbcfub.manus.space/',
  network: 'Casper',
  
  // API endpoints
  apiUrl: 'https://api.testnet.cspr.cloud',
  streamUrl: 'wss://streaming.testnet.cspr.cloud',
};

export interface CsprCloudEvent {
  id: string;
  type: 'deploy' | 'event' | 'block';
  contractHash: string;
  deployHash?: string;
  blockHash?: string;
  data: any;
  timestamp: number;
}

export interface CsprDeployInfo {
  deployHash: string;
  account: string;
  timestamp: string;
  status: 'pending' | 'success' | 'failure';
  cost?: string;
  errorMessage?: string;
}

/**
 * Authenticate with CSPR.cloud using the provided key
 */
export const authenticateWithCsprCloud = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${CSPR_CLOUD_CONFIG.apiUrl}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CSPR_CLOUD_CONFIG.cloudKey,
      },
      body: JSON.stringify({
        appId: CSPR_CLOUD_CONFIG.csprClickAppId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem('csprCloudToken', data.token);
    localStorage.setItem('csprCloudAuth', 'true');
    
    console.log('CSPR.cloud authentication successful');
    return true;
  } catch (error) {
    console.error('CSPR.cloud authentication failed:', error);
    return false;
  }
};

/**
 * Get stored authentication token
 */
export const getCsprCloudToken = (): string | null => {
  return localStorage.getItem('csprCloudToken');
};

/**
 * Check if authenticated with CSPR.cloud
 */
export const isCsprCloudAuthenticated = (): boolean => {
  return localStorage.getItem('csprCloudAuth') === 'true';
};

/**
 * Fetch deploy information from CSPR.cloud
 */
export const fetchDeployInfo = async (deployHash: string): Promise<CsprDeployInfo | null> => {
  try {
    const token = getCsprCloudToken();
    if (!token) {
      console.warn('Not authenticated with CSPR.cloud');
      return null;
    }

    const response = await fetch(
      `${CSPR_CLOUD_CONFIG.apiUrl}/deploys/${deployHash}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': CSPR_CLOUD_CONFIG.cloudKey,
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch deploy: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      deployHash: data.deploy_hash,
      account: data.header?.account || 'Unknown',
      timestamp: data.header?.timestamp || new Date().toISOString(),
      status: data.execution_results?.[0]?.result?.Success ? 'success' : 'failure',
      cost: data.payment?.amount,
      errorMessage: data.execution_results?.[0]?.result?.Failure?.error_message,
    };
  } catch (error) {
    console.error('Failed to fetch deploy info:', error);
    return null;
  }
};

/**
 * Stream real-time events from CSPR.cloud
 */
export class CsprCloudEventStream {
  private ws?: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: ((event: CsprCloudEvent) => void)[] = [];

  async connect(): Promise<void> {
    try {
      const token = getCsprCloudToken();
      if (!token) {
        console.warn('Not authenticated, cannot connect to event stream');
        return;
      }

      const wsUrl = new URL(CSPR_CLOUD_CONFIG.streamUrl);
      wsUrl.searchParams.append('token', token);
      wsUrl.searchParams.append('appId', CSPR_CLOUD_CONFIG.csprClickAppId);

      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = () => {
        console.log('Connected to CSPR.cloud event stream');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleEvent(data);
        } catch (error) {
          console.error('Failed to parse stream event:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Event stream error:', error);
        this.reconnect();
      };

      this.ws.onclose = () => {
        console.log('Disconnected from event stream');
        this.reconnect();
      };
    } catch (error) {
      console.error('Failed to connect to event stream:', error);
      this.reconnect();
    }
  }

  private handleEvent(data: any): void {
    const event: CsprCloudEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: data.type || 'event',
      contractHash: data.contract_hash || data.contractHash || '',
      deployHash: data.deploy_hash || data.deployHash,
      blockHash: data.block_hash || data.blockHash,
      data: data.data || data,
      timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),
    };

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting to event stream (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      toast.error('Failed to connect to real-time event stream');
    }
  }

  subscribe(listener: (event: CsprCloudEvent) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }
}

/**
 * CSPR.click OAuth integration
 */
export const initiateCsprClickOAuth = (): void => {
  try {
    const redirectUri = encodeURIComponent(CSPR_CLOUD_CONFIG.domain);
    const oauthUrl = `https://cspr.click/oauth/authorize?client_id=${CSPR_CLOUD_CONFIG.csprClickAppId}&redirect_uri=${redirectUri}&response_type=code&scope=read:account`;
    
    window.location.href = oauthUrl;
  } catch (error) {
    console.error('Failed to initiate CSPR.click OAuth:', error);
    toast.error('Failed to initiate OAuth flow');
  }
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (code: string): Promise<boolean> => {
  try {
    const response = await fetch(`${CSPR_CLOUD_CONFIG.domain}api/oauth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        appId: CSPR_CLOUD_CONFIG.csprClickAppId,
        appKey: CSPR_CLOUD_CONFIG.csprClickKey,
      }),
    });

    if (!response.ok) {
      throw new Error('OAuth callback failed');
    }

    const data = await response.json();
    localStorage.setItem('csprClickToken', data.accessToken);
    localStorage.setItem('csprClickUser', JSON.stringify(data.user));
    
    return true;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return false;
  }
};

/**
 * Get CSPR.click user info
 */
export const getCsprClickUser = (): any => {
  const user = localStorage.getItem('csprClickUser');
  return user ? JSON.parse(user) : null;
};

/**
 * Clear CSPR.cloud authentication
 */
export const clearCsprCloudAuth = (): void => {
  localStorage.removeItem('csprCloudToken');
  localStorage.removeItem('csprCloudAuth');
  localStorage.removeItem('csprClickToken');
  localStorage.removeItem('csprClickUser');
};

// Export configuration for reference
export const getCsprCloudConfig = () => CSPR_CLOUD_CONFIG;
