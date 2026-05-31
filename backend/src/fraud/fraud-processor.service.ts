import { Injectable } from '@nestjs/common';
import {
  FraudReason,
  ProcessResult,
  TransactionInput,
  UserState,
  WindowTransaction,
} from './fraud.types';
import { FraudService } from './fraud.service';

const ONE_MINUTE_MS = 60 * 1000;
const TWO_MINUTES_MS = 2 * 60 * 1000;
const DAILY_LIMIT = 10_000;

@Injectable()
export class FraudProcessorService {
  private readonly userStates = new Map<string, UserState>();

  constructor(private readonly fraudService: FraudService) {}

  async process(transaction: TransactionInput): Promise<ProcessResult> {
    this.validateTransaction(transaction);

    const timestampMs = new Date(transaction.timestamp).getTime();
    const state = this.getOrCreateState(transaction.userId);
    const event: WindowTransaction = {
      transactionId: transaction.transactionId,
      timestampMs,
      amount: transaction.amount,
      location: transaction.location,
    };

    const reasons = new Set<FraudReason>();

    if (this.detectHighFrequency(state, event)) {
      reasons.add('HIGH_FREQUENCY');
    }

    if (this.detectDailyLimit(state, transaction, timestampMs)) {
      reasons.add('DAILY_AMOUNT_LIMIT');
    }

    if (this.detectLocationJump(state, event)) {
      reasons.add('LOCATION_JUMP');
    }

    this.addEventToWindows(state, event, timestampMs);

    const reasonList = Array.from(reasons);
    if (reasonList.length > 0) {
      await this.fraudService.saveFlaggedTransaction(transaction, reasonList);
    }

    return {
      transactionId: transaction.transactionId,
      userId: transaction.userId,
      flagged: reasonList.length > 0,
      reasons: reasonList,
    };
  }

  private detectHighFrequency(state: UserState, event: WindowTransaction): boolean {
    this.pruneWindow(state.oneMinuteWindow, event.timestampMs, ONE_MINUTE_MS);

    // The current transaction is not in the queue yet; +1 counts it.
    return state.oneMinuteWindow.length + 1 > 5;
  }

  private detectDailyLimit(
    state: UserState,
    transaction: TransactionInput,
    timestampMs: number,
  ): boolean {
    const dayKey = this.getUtcDayKey(timestampMs);
    const currentTotal = state.dailyTotals.get(dayKey) ?? 0;
    const newTotal = currentTotal + transaction.amount;

    state.dailyTotals.set(dayKey, newTotal);

    // This flags the transaction that causes or continues the daily breach.
    return newTotal > DAILY_LIMIT;
  }

  private detectLocationJump(state: UserState, event: WindowTransaction): boolean {
    this.pruneWindow(state.twoMinuteLocationWindow, event.timestampMs, TWO_MINUTES_MS);

    return state.twoMinuteLocationWindow.some(
      (previous) => previous.location !== event.location,
    );
  }

  private addEventToWindows(
    state: UserState,
    event: WindowTransaction,
    timestampMs: number,
  ) {
    state.oneMinuteWindow.push(event);
    state.twoMinuteLocationWindow.push(event);

    this.pruneWindow(state.oneMinuteWindow, timestampMs, ONE_MINUTE_MS);
    this.pruneWindow(state.twoMinuteLocationWindow, timestampMs, TWO_MINUTES_MS);
  }

  private pruneWindow(
    queue: WindowTransaction[],
    currentTimestampMs: number,
    windowSizeMs: number,
  ) {
    while (
      queue.length > 0 &&
      currentTimestampMs - queue[0].timestampMs >= windowSizeMs
    ) {
      queue.shift();
    }
  }

  private getOrCreateState(userId: string): UserState {
    let state = this.userStates.get(userId);

    if (!state) {
      state = {
        oneMinuteWindow: [],
        twoMinuteLocationWindow: [],
        dailyTotals: new Map<string, number>(),
      };
      this.userStates.set(userId, state);
    }

    return state;
  }

  private getUtcDayKey(timestampMs: number): string {
    return new Date(timestampMs).toISOString().slice(0, 10);
  }

  private validateTransaction(transaction: TransactionInput) {
    if (!transaction.transactionId || !transaction.userId) {
      throw new Error('transactionId and userId are required');
    }

    if (Number.isNaN(new Date(transaction.timestamp).getTime())) {
      throw new Error(`Invalid timestamp for transaction ${transaction.transactionId}`);
    }

    if (typeof transaction.amount !== 'number' || transaction.amount < 0) {
      throw new Error(`Invalid amount for transaction ${transaction.transactionId}`);
    }
  }
}
