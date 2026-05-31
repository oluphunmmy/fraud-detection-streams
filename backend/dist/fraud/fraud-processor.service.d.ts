import { ProcessResult, TransactionInput } from './fraud.types';
import { FraudService } from './fraud.service';
export declare class FraudProcessorService {
    private readonly fraudService;
    private readonly userStates;
    constructor(fraudService: FraudService);
    process(transaction: TransactionInput): Promise<ProcessResult>;
    private detectHighFrequency;
    private detectDailyLimit;
    private detectLocationJump;
    private addEventToWindows;
    private pruneWindow;
    private getOrCreateState;
    private getUtcDayKey;
    private validateTransaction;
}
