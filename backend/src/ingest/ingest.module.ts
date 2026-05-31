import { Module } from '@nestjs/common';
import { FraudModule } from '../fraud/fraud.module';
import { IngestController } from './ingest.controller';

@Module({
  imports: [FraudModule],
  controllers: [IngestController],
})
export class IngestModule {}
