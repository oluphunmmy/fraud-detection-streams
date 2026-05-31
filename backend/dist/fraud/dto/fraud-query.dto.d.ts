import { FraudReason } from '../fraud.types';
export declare class FraudQueryDto {
    userId: string;
    reason?: FraudReason;
    limit?: number;
}
