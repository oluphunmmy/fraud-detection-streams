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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlaggedTransactionSchema = exports.FlaggedTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FlaggedTransaction = class FlaggedTransaction {
};
exports.FlaggedTransaction = FlaggedTransaction;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], FlaggedTransaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, index: true }),
    __metadata("design:type", Date)
], FlaggedTransaction.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "merchant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], FlaggedTransaction.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        required: true,
        enum: ['HIGH_FREQUENCY', 'DAILY_AMOUNT_LIMIT', 'LOCATION_JUMP'],
    }),
    __metadata("design:type", Array)
], FlaggedTransaction.prototype, "reasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], FlaggedTransaction.prototype, "geo", void 0);
exports.FlaggedTransaction = FlaggedTransaction = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'flagged_transactions',
        timestamps: true,
    })
], FlaggedTransaction);
exports.FlaggedTransactionSchema = mongoose_1.SchemaFactory.createForClass(FlaggedTransaction);
exports.FlaggedTransactionSchema.index({ userId: 1, timestamp: -1 });
exports.FlaggedTransactionSchema.index({ userId: 1, reasons: 1, timestamp: -1 });
//# sourceMappingURL=flagged-transaction.schema.js.map