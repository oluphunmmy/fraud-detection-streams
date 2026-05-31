import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FraudReason =
  | 'HIGH_FREQUENCY'
  | 'DAILY_AMOUNT_LIMIT'
  | 'LOCATION_JUMP';

export type FlaggedTransactionDocument =
  HydratedDocument<FlaggedTransaction>;

@Schema({
  collection: 'flagged_transactions',
  timestamps: true,
})
export class FlaggedTransaction {
  @Prop({ type: String, required: true, unique: true })
  transactionId!: string;

  @Prop({ type: String, required: true, index: true })
  userId!: string;

  @Prop({ type: Number, required: true })
  amount!: number;

  @Prop({ type: Date, required: true, index: true })
  timestamp!: Date;

  @Prop({ type: String, required: true })
  merchant!: string;

  @Prop({ type: String, required: true })
  location!: string;

  @Prop({
    type: [String],
    required: true,
    enum: ['HIGH_FREQUENCY', 'DAILY_AMOUNT_LIMIT', 'LOCATION_JUMP'],
  })
  reasons!: FraudReason[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  geo?: {
    lat: number;
    lng: number;
  };
}

export const FlaggedTransactionSchema =
  SchemaFactory.createForClass(FlaggedTransaction);

FlaggedTransactionSchema.index({ userId: 1, timestamp: -1 });
FlaggedTransactionSchema.index({ userId: 1, reasons: 1, timestamp: -1 });