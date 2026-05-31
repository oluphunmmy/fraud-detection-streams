"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestController = void 0;
const common_1 = require("@nestjs/common");
const fraud_processor_service_1 = require("../fraud/fraud-processor.service");
const transaction_dto_1 = require("./dto/transaction.dto");
let IngestController = class IngestController {
    constructor(processor) {
        this.processor = processor;
    }
    async ingestTransaction(transaction) {
        return this.processor.process(transaction);
    }
    async ingestBatch(transactions) {
        const results = [];
        for (const transaction of transactions) {
            results.push(await this.processor.process(transaction));
        }
        return {
            processed: results.length,
            flagged: results.filter((result) => result.flagged).length,
            results,
        };
    }
};
exports.IngestController = IngestController;
__decorate([
    (0, common_1.Post)('transaction'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_dto_1.TransactionDto]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestTransaction", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestBatch", null);
exports.IngestController = IngestController = __decorate([
    (0, common_1.Controller)('ingest'),
    __metadata("design:paramtypes", [fraud_processor_service_1.FraudProcessorService])
], IngestController);
//# sourceMappingURL=ingest.controller.js.map