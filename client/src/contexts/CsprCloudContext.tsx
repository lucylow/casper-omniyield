import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  authenticateWithCsprCloud, 
  isCsprCloudAuthenticated,
  CsprCloudEventStream,
  CsprCloudEvent,
  fetchDeployInfo,
  CsprDeployInfo,
  clearCsprCloudAuth,
} from '@/services/csprCloudService';
import { toast } from 'sonner';

interface CsprCloudContextType {
  isAuthenticated: boolean;
  isConnected: boolean;
  events: CsprCloudEvent[];
  deployInfo: Record<string, CsprDeployInfo>;
  loading: boolean;
  error: string | null;
  authenticate: () => Promise<void>;
  disconnect: () => void;
  getDeployInfo: (deployHash: string) => Promise<CsprDeployInfo | null>;
  clearEvents: () => void;
}

const CsprCloudContext = createContext<CsprCloudContextType | null>(null);

export const useCsprCloud = () => {
  const context = useContext(CsprCloudContext);
  if (!context) {
    throw new Error('useCsprCloud must be used within CsprCloudProvider');
  }
  return context;
};

export const CsprCloudProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<CsprCloudEvent[]>([]);
  const [deployInfo, setDeployInfo] = useState<Record<string, CsprDeployInfo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventStream, setEventStream] = useState<CsprCloudEventStream | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = isCsprCloudAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        connectToEventStream();
      }
    };

    checkAuth();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventStream) {
        eventStream.disconnect();
      }
    };
  }, [eventStream]);

  const connectToEventStream = async () => {
    try {
      const stream = new CsprCloudEventStream();
      setEventStream(stream);
      
      // Subscribe to events
      const unsubscribe = stream.subscribe((event) => {
        setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
      });

      await stream.connect();
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to connect to event stream:', err);
      setError('Failed to connect to real-time events');
    }
  };

  const authenticate = async () => {
    setLoading(true);
    setError(null);

    try {
      const success = await authenticateWithCsprCloud();
      
      if (success) {
        setIsAuthenticated(true);
        toast.success('Connected to CSPR.cloud');
        await connectToEventStream();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Authentication failed';
      setError(errorMsg);
      toast.error(`CSPR.cloud error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (eventStream) {
      eventStream.disconnect();
      setEventStream(null);
    }
    clearCsprCloudAuth();
    setIsAuthenticated(false);
    setIsConnected(false);
    setEvents([]);
    setDeployInfo({});
    toast.success('Disconnected from CSPR.cloud');
  };

  const getDeployInfo = async (deployHash: string): Promise<CsprDeployInfo | null> => {
    try {
      // Check cache first
      if (deployInfo[deployHash]) {
        return deployInfo[deployHash];
      }

      const info = await fetchDeployInfo(deployHash);
      if (info) {
        setDeployInfo(prev => ({
          ...prev,
          [deployHash]: info,
        }));
      }
      return info;
    } catch (err) {
      console.error('Failed to fetch deploy info:', err);
      return null;
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const value: CsprCloudContextType = {
    isAuthenticated,
    isConnected,
    events,
    deployInfo,
    loading,
    error,
    authenticate,
    disconnect,
    getDeployInfo,
    clearEvents,
  };

  return (
    <CsprCloudContext.Provider value={value}>
      {children}
    </CsprCloudContext.Provider>
  );
};
