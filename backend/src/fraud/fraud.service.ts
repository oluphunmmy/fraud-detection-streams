import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FraudReason, TransactionInput } from './fraud.types';
import {
  FlaggedTransaction,
  FlaggedTransactionDocument,
} from './schemas/flagged-transaction.schema';

@Injectable()
export class FraudService {
  constructor(
    @InjectModel(FlaggedTransaction.name)
    private readonly flaggedModel: Model<FlaggedTransactionDocument>,
  ) {}

  async saveFlaggedTransaction(transaction: TransactionInput, reasons: FraudReason[]) {
    const timestamp = new Date(transaction.timestamp);

    await this.flaggedModel.updateOne(
      { transactionId: transaction.transactionId },
      {
        $setOnInsert: {
          transactionId: transaction.transactionId,
          userId: transaction.userId,
          amount: transaction.amount,
          timestamp,
          merchant: transaction.merchant,
          location: transaction.location,
          geo: transaction.geo
            ? {
                type: 'Point',
                coordinates: [transaction.geo.lng, transaction.geo.lat],
              }
            : undefined,
        },
        $addToSet: {
          reasons: { $each: reasons },
        },
      },
      { upsert: true },
    );
  }

  async findByUser(userId: string, reason?: FraudReason, limit = 100) {
    const query: Record<string, unknown> = { userId };

    if (reason) {
      query.reasons = reason;
    }

    return this.flaggedModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async getGeoFlagged(limit = 1000) {
    return this.flaggedModel
      .find({ geo: { $exists: true } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}
