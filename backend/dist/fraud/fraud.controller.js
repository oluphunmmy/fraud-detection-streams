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
exports.FraudController = void 0;
const common_1 = require("@nestjs/common");
const fraud_query_dto_1 = require("./dto/fraud-query.dto");
const fraud_service_1 = require("./fraud.service");
let FraudController = class FraudController {
    constructor(fraudService) {
        this.fraudService = fraudService;
    }
    async fraudCheck(query) {
        const data = await this.fraudService.findByUser(query.userId, query.reason, query.limit);
        return {
            userId: query.userId,
            count: data.length,
            data,
        };
    }
    async fraudMap() {
        const data = await this.fraudService.getGeoFlagged();
        return {
            count: data.length,
            data,
        };
    }
};
exports.FraudController = FraudController;
__decorate([
    (0, common_1.Get)('fraud-check'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fraud_query_dto_1.FraudQueryDto]),
    __metadata("design:returntype", Promise)
], FraudController.prototype, "fraudCheck", null);
__decorate([
    (0, common_1.Get)('fraud-map'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FraudController.prototype, "fraudMap", null);
exports.FraudController = FraudController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fraud_service_1.FraudService])
], FraudController);
//# sourceMappingURL=fraud.controller.js.map