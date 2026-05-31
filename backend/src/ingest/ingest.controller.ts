import { Body, Controller, Post } from '@nestjs/common';
import { FraudProcessorService } from '../fraud/fraud-processor.service';
import { TransactionDto } from './dto/transaction.dto';
import { ProcessResult } from '../fraud/fraud.types';

@Controller('ingest')
export class IngestController {
  constructor(private readonly processor: FraudProcessorService) {}

  @Post('transaction')
  async ingestTransaction(@Body() transaction: TransactionDto) {
    return this.processor.process(transaction);
  }

  @Post('batch')
  async ingestBatch(@Body() transactions: TransactionDto[]) {
    const results: ProcessResult[] = [];

    for (const transaction of transactions) {
      results.push(await this.processor.process(transaction));
    }

    return {
      processed: results.length,
      flagged: results.filter((result) => result.flagged).length,
      results,
    };
  }
}
