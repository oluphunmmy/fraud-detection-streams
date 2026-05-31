"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudProcessorService = void 0;
const common_1 = require("@nestjs/common");
const fraud_service_1 = require("./fraud.service");
const ONE_MINUTE_MS = 60 * 1000;
const TWO_MINUTES_MS = 2 * 60 * 1000;
const DAILY_LIMIT = 10_000;
let FraudProcessorService = class FraudProcessorService {
    constructor(fraudService) {
        this.fraudService = fraudService;
        this.userStates = new Map();
    }
    async process(transaction) {
        this.validateTransaction(transaction);
        const timestampMs = new Date(transaction.timestamp).getTime();
        const state = this.getOrCreateState(transaction.userId);
        const event = {
            transactionId: transaction.transactionId,
            timestampMs,
            amount: transaction.amount,
            location: transaction.location,
        };
        const reasons = new Set();
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
    detectHighFrequency(state, event) {
        this.pruneWindow(state.oneMinuteWindow, event.timestampMs, ONE_MINUTE_MS);
        return state.oneMinuteWindow.length + 1 > 5;
    }
    detectDailyLimit(state, transaction, timestampMs) {
        const dayKey = this.getUtcDayKey(timestampMs);
        const currentTotal = state.dailyTotals.get(dayKey) ?? 0;
        const newTotal = currentTotal + transaction.amount;
        state.dailyTotals.set(dayKey, newTotal);
        return newTotal > DAILY_LIMIT;
    }
    detectLocationJump(state, event) {
        this.pruneWindow(state.twoMinuteLocationWindow, event.timestampMs, TWO_MINUTES_MS);
        return state.twoMinuteLocationWindow.some((previous) => previous.location !== event.location);
    }
    addEventToWindows(state, event, timestampMs) {
        state.oneMinuteWindow.push(event);
        state.twoMinuteLocationWindow.push(event);
        this.pruneWindow(state.oneMinuteWindow, timestampMs, ONE_MINUTE_MS);
        this.pruneWindow(state.twoMinuteLocationWindow, timestampMs, TWO_MINUTES_MS);
    }
    pruneWindow(queue, currentTimestampMs, windowSizeMs) {
        while (queue.length > 0 &&
            currentTimestampMs - queue[0].timestampMs >= windowSizeMs) {
            queue.shift();
        }
    }
    getOrCreateState(userId) {
        let state = this.userStates.get(userId);
        if (!state) {
            state = {
                oneMinuteWindow: [],
                twoMinuteLocationWindow: [],
                dailyTotals: new Map(),
            };
            this.userStates.set(userId, state);
        }
        return state;
    }
    getUtcDayKey(timestampMs) {
        return new Date(timestampMs).toISOString().slice(0, 10);
    }
    validateTransaction(transaction) {
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
};
exports.FraudProcessorService = FraudProcessorService;
exports.FraudProcessorService = FraudProcessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fraud_service_1.FraudService])
], FraudProcessorService);
//# sourceMappingURL=fraud-processor.service.js.map