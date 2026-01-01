import { z } from 'zod';

export const depositSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    })
    .refine((val) => parseFloat(val) >= 1, {
      message: 'Minimum deposit is 1 CSPR',
    }),
});

export const withdrawSchema = z.object({
  shares: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Shares must be a positive number',
    }),
});

export const addressSchema = z
  .string()
  .min(64, 'Invalid address length')
  .max(68, 'Invalid address length')
  .regex(/^[0-9a-fA-F]+$/, 'Invalid address format');

export const validateDeposit = (amount: string, balance: string, minDeposit: string) => {
  const errors: string[] = [];
  
  const depositAmount = parseFloat(amount);
  const availableBalance = parseFloat(balance) / 1e9;
  const minDepositAmount = parseFloat(minDeposit) / 1e9;

  if (isNaN(depositAmount) || depositAmount <= 0) {
    errors.push('Please enter a valid amount');
  }

  if (depositAmount > availableBalance) {
    errors.push('Insufficient balance');
  }

  if (depositAmount < minDepositAmount) {
    errors.push(`Minimum deposit is ${minDepositAmount} CSPR`);
  }

  // Reserve 1 CSPR for gas
  if (depositAmount > availableBalance - 1) {
    errors.push('Please reserve at least 1 CSPR for gas fees');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateWithdraw = (shares: string, availableShares: string) => {
  const errors: string[] = [];
  
  const shareAmount = parseFloat(shares);
  const available = parseFloat(availableShares) / 1e9;

  if (isNaN(shareAmount) || shareAmount <= 0) {
    errors.push('Please enter a valid amount');
  }

  if (shareAmount > available) {
    errors.push('Insufficient shares');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  // Remove any potentially dangerous characters
  return input.replace(/[<>'"&]/g, '');
};

export const isValidAmount = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

export const isValidPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};
