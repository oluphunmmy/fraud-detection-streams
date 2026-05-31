import { Controller, Get, Query } from '@nestjs/common';
import { FraudQueryDto } from './dto/fraud-query.dto';
import { FraudService } from './fraud.service';

@Controller()
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Get('fraud-check')
  async fraudCheck(@Query() query: FraudQueryDto) {
    const data = await this.fraudService.findByUser(
      query.userId,
      query.reason,
      query.limit,
    );

    return {
      userId: query.userId,
      count: data.length,
      data,
    };
  }

  @Get('fraud-map')
  async fraudMap() {
    const data = await this.fraudService.getGeoFlagged();

    return {
      count: data.length,
      data,
    };
  }
}
