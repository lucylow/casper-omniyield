import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private defaultDuration = 5000;

  success(message: string, options?: NotificationOptions) {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || this.defaultDuration,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  error(message: string, options?: NotificationOptions) {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || this.defaultDuration,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  info(message: string, options?: NotificationOptions) {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || this.defaultDuration,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  warning(message: string, options?: NotificationOptions) {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || this.defaultDuration,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }

  loading(message: string) {
    return toast.loading(message);
  }

  dismiss(toastId?: string | number) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  }

  // Transaction-specific notifications
  transactionSubmitted(hash: string, explorerUrl?: string) {
    this.info('Transaction Submitted', {
      description: `Hash: ${hash.slice(0, 8)}...${hash.slice(-6)}`,
      action: explorerUrl ? {
        label: 'View',
        onClick: () => window.open(explorerUrl, '_blank'),
      } : undefined,
    });
  }

  transactionConfirmed(hash: string, explorerUrl?: string) {
    this.success('Transaction Confirmed', {
      description: `Hash: ${hash.slice(0, 8)}...${hash.slice(-6)}`,
      action: explorerUrl ? {
        label: 'View',
        onClick: () => window.open(explorerUrl, '_blank'),
      } : undefined,
    });
  }

  transactionFailed(error: string) {
    this.error('Transaction Failed', {
      description: error,
    });
  }

  // Wallet notifications
  walletConnected(address: string) {
    this.success('Wallet Connected', {
      description: `${address.slice(0, 8)}...${address.slice(-6)}`,
    });
  }

  walletDisconnected() {
    this.info('Wallet Disconnected');
  }

  // Yield notifications
  yieldReceived(amount: string, source: string) {
    this.success(`Yield Received: ${amount} CSPR`, {
      description: `From ${source}`,
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
