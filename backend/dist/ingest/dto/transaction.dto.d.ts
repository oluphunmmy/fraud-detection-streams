declare class GeoDto {
    lat: number;
    lng: number;
}
export declare class TransactionDto {
    transactionId: string;
    userId: string;
    amount: number;
    timestamp: string;
    merchant: string;
    location: string;
    geo?: GeoDto;
}
export {};
