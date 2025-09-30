import { AccountType, TransactionType } from '@/types';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.CHECKING]: 'Cuenta Corriente',
  [AccountType.SAVINGS]: 'Caja de Ahorro',
  [AccountType.CREDIT_CARD]: 'Tarjeta de Crédito',
  [AccountType.CASH]: 'Efectivo',
  [AccountType.INVESTMENT]: 'Inversión',
  [AccountType.OTHER]: 'Otra'
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.INCOME]: 'Ingreso',
  [TransactionType.EXPENSE]: 'Gasto',
  [TransactionType.TRANSFER]: 'Transferencia'
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  ARS: '$'
};

export const DEFAULT_PAGE_SIZE = 20;
