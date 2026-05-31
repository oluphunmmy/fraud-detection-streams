import { FraudProcessorService } from '../fraud/fraud-processor.service';
import { TransactionDto } from './dto/transaction.dto';
import { ProcessResult } from '../fraud/fraud.types';
export declare class IngestController {
    private readonly processor;
    constructor(processor: FraudProcessorService);
    ingestTransaction(transaction: TransactionDto): Promise<ProcessResult>;
    ingestBatch(transactions: TransactionDto[]): Promise<{
        processed: number;
        flagged: number;
        results: ProcessResult[];
    }>;
}
