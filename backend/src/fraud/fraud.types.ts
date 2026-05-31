export type FraudReason = 'HIGH_FREQUENCY' | 'DAILY_AMOUNT_LIMIT' | 'LOCATION_JUMP';

export interface GeoPointInput {
  lat: number;
  lng: number;
}

export interface TransactionInput {
  transactionId: string;
  userId: string;
  amount: number;
  timestamp: string | Date;
  merchant: string;
  location: string;
  geo?: GeoPointInput;
}

export interface ProcessResult {
  transactionId: string;
  userId: string;
  flagged: boolean;
  reasons: FraudReason[];
}

export interface WindowTransaction {
  transactionId: string;
  timestampMs: number;
  amount: number;
  location: string;
}

export interface UserState {
  oneMinuteWindow: WindowTransaction[];
  twoMinuteLocationWindow: WindowTransaction[];
  dailyTotals: Map<string, number>;
}
