import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type FraudReason = 'HIGH_FREQUENCY' | 'DAILY_AMOUNT_LIMIT' | 'LOCATION_JUMP';
export type FlaggedTransactionDocument = HydratedDocument<FlaggedTransaction>;
export declare class FlaggedTransaction {
    transactionId: string;
    userId: string;
    amount: number;
    timestamp: Date;
    merchant: string;
    location: string;
    reasons: FraudReason[];
    geo?: {
        lat: number;
        lng: number;
    };
}
export declare const FlaggedTransactionSchema: MongooseSchema<FlaggedTransaction, import("mongoose").Model<FlaggedTransaction, any, any, any, any, any, FlaggedTransaction>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    transactionId?: import("mongoose").SchemaDefinitionProperty<string, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<string, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timestamp?: import("mongoose").SchemaDefinitionProperty<Date, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    merchant?: import("mongoose").SchemaDefinitionProperty<string, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reasons?: import("mongoose").SchemaDefinitionProperty<FraudReason[], FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    geo?: import("mongoose").SchemaDefinitionProperty<{
        lat: number;
        lng: number;
    } | undefined, FlaggedTransaction, import("mongoose").Document<unknown, {}, FlaggedTransaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FlaggedTransaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, FlaggedTransaction>;
