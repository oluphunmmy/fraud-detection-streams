import { FraudQueryDto } from './dto/fraud-query.dto';
import { FraudService } from './fraud.service';
export declare class FraudController {
    private readonly fraudService;
    constructor(fraudService: FraudService);
    fraudCheck(query: FraudQueryDto): Promise<{
        userId: string;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/flagged-transaction.schema").FlaggedTransaction, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/flagged-transaction.schema").FlaggedTransaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    fraudMap(): Promise<{
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/flagged-transaction.schema").FlaggedTransaction, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/flagged-transaction.schema").FlaggedTransaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
}
