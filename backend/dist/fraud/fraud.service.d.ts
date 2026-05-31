import { Model } from 'mongoose';
import { FraudReason, TransactionInput } from './fraud.types';
import { FlaggedTransaction, FlaggedTransactionDocument } from './schemas/flagged-transaction.schema';
export declare class FraudService {
    private readonly flaggedModel;
    constructor(flaggedModel: Model<FlaggedTransactionDocument>);
    saveFlaggedTransaction(transaction: TransactionInput, reasons: FraudReason[]): Promise<void>;
    findByUser(userId: string, reason?: FraudReason, limit?: number): Promise<(import("mongoose").Document<unknown, {}, FlaggedTransaction, {}, import("mongoose").DefaultSchemaOptions> & FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getGeoFlagged(limit?: number): Promise<(import("mongoose").Document<unknown, {}, FlaggedTransaction, {}, import("mongoose").DefaultSchemaOptions> & FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
