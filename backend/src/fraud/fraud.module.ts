import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FraudController } from './fraud.controller';
import { FraudProcessorService } from './fraud-processor.service';
import { FraudService } from './fraud.service';
import {
  FlaggedTransaction,
  FlaggedTransactionSchema,
} from './schemas/flagged-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlaggedTransaction.name, schema: FlaggedTransactionSchema },
    ]),
  ],
  controllers: [FraudController],
  providers: [FraudService, FraudProcessorService],
  exports: [FraudService, FraudProcessorService],
})
export class FraudModule {}
