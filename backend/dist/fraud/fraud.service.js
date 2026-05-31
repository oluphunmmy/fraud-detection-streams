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
exports.FraudService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const flagged_transaction_schema_1 = require("./schemas/flagged-transaction.schema");
let FraudService = class FraudService {
    constructor(flaggedModel) {
        this.flaggedModel = flaggedModel;
    }
    async saveFlaggedTransaction(transaction, reasons) {
        const timestamp = new Date(transaction.timestamp);
        await this.flaggedModel.updateOne({ transactionId: transaction.transactionId }, {
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
        }, { upsert: true });
    }
    async findByUser(userId, reason, limit = 100) {
        const query = { userId };
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
};
exports.FraudService = FraudService;
exports.FraudService = FraudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(flagged_transaction_schema_1.FlaggedTransaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FraudService);
//# sourceMappingURL=fraud.service.js.map